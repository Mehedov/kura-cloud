'use client'

import { EmptyState, ErrorState, LoadingState, NoResultsState } from '@/shared/ui/states/async-state'
import { Button } from '@/shared/ui/button/Button'
import { FolderBrowserSearch } from '@/widgets/folder-browser/ui/FolderToolbar'
import { ResourceActionsDialogs } from '@/features/manage-resource/ui/ResourceActionsDialogs'
import { ShareResourceDialog } from '@/features/share-resource/ui/ShareResourceDialog'
import ModalContainer from '@/shared/ui/modal/Modal'
import { Card } from '@/shared/ui/Card/card'
import {
	Popover,
	PopoverContext,
} from '@/shared/ui/popover/popover'
import { PopoverContent } from '@/shared/ui/popover/popover-content'
import { ContextMenuTrigger } from '@/shared/ui/popover/context-menu-trigger'
import { PHOTOS } from '@/shared/config/query-keys'
import { useFolderItemsFilters } from '@/features/folder-filters/model/use-folder-filters'
import { getPhotos, getPreviewUrl } from '@/entities/file/api/file.queries'
import { moveToTrash, restoreFromTrash } from '@/entities/folder/api/folder.queries'
import type { IFolderItemsParams } from '@/entities/folder/model/folder.types'
import type { PhotoFileDto } from '@/entities/file/model/file.types'
import { formatFileName } from '@/shared/lib/formatFileName.util'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ExternalLink, ImageIcon, Pencil, RefreshCw, Share2, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { invalidateStorageQueries } from '@/shared/lib/invalidate-storage-queries'
import { useToastStore } from '@/shared/ui/toast/model/toast.store'

