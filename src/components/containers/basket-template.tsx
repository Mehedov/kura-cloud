'use client'

import { EmptyState, ErrorState, LoadingState } from '@/components/ui/states/async-state'
import { Button } from '@/components/ui/button/Button'
import { FOLDER_KEYS } from '@/constants/queryKeys'
import { getTrash, hardDeleteFolder, restoreFromTrash } from '@/services/folder.service'
import type { IDeleteFolder } from '@/types/folder.type'
import { formatDate } from '@/utils/formatDate.util'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FileText, FolderIcon, RotateCcw, Trash2 } from 'lucide-react'

const TRASH_KEY = ['trash'] as const

export function BasketTemplate() {
	const queryClient = useQueryClient()
	const { data, isPending, isError, error, refetch } = useQuery({
		queryKey: TRASH_KEY,
		queryFn: getTrash,
	})

	const refreshStorage = () => {
		queryClient.invalidateQueries({ queryKey: TRASH_KEY })
		queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.all })
		queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.root })
		queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.files })
		queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.suggested })
	}

	const restoreMutation = useMutation({
		mutationFn: restoreFromTrash,
		onSuccess: refreshStorage,
	})
	const hardDeleteMutation = useMutation({
		mutationFn: hardDeleteFolder,
		onSuccess: refreshStorage,
	})

	const handleHardDelete = (item: IDeleteFolder) => {
		if (confirm('Удалить навсегда? Это действие нельзя отменить.')) {
			hardDeleteMutation.mutate(item)
		}
	}

	if (isPending) return <LoadingState title='Загружаем корзину' />
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
		})),
		...files.map(file => ({
			id: file.id,
			name: file.name,
			type: 'file' as const,
			deletedAt: file.deletedAt,
		})),
	]

	return (
		<section className='flex h-full min-w-0 flex-col gap-5'>
			<div>
				<h1 className='text-2xl font-semibold text-foreground'>Корзина</h1>
				<p className='mt-1 text-sm text-muted-foreground'>
					Восстановите нужные файлы и папки или удалите их навсегда.
				</p>
			</div>

			{entries.length === 0 ? (
				<EmptyState
					title='Корзина пуста'
					description='Удалённые файлы и папки появятся здесь.'
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
										{item.type === 'folder' ? 'Папка' : 'Файл'} ·{' '}
										{item.deletedAt ? formatDate(item.deletedAt) : '—'}
									</p>
									<div className='mt-4 flex flex-wrap gap-2'>
										<Button
											variant='secondary'
											className='px-3 py-1.5 text-sm'
											disabled={isMutating}
											onClick={() => restoreMutation.mutate(payload)}
										>
											<RotateCcw size={16} /> Восстановить
										</Button>
										<Button
											variant='ghost'
											className='px-3 py-1.5 text-sm text-destructive hover:text-destructive'
											disabled={isMutating}
											onClick={() => handleHardDelete(payload)}
										>
											<Trash2 size={16} /> Удалить навсегда
										</Button>
									</div>
								</article>
							)
						})}
					</div>
					<div className='hidden overflow-x-auto rounded-xl border border-border md:block'>
					<div className='min-w-160 divide-y divide-border'>
						<div className='grid grid-cols-[minmax(16rem,1fr)_8rem_10rem_15rem] bg-muted px-4 py-3 text-sm font-medium text-muted-foreground'>
							<span>Название</span>
							<span>Тип</span>
							<span>Удалено</span>
							<span>Действия</span>
						</div>
						{entries.map(item => {
							const payload: IDeleteFolder = { id: item.id, type: item.type }
							const isMutating =
								restoreMutation.isPending || hardDeleteMutation.isPending

							return (
								<div
									key={`${item.type}-${item.id}`}
									className='grid grid-cols-[minmax(16rem,1fr)_8rem_10rem_15rem] items-center px-4 py-3 text-sm'
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
										{item.type === 'folder' ? 'Папка' : 'Файл'}
									</span>
									<span className='text-muted-foreground'>
										{item.deletedAt ? formatDate(item.deletedAt) : '—'}
									</span>
									<div className='flex items-center gap-2'>
										<Button
											variant='secondary'
											className='px-3 py-1.5 text-sm'
											disabled={isMutating}
											onClick={() => restoreMutation.mutate(payload)}
										>
											<RotateCcw size={16} /> Восстановить
										</Button>
										<Button
											variant='ghost'
											className='px-3 py-1.5 text-sm text-destructive hover:text-destructive'
											disabled={isMutating}
											onClick={() => handleHardDelete(payload)}
										>
											<Trash2 size={16} /> Удалить навсегда
										</Button>
									</div>
								</div>
							)
						})}
					</div>
				</div>
				</>
			)}
		</section>
	)
}
