'use client'

import { FolderBrowserSearch } from '@/widgets/folder-browser/ui/FolderToolbar'
import {
	EmptyState,
	ErrorState,
	LoadingState,
	NoResultsState,
} from '@/shared/ui/states/async-state'
import { Button } from '@/shared/ui/button/Button'
import { FOLDER_KEYS } from '@/shared/config/query-keys'
import { useFolderItemsFilters } from '@/features/folder-filters/model/use-folder-filters'
import { getAllFiles } from '@/entities/folder/api/folder.queries'
import type { IFolderItemsParams } from '@/entities/folder/model/folder.types'
import { formatBytes } from '@/shared/lib/formatBytes.util'
import { formatDate } from '@/shared/lib/formatDate.util'
import { formatFileName } from '@/shared/lib/formatFileName.util'
import { useQuery } from '@tanstack/react-query'
import { FileVisual } from '@/entities/file/ui/FileVisual'
import { Avatar } from '@/shared/ui/avatar/Avatar'
import { Filter, RefreshCw } from 'lucide-react'
import { useMemo } from 'react'
import useLanguage from '@/shared/language/model'

function FileEditors({
	file,
}: {
	file: {
		editors?: Array<{
			id: string
			name: string
			avatarUrl: string | null
			avatarColor: 'sky' | 'violet' | 'emerald' | 'rose' | 'amber' | null
		}>
	}
}) {
	const editors = file.editors ?? []
	if (!editors.length) return <span className='text-muted-foreground'>—</span>
	return (
		<div className='flex -space-x-2'>
			{editors.slice(0, 3).map(editor => (
				<Avatar
					key={editor.id}
					name={editor.name}
					avatarUrl={editor.avatarUrl}
					avatarColor={editor.avatarColor}
					id={editor.id}
					title={editor.name}
					className='size-7 border-2 border-card text-xs'
				/>
			))}
			{editors.length > 3 && (
				<span className='grid size-7 place-items-center rounded-full border-2 border-card bg-muted text-[10px] text-foreground'>
					+{editors.length - 3}
				</span>
			)}
		</div>
	)
}

const FILTER_KEYS = ['all', 'photo', 'video', 'document', 'other'] as const

export function HomeFiles() {
	const language = useLanguage(state => state.language)
	const t = useLanguage(state => state.t)
	const { files: filesLabel, byName, byDate, bySize, resetFilters: resetFiltersLabel, name, editors, size, modified, fileTypeAll, fileTypePhoto, fileTypeVideo, fileTypeDocument, fileTypeOther, loadingFiles, noFileResults, noRootFiles, noRootFilesDescription, previousPage, nextPage } = t
	const filterLabels = { all: fileTypeAll, photo: fileTypePhoto, video: fileTypeVideo, document: fileTypeDocument, other: fileTypeOther } as const
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
			<h2 className='mb-4 text-md font-medium text-foreground'>{filesLabel}</h2>
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
								setType(event.target.value as keyof typeof filterLabels)
							}
							className='bg-transparent text-foreground outline-none'
						>
							{FILTER_KEYS.map(value => (
								<option key={value} value={value}>
									{filterLabels[value]}
								</option>
							))}
						</select>
					</label>
					<select
						value={filters.sort}
						onChange={event =>
							setSort(event.target.value as typeof filters.sort)
						}
						className='rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none'
					>
						<option value='name'>{byName}</option>
						<option value='updatedAt'>{byDate}</option>
						<option value='size'>{bySize}</option>
					</select>
					{hasActiveFilters && (
						<Button
							variant='secondary'
							className='px-3'
							onClick={resetFilters}
							aria-label={resetFiltersLabel}
							title={resetFiltersLabel}
						>
							<RefreshCw size={16} />
						</Button>
					)}
				</div>
			</div>

			{isPending ? (
				<LoadingState title={loadingFiles} />
			) : isError ? (
				<ErrorState
					description={error.message}
					onRetry={() => void refetch()}
				/>
			) : files.length === 0 && hasActiveFilters ? (
				<NoResultsState description={noFileResults} />
			) : files.length === 0 ? (
				<EmptyState
					title={noRootFiles}
					description={noRootFilesDescription}
				/>
			) : (
				<>
					<div className='hidden overflow-x-auto rounded-xl border border-border md:block'>
						<div className='min-w-190 divide-y divide-border text-sm'>
							<div className='grid grid-cols-[minmax(16rem,1fr)_8rem_9rem_9rem] bg-muted px-4 py-3 font-medium text-muted-foreground'>
								<span>{name}</span>
								<span>{editors}</span>
								<span>{size}</span>
								<span>{modified}</span>
							</div>
							{files.map(file => (
								<div
									key={file.id}
									className='grid grid-cols-[minmax(16rem,1fr)_8rem_9rem_9rem] items-center px-4 py-3 hover:bg-accent'
								>
									<span className='flex min-w-0 items-center gap-3 font-medium text-foreground'>
										<FileVisual
											type={file.type}
											thumbnailUrl={file.thumbnailUrl}
											alt={formatFileName(file.name)}
											size={36}
										/>
										<span className='truncate'>
											{formatFileName(file.name)}
										</span>
									</span>
									<FileEditors file={file} />
									<span className='text-muted-foreground'>
										{formatBytes(file.size)}
									</span>
									<span className='text-muted-foreground'>
										{formatDate(file.updatedAt, language)}
									</span>
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
									<span>{formatDate(file.updatedAt, language)}</span>
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
						{previousPage}
					</Button>
					<span className='text-muted-foreground'>
						{filters.page} / {data.data.pagination.totalPages}
					</span>
					<Button
						variant='secondary'
						disabled={filters.page >= data.data.pagination.totalPages}
						onClick={() => setPage(filters.page + 1)}
					>
						{nextPage}
					</Button>
				</div>
			)}
		</section>
	)
}
