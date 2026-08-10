import { FolderGrid, FolderLine } from '@/entities/folder/ui/FolderGrid'
import {
	EmptyState,
	ErrorState,
	LoadingState,
	NoResultsState,
} from '@/shared/ui/states/async-state'
import { FOLDER_KEYS } from '@/shared/config/query-keys'
import type { FolderItemsFilters } from '@/features/folder-filters/model/folder-filters'
import { getFolderItems } from '@/entities/folder/api/folder.queries'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'

interface Props {
	activeBtn?: 'menu' | 'grid'
	filters: FolderItemsFilters
	hasActiveFilters: boolean
	onPageChange: (page: number) => void
}

export function FolderList({
	activeBtn,
	filters,
	hasActiveFilters,
	onPageChange,
}: Props) {
	const { data, isPending, isError, error, refetch } = useQuery({
		queryKey: [...FOLDER_KEYS.all, filters],
		queryFn: () =>
			getFolderItems('root', {
				kind: 'folders',
				sort: filters.sort,
				order: filters.order,
				q: filters.q || undefined,
				page: filters.page,
				limit: 50,
			}),
	})

	const response = data?.data
	const folders = (response?.items ?? []).filter(
		item => item.kind === 'folder',
	)
	const pathname = usePathname()

	if (isPending) return <LoadingState title='Загружаем папки' />
	if (isError) {
		return <ErrorState description={error.message} onRetry={() => void refetch()} />
	}
	if (folders.length === 0 && hasActiveFilters) {
		return (
			<NoResultsState
				description='По текущему поиску папок ничего не найдено.'
			/>
		)
	}
	if (folders.length === 0) {
		return (
			<EmptyState
				title='Здесь пока нет папок'
				description='Создайте первую папку, чтобы начать организовывать файлы.'
			/>
		)
	}

	const content = activeBtn === 'menu' ? (
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
		<div className='grid grid-cols-[repeat(auto-fill,minmax(5rem,1fr))] gap-4 p-4'>
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
	)
}
