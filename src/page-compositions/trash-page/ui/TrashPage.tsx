'use client'

import { EmptyState, ErrorState, LoadingState } from '@/shared/ui/states/async-state'
import { Button } from '@/shared/ui/button/Button'
import { Card } from '@/shared/ui/Card/card'
import ModalContainer from '@/shared/ui/modal/Modal'
import { TRASH_KEY } from '@/shared/config/query-keys'
import { getTrash, hardDeleteFolder, restoreFromTrash } from '@/entities/folder/api/folder.queries'
import type { IDeleteFolder } from '@/entities/folder/model/folder.types'
import { formatDate } from '@/shared/lib/formatDate.util'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FileText, FolderIcon, RotateCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import useAuthStore from '@/entities/session/model/session.store'
import { useToastStore } from '@/shared/ui/toast/model/toast.store'
import { invalidateStorageQueries } from '@/shared/lib/invalidate-storage-queries'
import { Avatar } from '@/shared/ui/avatar/Avatar'
import useLanguage from '@/shared/language/model'
import { translate } from '@/shared/language/translations'

export function BasketTemplate() {
	const [pendingPermanentDelete, setPendingPermanentDelete] = useState<{
		item: IDeleteFolder
		name: string
	} | null>(null)
	const [deletedByFilter, setDeletedByFilter] = useState<'all' | 'me' | 'others'>('all')
	const user = useAuthStore(state => state.user)
	const showToast = useToastStore(state => state.show)
	const language = useLanguage(state => state.language)
	const t = useLanguage(state => state.t)
	const queryClient = useQueryClient()
	const { data, isPending, isError, error, refetch } = useQuery({
		queryKey: TRASH_KEY,
		queryFn: getTrash,
	})

	const refreshStorage = () => {
		void invalidateStorageQueries(queryClient)
	}

	const restoreMutation = useMutation({
		mutationFn: restoreFromTrash,
		onSuccess: () => { refreshStorage(); showToast(t.resourceRestored) },
		onError: () => showToast(t.restoreResourceFailed, 'error'),
	})
	const hardDeleteMutation = useMutation({
		mutationFn: hardDeleteFolder,
		onSuccess: () => { refreshStorage(); showToast(t.resourceDeletedPermanently) },
		onError: () => showToast(t.deleteResourceFailed, 'error'),
	})

	const handleHardDelete = (item: IDeleteFolder, name: string) =>
		setPendingPermanentDelete({ item, name })

	if (isPending) return <LoadingState title={t.loadingTrash} />
	if (isError) {
		return <ErrorState description={error.message} onRetry={() => void refetch()} />
	}

	const folders = data?.data.folders ?? []
	const files = data?.data.files ?? []
	const entries = [
		...folders.map(folder => ({
			id: folder.id,
			name: folder.name,
			type: 'folder' as const,
			deletedAt: undefined,
			deletedBy: folder.deletedBy,
		})),
		...files.map(file => ({
			id: file.id,
			name: file.name,
			type: 'file' as const,
			deletedAt: file.deletedAt,
			deletedBy: file.deletedBy,
		})),
	].filter(item => deletedByFilter === 'all' || (deletedByFilter === 'me' ? item.deletedBy?.id === user?.id : item.deletedBy?.id !== user?.id))

	return (
		<section className='flex h-full min-w-0 flex-col gap-5'>
			<div>
				<h1 className='text-2xl font-semibold text-foreground'>{t.trash}</h1>
				<p className='mt-1 text-sm text-muted-foreground'>
					{t.trashDescription}
				</p>
			</div>
			<div className='flex gap-2'>
				{([['all', t.allItems], ['me', t.deletedByMe], ['others', t.deletedByOthers]] as const).map(([value, label]) => <Button key={value} variant={deletedByFilter === value ? 'primary' : 'secondary'} className='px-3' onClick={() => setDeletedByFilter(value)}>{label}</Button>)}
			</div>

			{entries.length === 0 ? (
				<EmptyState
					title={t.trashEmpty}
					description={t.trashEmptyDescription}
				/>
			) : (
				<>
					<div className='space-y-2 md:hidden'>
						{entries.map(item => {
							const payload: IDeleteFolder = { id: item.id, type: item.type }
							const isMutating =
								restoreMutation.isPending || hardDeleteMutation.isPending

							return (
								<article
									key={`${item.type}-${item.id}`}
									className='rounded-xl border border-border bg-card p-4'
								>
									<div className='flex min-w-0 items-center gap-3 font-medium text-foreground'>
										{item.type === 'folder' ? (
											<FolderIcon size={22} className='shrink-0 text-muted-foreground' />
										) : (
											<FileText size={22} className='shrink-0 text-muted-foreground' />
										)}
									<span className='truncate'>{item.name}</span>
									</div>
									<p className='mt-2 text-sm text-muted-foreground'>
										{item.type === 'folder' ? t.folder : t.file} ·{' '}
										{item.deletedAt ? formatDate(item.deletedAt, language) : '—'} · {item.deletedBy?.name ?? t.unknown}
									</p>
									<div className='mt-4 flex flex-wrap gap-2'>
										<Button
											variant='secondary'
											className='px-3 py-1.5 text-sm'
											disabled={isMutating}
											onClick={() => restoreMutation.mutate(payload)}
										>
										<RotateCcw size={16} /> {t.restore}
										</Button>
										<Button
											variant='ghost'
											className='px-3 py-1.5 text-sm text-destructive hover:text-destructive'
											disabled={isMutating}
											onClick={() => handleHardDelete(payload, item.name)}
										>
										<Trash2 size={16} /> {t.deleteForever}
										</Button>
									</div>
								</article>
							)
						})}
					</div>
					<div className='hidden overflow-x-auto rounded-xl border border-border md:block'>
						<div className='min-w-180 divide-y divide-border'>
						<div className='grid grid-cols-[minmax(16rem,1fr)_8rem_10rem_10rem_15rem] bg-muted px-4 py-3 text-sm font-medium text-muted-foreground'>
							<span>{t.name}</span>
							<span>{t.type}</span>
							<span>{t.deleted}</span>
							<span>{t.deletedBy}</span>
							<span>{t.actions}</span>
						</div>
						{entries.map(item => {
							const payload: IDeleteFolder = { id: item.id, type: item.type }
							const isMutating =
								restoreMutation.isPending || hardDeleteMutation.isPending

							return (
								<div
									key={`${item.type}-${item.id}`}
									className='grid grid-cols-[minmax(16rem,1fr)_8rem_10rem_10rem_15rem] items-center px-4 py-3 text-sm'
								>
									<span className='flex min-w-0 items-center gap-3 font-medium text-foreground'>
										{item.type === 'folder' ? (
											<FolderIcon size={22} className='shrink-0 text-muted-foreground' />
										) : (
											<FileText size={22} className='shrink-0 text-muted-foreground' />
										)}
										<span className='truncate'>{item.name}</span>
									</span>
									<span className='text-muted-foreground'>
										{item.type === 'folder' ? t.folder : t.file}
									</span>
									<span className='text-muted-foreground'>
										{item.deletedAt ? formatDate(item.deletedAt, language) : '—'}
									</span>
									<span className='flex items-center gap-2 truncate text-muted-foreground'><Avatar name={item.deletedBy?.name} avatarUrl={item.deletedBy?.avatarUrl} avatarColor={item.deletedBy?.avatarColor} id={item.deletedBy?.id} alt='' className='size-6 text-[10px]' />{item.deletedBy?.name ?? '—'}</span>
									<div className='flex items-center gap-2'>
										<Button
											variant='secondary'
											className='px-3 py-1.5 text-sm'
											disabled={isMutating}
											onClick={() => restoreMutation.mutate(payload)}
										>
											<RotateCcw size={16} /> {t.restore}
										</Button>
										<Button
											variant='ghost'
											className='px-3 py-1.5 text-sm text-destructive hover:text-destructive'
											disabled={isMutating}
											onClick={() => handleHardDelete(payload, item.name)}
										>
											<Trash2 size={16} /> {t.deleteForever}
										</Button>
									</div>
								</div>
							)
						})}
					</div>
				</div>
				</>
			)}
			{pendingPermanentDelete && (
				<ModalContainer isOpen onClose={() => setPendingPermanentDelete(null)}>
					<Card className='w-[min(100vw-2rem,28rem)] p-5'>
						<h2 className='text-lg font-semibold text-foreground'>{t.deleteForeverQuestion}</h2>
						<p className='mt-2 text-sm text-muted-foreground'>{translate(language, 'permanentDeleteDescription', { name: pendingPermanentDelete.name })}</p>
						<div className='mt-5 flex justify-end gap-2'>
							<Button variant='secondary' onClick={() => setPendingPermanentDelete(null)}>{t.cancel}</Button>
							<Button variant='destructive' disabled={hardDeleteMutation.isPending} onClick={() => hardDeleteMutation.mutate(pendingPermanentDelete.item, { onSuccess: () => setPendingPermanentDelete(null) })}>{t.deleteForever}</Button>
						</div>
					</Card>
				</ModalContainer>
			)}
		</section>
	)
}
