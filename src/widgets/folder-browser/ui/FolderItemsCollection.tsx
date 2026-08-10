'use client'

import { FileGrid } from '@/entities/file/ui/FileGrid'
import { FolderGrid } from '@/entities/folder/ui/FolderGrid'
import type { IFolderItemsResponse } from '@/entities/folder/model/folder.types'
import type { FolderItemsFilters } from '@/features/folder-filters/model/folder-filters'
import {
	EmptyState,
	ErrorState,
	LoadingState,
	NoResultsState,
	ResourceNotFoundState,
} from '@/shared/ui/states/async-state'
import { getHttpStatus } from '@/shared/lib/getHttpStatus.util'
import { formatBytes } from '@/shared/lib/formatBytes.util'
import { formatDate } from '@/shared/lib/formatDate.util'
import { FolderIcon } from '@/shared/assets/icons/FolderIcon'
import { File as FileIcon } from 'lucide-react'
import Link from 'next/link'
import { ResourceAccessProvider } from '@/entities/resource/model/resource-access'

type ViewMode = 'menu' | 'grid'

interface FolderItemsCollectionProps {
	response?: IFolderItemsResponse
	isPending: boolean
	isError: boolean
	error: unknown
	onRetry: () => void
	viewMode: ViewMode
	filters: FolderItemsFilters
	hasActiveFilters: boolean
	onPageChange: (page: number) => void
	pathname?: string
}

export function FolderItemsCollection({
	response,
	isPending,
	isError,
	error,
	onRetry,
	viewMode,
	filters,
	hasActiveFilters,
	onPageChange,
	pathname = '/folders',
}: FolderItemsCollectionProps) {
	const items = response?.items ?? []
	const folders = items.filter(item => item.kind === 'folder')
	const files = items.filter(item => item.kind === 'file')

	if (isPending) return <LoadingState title='Загружаем содержимое папки' />
	if (isError && getHttpStatus(error) === 404) {
		return (
			<ResourceNotFoundState
				title='Папка не найдена'
				description='Возможно, она была удалена или у вас больше нет к ней доступа.'
			/>
		)
	}
	if (isError) {
		return (
			<ErrorState
				description={error instanceof Error ? error.message : undefined}
				onRetry={onRetry}
			/>
		)
	}
	if (items.length === 0 && hasActiveFilters) {
		return (
			<NoResultsState description='По текущему поиску и фильтрам файлов не найдено.' />
		)
	}
	if (items.length === 0) {
		return (
			<EmptyState
				title='Папка пока пуста'
				description='Загрузите файл или создайте вложенную папку.'
			/>
		)
	}

	const content =
		viewMode === 'grid' ? (
			<div className='grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-5 py-3'>
				{folders.map(folder => (
					<FolderGrid
						key={folder.id}
						id={folder.id}
						name={folder.name}
						pathname={pathname}
						size={90}
						collaborators={folder.collaborators}
					/>
				))}
				{files.map(file => (
					<FileGrid
						key={file.id}
						id={file.id}
						name={file.name}
						type={file.type}
						imagePreview={file.thumbnailUrl}
						size={90}
					/>
				))}
			</div>
		) : (
			<div className='overflow-x-auto rounded-xl border border-border'>
				<div className='min-w-160 divide-y divide-border text-sm'>
					<div className='grid grid-cols-[minmax(16rem,1fr)_8rem_9rem_7rem] bg-muted px-4 py-3 font-medium text-muted-foreground'>
						<span>Название</span>
						<span>Тип</span>
						<span>Изменено</span>
						<span>Размер</span>
					</div>
					{folders.map(folder => (
						<Link
							key={folder.id}
							href={`${pathname}/${folder.id}`}
							className='grid grid-cols-[minmax(16rem,1fr)_8rem_9rem_7rem] items-center px-4 py-3 hover:bg-accent'
						>
							<span className='flex items-center gap-3 font-medium'>
								<FolderIcon size={24} />
								{folder.name}
							</span>
							<span className='text-muted-foreground'>Папка</span>
							<span className='text-muted-foreground'>
								{formatDate(folder.updatedAt)}
							</span>
							<span className='text-muted-foreground'>—</span>
						</Link>
					))}
					{files.map(file => (
						<div
							key={file.id}
							className='grid grid-cols-[minmax(16rem,1fr)_8rem_9rem_7rem] items-center px-4 py-3 hover:bg-accent'
						>
							<span className='flex min-w-0 items-center gap-3 font-medium'>
								<FileIcon
									size={22}
									className='shrink-0 text-muted-foreground'
								/>
								<span className='truncate'>{file.name}</span>
							</span>
							<span className='capitalize text-muted-foreground'>
								{file.type}
							</span>
							<span className='text-muted-foreground'>
								{formatDate(file.updatedAt)}
							</span>
							<span className='text-muted-foreground'>
								{formatBytes(file.size)}
							</span>
						</div>
					))}
				</div>
			</div>
		)

	return (
		<ResourceAccessProvider permission={response?.folder?.permission ?? 'owner'}>
		<>
			{content}
			{response && response.pagination.totalPages > 1 && (
				<div className='mt-5 flex items-center justify-end gap-3 text-sm'>
					<button
						disabled={filters.page === 1}
						onClick={() => onPageChange(filters.page - 1)}
						className='rounded-lg border border-border px-3 py-2 disabled:opacity-50'
					>
						Назад
					</button>
					<span className='text-muted-foreground'>
						{filters.page} / {response.pagination.totalPages}
					</span>
					<button
						disabled={filters.page >= response.pagination.totalPages}
						onClick={() => onPageChange(filters.page + 1)}
						className='rounded-lg border border-border px-3 py-2 disabled:opacity-50'
					>
						Вперёд
					</button>
				</div>
			)}
		</>
		</ResourceAccessProvider>
	)
}
