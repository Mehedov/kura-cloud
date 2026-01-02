'use client'

import { FolderIcon } from '@/assets/icons/FolderIcon'
import { Check, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { FolderList } from '../elements/folder-list/folder-list'
import { Breadcrumbs } from '../ui/breadcrumbs/breadcrumbs'
import InDev from '../ui/in-dev/in-dev'
import { ListingType } from '../ui/ListingType'
import { Popover } from '../ui/popover/popover'
import { PopoverContent } from '../ui/popover/popover-content'
import { PopoverTrigger } from '../ui/popover/popover-trigger'

interface FoldersTemplateProps {
	breadcrumbsRoutes?: string[]
}

export function FoldersTemplate({
	breadcrumbsRoutes = [],
}: FoldersTemplateProps) {
	const [activeBtn, setActiveBtn] = useState<'menu' | 'grid'>('grid')
	const pathname = usePathname()

	// Массив для генерации случайных данных
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
		'Product Roadmap',
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
	]

	const fileExtensions = [
		'.pdf',
		'.docx',
		'.xlsx',
		'.jpg',
		'.png',
		'.svg',
		'.zip',
		'.txt',
		'.mp4',
		'.mp3',
	]

	const getRandomDate = () => {
		const start = new Date(2020, 0, 1)
		const end = new Date()
		const randomDate = new Date(
			start.getTime() + Math.random() * (end.getTime() - start.getTime())
		)
		return randomDate.toLocaleDateString('ru-RU')
	}

	const getRandomSize = () => {
		const units = ['KB', 'MB', 'GB']
		const size = (Math.random() * 1000).toFixed(1)
		const unit = units[Math.floor(Math.random() * units.length)]
		return `${size} ${unit}`
	}

	const renderFoldersTypeMenu = () => {
		return folderNames.map((folder, index) => {
			const slug = folder
				.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^a-z0-9-]/g, '')
			return (
				<Link
					href={`${pathname}/${slug}`}
					key={index}
					className='w-full flex items-center'
				>
					<div className='w-[60%] flex items-center gap-2'>
						<FolderIcon size={35} />
						<span className='line-clamp-2 leading-snug text-sm break-all'>
							{folder}
						</span>
					</div>

					<span className='w-[10%] text-sm text-neutral-400'>20.20.2005</span>
					<span className='w-[20%] text-sm text-neutral-400'>20 GB</span>
				</Link>
			)
		})
	}

	const renderFoldersByGrid = () => {
		return folderNames.map((folder, index) => {
			const slug = folder
				.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^a-z0-9-]/g, '')
			return (
				<Link
					href={`${pathname}/${slug}`}
					key={index}
					className='w-30 flex flex-col items-center duration-200 ease-in-out hover:-translate-y-1'
				>
					<FolderIcon size={100} />
					<p className='text-center line-clamp-2 leading-snug text-sm break-keep'>
						{folder}
					</p>
				</Link>
			)
		})
	}

	return (
		<section className='h-full'>
			<div className='flex items-center justify-between mb-5'>
				<Breadcrumbs routes={breadcrumbsRoutes} />
			</div>
			<div className='flex items-center justify-between mb-3'>
				<div className='flex items-center gap-3'>
					<InDev>
						<button className='flex items-center gap-2 border border-neutral-400 rounded-lg px-4 py-1 cursor-pointer hover:bg-neutral-100 duration-100'>
							Люди <ChevronDown size={15} />
						</button>
					</InDev>

					<Popover>
						<PopoverTrigger>
							<button className='flex items-center gap-2 border border-neutral-500 rounded-lg px-4 py-1 cursor-pointer hover:bg-neutral-100 duration-100 font-medium'>
								По названию <ChevronDown size={15} />
							</button>
						</PopoverTrigger>
						<PopoverContent className='w-45 '>
							<div className='flex flex-col gap-3 items-start w-full'>
								<div className='flex justify-start items-center gap-2 hover:bg-neutral-100 w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									<Check size={20} className='text-neutral-600' /> Названию
								</div>

								<div className='flex justify-start items-center gap-2 hover:bg-neutral-100 w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									Размеру
								</div>
								<div className='flex justify-start items-center gap-2 hover:bg-neutral-100 w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									Дате изменения
								</div>
							</div>
						</PopoverContent>
					</Popover>
				</div>

				<ListingType activeBtn={activeBtn} setActiveBtn={setActiveBtn} />
			</div>
			<FolderList activeBtn={activeBtn} />
		</section>
	)
}
