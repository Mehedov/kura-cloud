'use client'

import { Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { FolderList } from '../elements/folder-list/folder-list'
import { ListingType } from '../ui/ListingType'
import { Popover } from '../ui/popover/popover'
import { PopoverContent } from '../ui/popover/popover-content'
import { PopoverTrigger } from '../ui/popover/popover-trigger'
import { BreadcrumbBasic } from '../ui/breadcrumbs/breadcrumb'

export function FoldersTemplate() {
	const [activeBtn, setActiveBtn] = useState<'menu' | 'grid'>('grid')
	const [sortBy, setSortBy] = useState<'name' | 'updatedAt'>('name')

	return (
		<section className='relative h-full flex flex-col'>
			<div className='flex items-center justify-between mb-5'>
				<BreadcrumbBasic />
			</div>
			<div className='flex items-center justify-between mb-3'>
				<div className='flex items-center gap-3'>
					<Popover>
						<PopoverTrigger>
							<button className='flex items-center gap-2 border border-border rounded-lg px-4 py-1 cursor-pointer hover:bg-muted duration-100 font-normal'>
								{sortBy === 'name' ? 'По названию' : 'По дате'} <ChevronDown size={15} />
							</button>
						</PopoverTrigger>
						<PopoverContent className='w-45 '>
							<div className='flex flex-col gap-3 items-start w-full'>
								<button
									onClick={() => setSortBy('name')}
									className='flex justify-start items-center gap-2 hover:bg-muted w-full cursor-pointer px-2 py-1 rounded-lg text-sm'
								>
									<Check size={20} className='text-foreground' /> Названию
								</button>

								<button
									onClick={() => setSortBy('updatedAt')}
									className='flex justify-start items-center gap-2 hover:bg-muted w-full cursor-pointer px-2 py-1 rounded-lg text-sm'
								>
									Дате изменения
								</button>
							</div>
						</PopoverContent>
					</Popover>
				</div>

				<ListingType activeBtn={activeBtn} setActiveBtn={setActiveBtn} />
			</div>
			<div className='flex-1 overflow-auto'>
				<FolderList activeBtn={activeBtn} sortBy={sortBy} />
			</div>
		</section>
	)
}
