'use client'

import { getFolderItems } from '@/entities/folder/api/folder.queries'
import type { FolderItemsFilters } from '@/features/folder-filters/model/folder-filters'
import { FOLDER_KEYS } from '@/shared/config/query-keys'
import {
	EmptyState,
	ErrorState,
	LoadingState,
	NoResultsState,
} from '@/shared/ui/states/async-state'
import { FolderGrid, FolderLine } from '@/entities/folder/ui/FolderGrid'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

interface FolderCollectionProps {
	activeBtn?: 'menu' | 'grid'
	filters?: FolderItemsFilters
	hasActiveFilters?: boolean
	onPageChange?: (page: number) => void
	limit?: number
	pathname?: string
	showPagination?: boolean
	gridClassName?: string
	header?: (total: number) => ReactNode
	emptyTitle?: string
	emptyDescription?: string
	noResultsDescription?: string
}

export function FolderCollection({
	activeBtn = 'grid',
	filters,
	hasActiveFilters = false,
	onPageChange,
	limit = 50,
	pathname: pathnameProp,
	showPagination = true,
	gridClassName = 'grid grid-cols-[repeat(auto-fill,minmax(5rem,1fr))] gap-8',
	header,
	emptyTitle = 'Здесь пока нет папок',
	emptyDescription = 'Создайте первую папку, чтобы начать организовывать файлы.',
	noResultsDescription = 'По текущему поиску папок ничего не найдено.',
}: FolderCollectionProps) {
	const currentPathname = usePathname()
	const pathname = pathnameProp ?? currentPathname
	const { data, isPending, isError, error, refetch } = useQuery({
		queryKey: filters ? [...FOLDER_KEYS.all, filters] : FOLDER_KEYS.root,
		queryFn: () =>
			getFolderItems('root', {
				kind: 'folders',
				sort: filters?.sort ?? 'name',
				order: filters?.order ?? 'asc',
				q: filters?.q || undefined,
				page: filters?.page ?? 1,
				limit,
			}),
	})

	const response = data?.data
	const folders = (response?.items ?? []).filter(item => item.kind === 'folder')

	if (isPending) return <LoadingState title='Загружаем папки' />
	if (isError) {
		return (
			<ErrorState description={error.message} onRetry={() => void refetch()} />
		)
	}
	if (folders.length === 0 && hasActiveFilters) {
		return <NoResultsState description={noResultsDescription} />
	}
	if (folders.length === 0) {
		return <EmptyState title={emptyTitle} description={emptyDescription} />
	}

	const content =
		activeBtn === 'menu' ? (
			<div className='mt-2 flex h-full flex-col items-start'>
				{folders.map(folder => (
					<FolderLine
						pathname={pathname}
						name={folder.name}
						key={folder.id}
						id={folder.id}
						updatedAt={folder.updatedAt}
					/>
				))}
			</div>
		) : (
			<div className={gridClassName}>
				{folders.map(folder => (
					<FolderGrid
						id={folder.id}
						pathname={pathname}
						name={folder.name}
						key={folder.id}
						size={90}
						collaborators={folder.collaborators}
					/>
				))}
			</div>
		)

	return (
		<>
			{header?.(response?.pagination.total ?? folders.length)}
			{content}
			{showPagination &&
				response &&
				response.pagination.totalPages > 1 &&
				onPageChange && (
					<div className='mt-5 flex items-center justify-end gap-3 text-sm'>
						<button
							disabled={!filters || filters.page === 1}
							onClick={() => onPageChange((filters?.page ?? 1) - 1)}
							className='rounded-lg border border-border px-3 py-2 disabled:opacity-50'
						>
							Назад
						</button>
						<span className='text-muted-foreground'>
							{filters?.page ?? 1} / {response.pagination.totalPages}
						</span>
						<button
							disabled={
								!filters || filters.page >= response.pagination.totalPages
							}
							onClick={() => onPageChange((filters?.page ?? 1) + 1)}
							className='rounded-lg border border-border px-3 py-2 disabled:opacity-50'
						>
							Вперёд
						</button>
					</div>
				)}
		</>
	)
}
