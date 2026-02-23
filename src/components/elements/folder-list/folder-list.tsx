import { FolderGrid, FolderLine } from '@/components/elements/folder/folder'
import { usePathname } from 'next/navigation'

interface Props {
	activeBtn: 'menu' | 'grid'
	folderNames: string[]
}

export function FolderList({ activeBtn, folderNames }: Props) {
	const pathname = usePathname()

	const renderFoldersTypeMenu = () => {
		return folderNames.map((folder, index) => {
			return <FolderLine pathname={pathname} name={folder} key={index} />
		})
	}
	const renderFoldersTypeGrid = () => {
		return folderNames.map((folder, index) => {
			return (
				<FolderGrid pathname={pathname} name={folder} key={index} size={90} />
			)
		})
	}

	return activeBtn === 'menu' ? (
		<div className='flex flex-col  items-start mt-2 h-full'>
			{renderFoldersTypeMenu()}
		</div>
	) : (
		<div
			className='w-full gap-4 p-4'
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fill, minmax(5rem, 1fr))',
				gridAutoRows: 'min-content',
			}}
		>
			{renderFoldersTypeGrid()}
		</div>
	)
}
