'use client'

import { Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { FolderList } from '../elements/folder-list/folder-list'
import { Breadcrumbs } from '../ui/breadcrumbs/breadcrumbs'
import { ListingType } from '../ui/ListingType'
import { Popover } from '../ui/popover/popover'
import { PopoverContent } from '../ui/popover/popover-content'
import { PopoverTrigger } from '../ui/popover/popover-trigger'

interface FoldersTemplateProps {
	breadcrumbsRoutes?: string[]
}
const folderNames = [
	'UI UX Design',
	'Documentation',
	'Marketing MaterialsMaterials',
	'Financial Reports',
	'Client Presentations',
	'Source Code',
	'Database Backups',
	'API Documentation',
	'User Research',
	'Meeting Notes',
	'Design Assets',
	'Quality Assurance',
	'Deployment Scripts',
	'Configuration Files',
	'Test Results',
	'Analytics Reports',
	'Security Policies',
	'User Manuals',
	'Training Materials',
	'UI UX Design',
	'Documentation',
	'Marketing MaterialsMaterials',
	'Financial Reports',
	'Client Presentations',
	'Source Code',
	'Database Backups',
	'API Documentation',
	'User Research',
	'Meeting Notes',
	'Design Assets',
	'Quality Assurance',
	'Deployment Scripts',
	'Configuration Files',
	'Test Results',
	'Analytics Reports',
	'Security Policies',
	'User Manuals',
	'Training Materials',
	'User Manuals',
	'Training Materials',
	'Configuration Files',
	'Test Results',
	'Analytics Reports',
	'Security Policies',
	'User Manuals',
	'Training Materials',
	'User Manuals',
	'Training Materials',
	'User Manuals',
	'Training Materials',
]

export function FoldersTemplate({
	breadcrumbsRoutes = [],
}: FoldersTemplateProps) {
	const [activeBtn, setActiveBtn] = useState<'menu' | 'grid'>('grid')

	return (
		<section className='relative h-full flex flex-col'>
			<div className='flex items-center justify-between mb-5'>
				<Breadcrumbs routes={breadcrumbsRoutes} />
			</div>
			<div className='flex items-center justify-between mb-3'>
				<div className='flex items-center gap-3'>
					<button className='flex items-center gap-2 border border-neutral-400 rounded-lg px-4 py-1 cursor-pointer hover:bg-neutral-100 duration-100'>
						Люди <ChevronDown size={15} />
					</button>

					<Popover>
						<PopoverTrigger>
							<button className='flex items-center gap-2 border border-neutral-500 rounded-lg px-4 py-1 cursor-pointer hover:bg-neutral-100 duration-100 font-normal'>
								По названию <ChevronDown size={15} />
							</button>
						</PopoverTrigger>
						<PopoverContent className='w-45 '>
							<div className='flex flex-col gap-3 items-start w-full'>
								<div className='flex justify-start items-center gap-2 hover:bg-neutral-50 w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									<Check size={20} className='text-neutral-600' /> Названию
								</div>

								<div className='flex justify-start items-center gap-2 hover:bg-neutral-50 w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									Размеру
								</div>
								<div className='flex justify-start items-center gap-2 hover:bg-neutral-50 w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									Дате изменения
								</div>
							</div>
						</PopoverContent>
					</Popover>
				</div>

				<ListingType activeBtn={activeBtn} setActiveBtn={setActiveBtn} />
			</div>
			<div className='flex-1 overflow-auto'>
				<FolderList activeBtn={activeBtn} folderNames={folderNames} />
			</div>
			{/* <Pagination
				totalPages={10}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				className='mt-auto'
			/> */}
		</section>
	)
}
