'use client'

import { FolderIcon } from '@/shared/assets/icons/FolderIcon'
import { EmptyState, ErrorState, LoadingState } from '@/shared/ui/states/async-state'
import { Button } from '@/shared/ui/button/Button'
import { FOLDER_KEYS } from '@/shared/config/query-keys'
import {
	getReceivedShares,
	getSentShares,
} from '@/entities/share/api/share.queries'
import { revokeShare } from '@/features/revoke-share/api/revoke-share.api'
import { updateSharePermission } from '@/features/update-share-permission/api/update-share-permission.api'
import type { IResourceShare, SharePermission } from '@/entities/share/model/share.types'
import { formatBytes } from '@/shared/lib/formatBytes.util'
import { formatDate } from '@/shared/lib/formatDate.util'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FileText, Trash2 } from 'lucide-react'
import { Download } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { getDownloadUrl } from '@/entities/file/api/file.queries'
import { useToastStore } from '@/shared/ui/toast/model/toast.store'
import { invalidateStorageQueries } from '@/shared/lib/invalidate-storage-queries'
import { Avatar as UserAvatar } from '@/shared/ui/avatar/Avatar'

type SharesTab = 'received' | 'sent'

function Avatar({ user }: { user?: { name: string; avatarUrl?: string | null } }) {
	return <UserAvatar name={user?.name} avatarUrl={user?.avatarUrl} className='size-8 border-2 border-card text-xs' />
}

function FolderCollaborators({ share }: { share: IResourceShare }) {
	const secondEditor = share.editors.find(editor => editor.id !== share.owner?.id)
	return (
		<div className='flex -space-x-2' title={share.permission === 'editor' ? 'Есть доступ на редактирование' : 'Владелец папки'}>
			<Avatar user={share.owner} />
			{share.permission === 'editor' && secondEditor && <Avatar user={secondEditor} />}
		</div>
	)
}

