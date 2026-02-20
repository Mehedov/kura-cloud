import { usePathname } from 'next/navigation'
import { FolderGrid, FolderLine } from './folder'

interface Props {
	activeBtn: 'menu' | 'grid'
	folderNames: string[]
}

export function FolderList({ activeBtn, folderNames }: Props) {
	const pathname = usePathname()

	const renderFoldersTypeMenu = () => {
		return folderNames.map((folder, index) => {
			const slug = folder
				.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^a-z0-9-]/g, '')

			return (
				<FolderLine pathname={pathname} slug={slug} name={folder} key={index} />
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
				<FolderGrid pathname={pathname} slug={slug} name={folder} key={index} />
			)
		})
	}

	return activeBtn === 'menu' ? (
		<div className='flex flex-col  items-start mt-2 h-full'>
			{renderFoldersTypeMenu()}
		</div>
	) : (
		<div className='inline-grid grid-cols-14 mt-2 h-full'>
			{renderFoldersTypeGrid()}
		</div>
	)
}
