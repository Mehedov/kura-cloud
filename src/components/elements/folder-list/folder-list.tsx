import { FolderIcon } from '@/assets/icons/FolderIcon'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
	activeBtn: 'menu' | 'grid'
	folderNames: string[]
}

export function FolderList({ activeBtn, folderNames }: Props) {
	const pathname = usePathname()
	// Массив для генерации случайных данных

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
	const renderFoldersTypeGrid = () => {
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

	return activeBtn === 'menu' ? (
		<div className='flex flex-col gap-3  items-start mt-2 h-full'>
			{renderFoldersTypeMenu()}
		</div>
	) : (
		<div className='grid grid-cols-11 mt-2 h-full'>
			{renderFoldersTypeGrid()}
		</div>
	)
}
