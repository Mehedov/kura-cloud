'use client'

import { FolderIcon } from '@/shared/assets/icons/FolderIcon'
import { FileGrid } from '@/entities/file/ui/FileGrid'
import { FolderBrowserSearch } from '@/widgets/folder-browser/ui/FolderToolbar'
import { FolderGrid } from '@/entities/folder/ui/FolderGrid'
import { ListingType } from '@/shared/ui/ListingType'
import { BreadcrumbBasic } from '@/shared/ui/breadcrumbs/breadcrumb'
import {
	EmptyState,
	ErrorState,
	LoadingState,
	NoResultsState,
	ResourceNotFoundState,
} from '@/shared/ui/states/async-state'
import { FOLDER_KEYS } from '@/shared/config/query-keys'
import { getFolderItems } from '@/entities/folder/api/folder.queries'
import { useFolderItemsFilters } from '@/features/folder-filters/model/use-folder-filters'
import type { IFolderItemsParams } from '@/entities/folder/model/folder.types'
import { formatBytes } from '@/shared/lib/formatBytes.util'
import { formatDate } from '@/shared/lib/formatDate.util'
import { getHttpStatus } from '@/shared/lib/getHttpStatus.util'
import { useQuery } from '@tanstack/react-query'
import {
	ChevronLeft,
	File as FileIcon,
	Filter,
	FolderPlus,
	RefreshCw,
	UploadCloud,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useModalStore } from '@/widgets/global-modals/model/modal.store'
import { Button } from '@/shared/ui/button/Button'

type ViewMode = 'menu' | 'grid'
const FILTER_LABELS = {
	all: 'Все файлы',
	photo: 'Изображения',
	video: 'Видео',
	document: 'Документы',
	other: 'Остальные',
} as const

export function FolderOneTemplate() {
	const [viewMode, setViewMode] = useState<ViewMode>('grid')
	const { setIsOpenCreateFolder, setIsOpenDropzone } = useModalStore(
		state => state,
	)
	const {
		filters,
		hasActiveFilters,
		resetFilters,
		setPage,
		setSearch,
		setSort,
		setType,
	} = useFolderItemsFilters()
	const params = useParams<{ folderId: string }>()
	const folderId = params.folderId
	const queryParams = useMemo<IFolderItemsParams>(
		() => ({
			sort: filters.sort,
			order: filters.order,
			type: filters.type === 'all' ? undefined : filters.type,
			q: filters.q || undefined,
			page: filters.page,
			limit: 50,
		}),
		[filters],
	)

	const { data, isPending, isError, error, refetch } = useQuery({
		queryKey: [...FOLDER_KEYS.files, folderId, queryParams],
		queryFn: () => getFolderItems(folderId, queryParams),
		enabled: Boolean(folderId),
	})

	const response = data?.data
	const canEdit = response?.folder?.permission !== 'viewer'
	const isOwner = response?.folder?.permission === 'owner'
	const items = response?.items ?? []
	const folders = items.filter(item => item.kind === 'folder')
	const files = items.filter(item => item.kind === 'file')

	if (!folderId) {
		return <EmptyState title='Папка не выбрана' />
	}
	return (
		<section className='flex h-full min-w-0 flex-col'>
			<div className='mb-5 flex items-center justify-between'>
				<BreadcrumbBasic />
				<Link
					href='/folders'
					className='inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
				>
					<ChevronLeft size={16} /> Все папки
				</Link>
			</div>

			<div className='mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
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
							onChange={event => setType(event.target.value as keyof typeof FILTER_LABELS)}
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
							className='px-3'
							variant='secondary'
							onClick={resetFilters}
							aria-label='Сбросить фильтры'
							title='Сбросить фильтры'
						>
							<RefreshCw size={16} />
						</Button>
					)}
				</div>
				<div className='flex flex-wrap items-center gap-2'>
					{canEdit && <Button
						variant='secondary'
						onClick={() => setIsOpenDropzone(true)}
					>
						<UploadCloud size={18} /> Загрузить
					</Button>}
					{canEdit && <Button
						variant='secondary'
						onClick={() => setIsOpenCreateFolder(true)}
					>
						<FolderPlus size={18} /> Создать папку
					</Button>}
					<ListingType activeBtn={viewMode} setActiveBtn={setViewMode} />
				</div>
			</div>

			{isPending ? (
				<LoadingState title='Загружаем содержимое папки' />
			) : isError && getHttpStatus(error) === 404 ? (
				<ResourceNotFoundState
					title='Папка не найдена'
					description='Возможно, она была удалена или у вас больше нет к ней доступа.'
				/>
			) : isError ? (
				<ErrorState
					description={error.message}
					onRetry={() => void refetch()}
				/>
			) : items.length === 0 && hasActiveFilters ? (
				<NoResultsState
					description='По текущему поиску и фильтрам файлов не найдено.'
				/>
			) : items.length === 0 ? (
				<EmptyState
					title='Папка пока пуста'
					description='Загрузите файл или создайте вложенную папку.'
				/>
			) : viewMode === 'grid' ? (
				<div className='grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-5 py-3'>
					{folders.map(folder => (
						<FolderGrid
							key={folder.id}
							id={folder.id}
							name={folder.name}
							pathname='/folders'
							size={90}
								canEdit={canEdit}
								canMove={isOwner}
								canManageAccess={isOwner}
								canUndoDelete={isOwner}
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
								canEdit={canEdit}
								canMove={isOwner}
							canManageAccess={isOwner}
								canMoveToRoot={isOwner}
								canUndoDelete={isOwner}
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
								href={`/folders/${folder.id}`}
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
			)}

			{response && response.pagination.totalPages > 1 && (
				<div className='mt-5 flex items-center justify-end gap-3 text-sm'>
					<button
						disabled={filters.page === 1}
						onClick={() => setPage(filters.page - 1)}
						className='rounded-lg border border-border px-3 py-2 disabled:opacity-50'
					>
						Назад
					</button>
					<span className='text-muted-foreground'>
						{filters.page} / {response.pagination.totalPages}
					</span>
					<button
						disabled={filters.page >= response.pagination.totalPages}
						onClick={() => setPage(filters.page + 1)}
						className='rounded-lg border border-border px-3 py-2 disabled:opacity-50'
					>
						Вперёд
					</button>
				</div>
			)}
		</section>
	)
}
