'use client'

import { FolderBrowserSearch } from '@/widgets/folder-browser/ui/FolderToolbar'
import { FolderItemsCollection } from '@/widgets/folder-browser/ui/FolderItemsCollection'
import { useFolderItems } from '@/widgets/folder-browser/model/use-folder-items'
import { ListingType } from '@/shared/ui/ListingType'
import { BreadcrumbBasic } from '@/shared/ui/breadcrumbs/breadcrumb'
import { EmptyState } from '@/shared/ui/states/async-state'
import { useFolderItemsFilters } from '@/features/folder-filters/model/use-folder-filters'
import {
	ChevronLeft,
	Filter,
	FolderPlus,
	RefreshCw,
	UploadCloud,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useModalStore } from '@/widgets/global-modals/model/modal.store'
import { Button } from '@/shared/ui/button/Button'
import { getResourceAccess } from '@/entities/resource/model/resource-access'

const FILTER_LABELS = {
	all: 'Все файлы',
	photo: 'Изображения',
	video: 'Видео',
	document: 'Документы',
	other: 'Другие',
} as const

export function FolderOneTemplate() {
	const [viewMode, setViewMode] = useState<'menu' | 'grid'>('grid')
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
	const { data, isPending, isError, error, refetch } = useFolderItems({
		folderId,
		filters,
	})
	const response = data?.data
	const { canEdit } = getResourceAccess(response?.folder?.permission ?? 'owner')

	if (!folderId) return <EmptyState title='Папка не выбрана' />

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
						onChange={event =>
							setSort(event.target.value as typeof filters.sort)
						}
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
					{canEdit && (
						<Button variant='secondary' onClick={() => setIsOpenDropzone(true)}>
							<UploadCloud size={18} /> Загрузить
						</Button>
					)}
					{canEdit && (
						<Button
							variant='secondary'
							onClick={() => setIsOpenCreateFolder(true)}
						>
							<FolderPlus size={18} /> Создать папку
						</Button>
					)}
					<ListingType activeBtn={viewMode} setActiveBtn={setViewMode} />
				</div>
			</div>

			<FolderItemsCollection
				response={response}
				isPending={isPending}
				isError={isError}
				error={error}
				onRetry={() => void refetch()}
				viewMode={viewMode}
				filters={filters}
				hasActiveFilters={hasActiveFilters}
				onPageChange={setPage}
			/>
		</section>
	)
}