export default function SharedPage() {
	const [tab, setTab] = useState<SharesTab>('received')
	const queryClient = useQueryClient()
	const showToast = useToastStore(state => state.show)
	const query = useQuery({
		queryKey: [...FOLDER_KEYS.shares, tab],
		queryFn: tab === 'received' ? getReceivedShares : getSentShares,
	})
	const refresh = () => {
		void queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.shares })
		void invalidateStorageQueries(queryClient)
	}
	const revokeMutation = useMutation({
		mutationFn: revokeShare,
		onSuccess: refresh,
		onError: () => showToast('Не удалось отозвать доступ', 'error'),
	})
	const permissionMutation = useMutation({
		mutationFn: ({ shareId, permission }: { shareId: string; permission: SharePermission }) =>
			updateSharePermission(shareId, permission),
		onSuccess: refresh,
		onError: () => showToast('Не удалось изменить уровень доступа', 'error'),
	})
	const downloadMutation = useMutation({
		mutationFn: getDownloadUrl,
		onSuccess: ({ downloadUrl }) => window.location.assign(downloadUrl),
		onError: () => showToast('Не удалось подготовить файл к скачиванию', 'error'),
	})
	const shares = query.data?.data ?? []
	const folders = shares.filter(share => share.resource.type === 'folder')
	const files = shares.filter(share => share.resource.type === 'file')

	return (
		<section className='flex min-w-0 flex-col gap-5'>
			<div>
				<h1 className='text-2xl font-semibold text-foreground'>Общие файлы</h1>
				<p className='mt-1 text-sm text-muted-foreground'>
					Файлы и папки, которыми поделились с вами, и выданные вами доступы.
				</p>
			</div>
			<div className='flex gap-2'>
				<Button
					variant={tab === 'received' ? 'primary' : 'secondary'}
					onClick={() => setTab('received')}
				>
					Входящие
				</Button>
				<Button
					variant={tab === 'sent' ? 'primary' : 'secondary'}
					onClick={() => setTab('sent')}
				>
					Отправленные
				</Button>
			</div>

			{query.isPending ? (
				<LoadingState title='Загружаем доступы' />
			) : query.isError ? (
				<ErrorState
					description={query.error.message}
					onRetry={() => void query.refetch()}
				/>
			) : shares.length === 0 ? (
				<EmptyState
					title={tab === 'received' ? 'Нет входящих доступов' : 'Нет выданных доступов'}
					description='Поделитесь файлом или папкой через контекстное меню.'
				/>
			) : (
				<div className='space-y-6'>
					{folders.length > 0 && (
						<div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'>
								{folders.map(share => (
									<div
										key={share.id}
										className='group relative flex min-w-0 flex-col items-center rounded-xl p-3 hover:bg-muted'
									>
										<div className='absolute right-2 top-2'><FolderCollaborators share={share} /></div>
										<Link href={`/folders/${share.resource.id}`} className='flex w-full flex-col items-center'>
											<FolderIcon size={72} />
											<p className='mt-2 w-full truncate text-center text-sm font-medium text-foreground'>
												{share.resource.name}
											</p>
										</Link>
										<p className='mt-0.5 text-xs text-muted-foreground'>
											{tab === 'sent'
												? `Для ${share.recipient?.name ?? share.recipient?.email}`
												: share.permission === 'editor' ? 'Редактирование' : 'Просмотр'}
										</p>
										{tab === 'sent' && (
											<div className='mt-3 flex w-full flex-col gap-2'>
												<select
													value={share.permission}
													disabled={permissionMutation.isPending && permissionMutation.variables?.shareId === share.id}
													onChange={event => permissionMutation.mutate({ shareId: share.id, permission: event.target.value as SharePermission })}
													className='rounded-lg border border-border bg-card px-2 py-1.5 text-xs text-foreground'
												>
													<option value='viewer'>Просмотр</option>
													<option value='editor'>Редактирование</option>
												</select>
												<Button variant='ghost' className='px-2 py-1 text-xs text-destructive hover:text-destructive' disabled={revokeMutation.isPending && revokeMutation.variables === share.id} onClick={() => revokeMutation.mutate(share.id)}>
													<Trash2 size={14} /> Отозвать
												</Button>
											</div>
										)}
									</div>
								))}
						</div>
					)}
					{files.length > 0 && (
						<div className='divide-y overflow-hidden rounded-xl border border-border'>
								{files.map(share => {
						return (
							<div
								key={share.id}
								className='flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between'
							>
									<div className='flex min-w-0 items-center gap-3'>
									<FileText size={30} className='shrink-0 text-muted-foreground' />
									<div className='min-w-0'>
										<p className='truncate font-medium text-foreground'>{share.resource.name}</p>
										<p className='mt-1 text-sm text-muted-foreground'>
											{tab === 'received'
												? `От ${share.owner?.name ?? share.owner?.email}`
												: `Для ${share.recipient?.name ?? share.recipient?.email}`}
											 · {share.permission === 'editor' ? 'Редактирование' : 'Просмотр'}
											{share.resource.size && ` · ${formatBytes(share.resource.size)}`}
											 · {formatDate(share.updatedAt)}
										</p>
									</div>
									</div>
									<Button
										variant='secondary'
										className='px-3'
										disabled={downloadMutation.isPending && downloadMutation.variables === share.resource.id}
										onClick={() => downloadMutation.mutate(share.resource.id)}
									>
										<Download size={16} /> Скачать
									</Button>
								{tab === 'sent' && (
									<div className='flex flex-wrap items-center gap-2'>
											<select
												value={share.permission}
												disabled={permissionMutation.isPending && permissionMutation.variables?.shareId === share.id}
											onChange={event =>
												permissionMutation.mutate({
													shareId: share.id,
													permission: event.target.value as SharePermission,
												})
											}
											className='rounded-lg border border-border bg-card px-2 py-1.5 text-sm text-foreground'
										>
											<option value='viewer'>Просмотр</option>
											<option value='editor'>Редактирование</option>
										</select>
										<Button
											variant='ghost'
											className='px-3 text-destructive hover:text-destructive'
											disabled={revokeMutation.isPending}
											onClick={() => revokeMutation.mutate(share.id)}
										>
											<Trash2 size={16} /> Отозвать
										</Button>
									</div>
								)}
							</div>
						)
							})}
						</div>
					)}
				</div>
			)}
		</section>
	)
}
