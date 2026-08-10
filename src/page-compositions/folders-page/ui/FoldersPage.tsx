'use client'

import { FolderBrowserSearch } from '@/widgets/folder-browser/ui/FolderToolbar'
import { FolderList } from '@/widgets/folder-browser/ui/FolderList'
import { ListingType } from '@/shared/ui/ListingType'
import { BreadcrumbBasic } from '@/shared/ui/breadcrumbs/breadcrumb'
import { useFolderItemsFilters } from '@/features/folder-filters/model/use-folder-filters'
import { RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/shared/ui/button/Button'

export function FoldersTemplate() {
	const [activeBtn, setActiveBtn] = useState<'menu' | 'grid'>('grid')
	const {
		filters,
		hasActiveFilters,
		resetFilters,
		setPage,
		setSearch,
		setSort,
	} = useFolderItemsFilters({ enableType: false })

	return (
		<section className='relative flex h-full min-w-0 flex-col'>
			<div className='mb-5 flex items-center justify-between'>
				<BreadcrumbBasic />
			</div>
			<div className='mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
				<div className='flex flex-wrap items-center gap-2'>
					<FolderBrowserSearch
						key={filters.q}
						initialValue={filters.q}
						onSearch={setSearch}
					/>
					<select
						value={filters.sort}
						onChange={event =>
							setSort(event.target.value as typeof filters.sort)
						}
						className='rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none'
					>
						<option value='name'>По названию</option>
						<option value='updatedAt'>По дате изменения</option>
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
				<ListingType activeBtn={activeBtn} setActiveBtn={setActiveBtn} />
			</div>
			<div className='flex-1 overflow-auto'>
				<FolderList
					activeBtn={activeBtn}
					filters={filters}
					hasActiveFilters={hasActiveFilters}
					onPageChange={setPage}
				/>
			</div>
		</section>
	)
}