export default function PhotosPage() {
	const queryClient = useQueryClient()
	const showToast = useToastStore(state => state.show)
	const [previewedPhoto, setPreviewedPhoto] = useState<PhotoFileDto | null>(null)
	const [renamedPhoto, setRenamedPhoto] = useState<PhotoFileDto | null>(null)
	const [sharedPhoto, setSharedPhoto] = useState<PhotoFileDto | null>(null)
	const { filters, hasActiveFilters, resetFilters, setPage, setSearch, setSort } =
		useFolderItemsFilters({ enableType: false })
	const queryParams = useMemo<IFolderItemsParams>(
		() => ({
			q: filters.q || undefined,
			sort: filters.sort,
			order: filters.order,
			page: filters.page,
			limit: 24,
		}),
		[filters],
	)
	const { data, isPending, isError, error, refetch } = useQuery({
		queryKey: [...PHOTOS.photos, queryParams],
		queryFn: () => getPhotos(queryParams),
	})
	const {
		data: originalPreview,
		isPending: isOriginalPreviewPending,
		isError: isOriginalPreviewError,
		refetch: refetchOriginalPreview,
	} = useQuery({
		queryKey: ['photo-preview', previewedPhoto?.id],
		queryFn: () => getPreviewUrl(previewedPhoto!.id),
		enabled: Boolean(previewedPhoto),
	})
	const photos = data?.items ?? []
	const deletePhoto = useMutation({
		mutationFn: moveToTrash,
		onSuccess: (_data, variables) => {
			void invalidateStorageQueries(queryClient)
			showToast('Фото перемещено в корзину', 'success', {
				label: 'Отменить',
				onClick: () => void restoreFromTrash(variables)
					.then(() => invalidateStorageQueries(queryClient))
					.catch(() => showToast('Не удалось восстановить фото', 'error')),
			})
		},
		onError: () => showToast('Не удалось переместить фото в корзину', 'error'),
	})

	return (
		<section className='flex min-w-0 flex-col gap-5 pb-6'>
			<div>
				<h1 className='text-2xl font-semibold text-foreground'>Фото</h1>
				<p className='mt-1 text-sm text-muted-foreground'>
					Все изображения из вашего хранилища.
				</p>
			</div>

			<div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
				<div className='flex flex-wrap items-center gap-2'>
					<FolderBrowserSearch
						key={filters.q}
						initialValue={filters.q}
						onSearch={setSearch}
					/>
					<select
						value={filters.sort}
						onChange={event => setSort(event.target.value as typeof filters.sort)}
						className='rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none'
					>
						<option value='updatedAt'>По дате изменения</option>
						<option value='name'>По названию</option>
						<option value='size'>По размеру</option>
					</select>
					{hasActiveFilters && (
						<Button
							variant='secondary'
							className='px-3'
							onClick={resetFilters}
							aria-label='Сбросить фильтры'
							title='Сбросить фильтры'
						>
							<RefreshCw size={16} />
						</Button>
					)}
				</div>
				{data && <p className='text-sm text-muted-foreground'>Всего: {data.pagination.total}</p>}
			</div>

			{isPending ? (
				<LoadingState title='Загружаем фотографии' />
			) : isError ? (
				<ErrorState description={error.message} onRetry={() => void refetch()} />
			) : photos.length === 0 && hasActiveFilters ? (
				<NoResultsState description='По текущему поиску фотографий не найдено.' />
			) : photos.length === 0 ? (
				<EmptyState
					title='Фотографий пока нет'
					description='Загрузите изображения, чтобы они появились здесь.'
				/>
			) : (
				<div className='columns-2 gap-2 sm:columns-3 xl:columns-4 2xl:columns-5'>
					{photos.map(photo => (
						<Popover key={photo.id}>
							<PopoverContext.Consumer>
								{context => (
									<>
										<article
											onClick={() => setPreviewedPhoto(photo)}
											onKeyDown={event => {
												if (event.key === 'Enter' || event.key === ' ') {
													event.preventDefault()
													setPreviewedPhoto(photo)
												}
											}}
											onContextMenu={event => {
												event.preventDefault()
												context?.setCoords({ x: event.clientX, y: event.clientY })
												context?.setOpen(true)
											}}
											className='group relative mb-2 cursor-pointer break-inside-avoid overflow-hidden rounded-lg bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
											role='button'
											tabIndex={0}
											aria-label={`Открыть ${formatFileName(photo.name)}`}
										>
											<ContextMenuTrigger
												ariaLabel={`Действия с фото ${formatFileName(photo.name)}`}
											/>
												{photo.thumbnailUrl ? (
													// Native image keeps the stored thumbnail's natural aspect ratio for the masonry layout.
													// eslint-disable-next-line @next/next/no-img-element
													<img
														src={photo.thumbnailUrl}
														alt={formatFileName(photo.name)}
														className='block h-auto w-full transition-transform duration-200 group-hover:scale-[1.02]'
													/>
												) : (
													<div className='flex aspect-square items-center justify-center text-muted-foreground'>
														<ImageIcon size={28} />
													</div>
												)}
											<div className='pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-3 pb-2 pt-8 opacity-0 transition-opacity group-hover:opacity-100'>
												<p className='truncate text-sm font-medium text-white'>
													{formatFileName(photo.name)}
												</p>
											</div>
										</article>
										<PopoverContent isContextMenu>
											<div className='flex flex-col text-sm'>
												<button
												onClick={() => { context?.setOpen(false); setPreviewedPhoto(photo) }}
													className='flex items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-muted'
												>
													<ImageIcon size={18} /> Просмотреть
												</button>
												<button
												onClick={() => { context?.setOpen(false); setSharedPhoto(photo) }}
													className='flex items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-muted'
												>
													<Share2 size={18} /> Поделиться
												</button>
												<button
												onClick={() => { context?.setOpen(false); setRenamedPhoto(photo) }}
													className='flex items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-muted'
												>
													<Pencil size={18} /> Переименовать
												</button>
												<Link
													href={photo.folderId ? `/folders/${photo.folderId}` : '/folders'}
													className='flex items-center gap-2 rounded px-3 py-1.5 hover:bg-muted'
												>
													<ExternalLink size={18} />{' '}
													{photo.folderId ? 'Перейти к папке' : 'Перейти к корню'}
												</Link>
												<button
												disabled={deletePhoto.isPending}
												onClick={() => { context?.setOpen(false); deletePhoto.mutate({ id: photo.id, type: 'file' }) }}
													className='flex items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-muted'
												>
													<Trash2 size={18} /> Удалить
												</button>
											</div>
										</PopoverContent>
									</>
								)}
							</PopoverContext.Consumer>
						</Popover>
					))}
				</div>
			)}

			{data && data.pagination.totalPages > 1 && (
				<div className='flex items-center justify-end gap-3 text-sm'>
					<Button
						variant='secondary'
						disabled={filters.page === 1}
						onClick={() => setPage(filters.page - 1)}
					>
						Назад
					</Button>
					<span className='text-muted-foreground'>
						{filters.page} / {data.pagination.totalPages}
					</span>
					<Button
						variant='secondary'
						disabled={filters.page >= data.pagination.totalPages}
						onClick={() => setPage(filters.page + 1)}
					>
						Вперёд
					</Button>
				</div>
			)}

			{previewedPhoto && (
				<ModalContainer isOpen onClose={() => setPreviewedPhoto(null)} ariaLabel={`Просмотр ${formatFileName(previewedPhoto.name)}`}>
					<Card className='relative w-[min(90vw,48rem)] p-3'>
						<button
							onClick={() => setPreviewedPhoto(null)}
							className='absolute right-5 top-5 z-10 rounded bg-card/80 p-1 text-foreground'
							aria-label='Закрыть просмотр'
						>
							<X size={20} />
						</button>
						{isOriginalPreviewPending ? (
							<div className='flex min-h-72 items-center justify-center text-sm text-muted-foreground'>
								Загружаем оригинал…
							</div>
						) : isOriginalPreviewError ? (
							<div className='flex min-h-72 flex-col items-center justify-center gap-3 text-sm text-muted-foreground'>
								Не удалось загрузить оригинал.
								<Button variant='secondary' onClick={() => void refetchOriginalPreview()}>Повторить</Button>
							</div>
						) : originalPreview?.previewUrl ? (
							<Image
								src={originalPreview.previewUrl}
								alt={formatFileName(previewedPhoto.name)}
								width={768}
								height={768}
								unoptimized
								className='max-h-[75vh] w-full rounded-lg object-contain'
							/>
						) : null}
					</Card>
				</ModalContainer>
			)}
			{renamedPhoto && (
				<ResourceActionsDialogs
					id={renamedPhoto.id}
					type='file'
					name={renamedPhoto.name}
					action='rename'
					onClose={() => {
						setRenamedPhoto(null)
						void invalidateStorageQueries(queryClient)
					}}
				/>
			)}
			{sharedPhoto && (
				<ShareResourceDialog
					resourceId={sharedPhoto.id}
					resourceType='file'
					resourceName={formatFileName(sharedPhoto.name)}
					onClose={() => setSharedPhoto(null)}
				/>
			)}
		</section>
	)
}
