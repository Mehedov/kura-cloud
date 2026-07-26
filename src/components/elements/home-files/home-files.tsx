'use client'

import { FolderBrowserSearch } from '@/components/elements/folder-browser/folder-browser-search'
import { EmptyState, ErrorState, LoadingState, NoResultsState } from '@/components/ui/states/async-state'
import { Button } from '@/components/ui/button/Button'
import { FOLDER_KEYS } from '@/constants/queryKeys'
import { useFolderItemsFilters } from '@/hooks/use-folder-items-filters'
import { getAllFiles } from '@/services/folder.service'
import type { IFolderItemsParams } from '@/types/folder.type'
import { formatBytes } from '@/utils/formatBytes.util'
import { formatDate } from '@/utils/formatDate.util'
import { formatFileName } from '@/utils/formatFileName.util'
import { useQuery } from '@tanstack/react-query'
import { FileVisual } from '@/components/elements/file/file-visual'
import { Filter, RefreshCw } from 'lucide-react'
import { useMemo } from 'react'

const FILTER_LABELS = {
	all: 'Все файлы',
	photo: 'Изображения',
	video: 'Видео',
	document: 'Документы',
	other: 'Остальные',
} as const

export function HomeFiles() {
	const {
		filters,
		hasActiveFilters,
		resetFilters,
		setPage,
		setSearch,
		setSort,
		setType,
	} = useFolderItemsFilters()
	const queryParams = useMemo<IFolderItemsParams>(
		() => ({
			kind: 'files',
			sort: filters.sort,
			order: filters.order,
			type: filters.type === 'all' ? undefined : filters.type,
			q: filters.q || undefined,
			page: filters.page,
			limit: 20,
		}),
		[filters],
	)
	const { data, isPending, isError, error, refetch } = useQuery({
		queryKey: [...FOLDER_KEYS.files, 'all', queryParams],
		queryFn: () => getAllFiles(queryParams),
	})
	const files = (data?.data.items ?? []).filter(item => item.kind === 'file')

	return (
		<section>
			<h2 className='mb-4 text-md font-medium text-foreground'>Ваши файлы</h2>
			<div className='mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between'>
				<div className='flex flex-wrap items-center gap-2'>
					<FolderBrowserSearch
						key={filters.q}
						initialValue={filters.q}
						onSearch={setSearch}
					/>
					<label className='flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm'>
						<Filter size={16} className='text-muted-foreground' />
						<select
							value={filters.type}
							onChange={event =>
								setType(event.target.value as keyof typeof FILTER_LABELS)
							}
							className='bg-transparent text-foreground outline-none'
						>
							{Object.entries(FILTER_LABELS).map(([value, label]) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</select>
					</label>
					<select
						value={filters.sort}
						onChange={event => setSort(event.target.value as typeof filters.sort)}
						className='rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none'
					>
						<option value='name'>По названию</option>
						<option value='updatedAt'>По дате изменения</option>
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
			</div>

			{isPending ? (
				<LoadingState title='Загружаем файлы' />
			) : isError ? (
				<ErrorState description={error.message} onRetry={() => void refetch()} />
			) : files.length === 0 && hasActiveFilters ? (
				<NoResultsState description='По текущему поиску и фильтрам файлов не найдено.' />
			) : files.length === 0 ? (
				<EmptyState
					title='Файлов в корне пока нет'
					description='Загрузите первый файл или откройте папку.'
				/>
			) : (
				<>
					<div className='hidden overflow-x-auto rounded-xl border border-border md:block'>
						<div className='min-w-170 divide-y divide-border text-sm'>
							<div className='grid grid-cols-[minmax(16rem,1fr)_9rem_9rem] bg-muted px-4 py-3 font-medium text-muted-foreground'>
								<span>Название</span>
								<span>Размер</span>
								<span>Изменено</span>
							</div>
							{files.map(file => (
								<div
									key={file.id}
									className='grid grid-cols-[minmax(16rem,1fr)_9rem_9rem] items-center px-4 py-3 hover:bg-accent'
								>
									<span className='flex min-w-0 items-center gap-3 font-medium text-foreground'>
										<FileVisual
											type={file.type}
											thumbnailUrl={file.thumbnailUrl}
											alt={formatFileName(file.name)}
											size={36}
										/>
										<span className='truncate'>{formatFileName(file.name)}</span>
									</span>
									<span className='text-muted-foreground'>{formatBytes(file.size)}</span>
									<span className='text-muted-foreground'>{formatDate(file.updatedAt)}</span>
								</div>
							))}
						</div>
					</div>
					<div className='space-y-2 md:hidden'>
						{files.map(file => (
							<article
								key={file.id}
								className='rounded-xl border border-border bg-card p-4'
							>
								<div className='flex min-w-0 items-center gap-3 font-medium text-foreground'>
									<FileVisual
										type={file.type}
										thumbnailUrl={file.thumbnailUrl}
										alt={formatFileName(file.name)}
										size={36}
									/>
									<span className='truncate'>{formatFileName(file.name)}</span>
								</div>
								<div className='mt-3 flex justify-between gap-4 text-sm text-muted-foreground'>
									<span>{formatBytes(file.size)}</span>
									<span>{formatDate(file.updatedAt)}</span>
								</div>
							</article>
						))}
					</div>
				</>
			)}

			{data && data.data.pagination.totalPages > 1 && (
				<div className='mt-5 flex items-center justify-end gap-3 text-sm'>
					<Button
						variant='secondary'
						disabled={filters.page === 1}
						onClick={() => setPage(filters.page - 1)}
					>
						Назад
					</Button>
					<span className='text-muted-foreground'>
						{filters.page} / {data.data.pagination.totalPages}
					</span>
					<Button
						variant='secondary'
						disabled={filters.page >= data.data.pagination.totalPages}
						onClick={() => setPage(filters.page + 1)}
					>
						Вперёд
					</Button>
				</div>
			)}
		</section>
	)
}
