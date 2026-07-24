import { FolderGrid, FolderLine } from '@/components/elements/folder/folder'
import { FOLDER_KEYS } from '@/constants/queryKeys'
import { getMyFolders } from '@/services/folder.service'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'

interface Props {
	activeBtn?: 'menu' | 'grid'
	folderNames: string[]
}

export function FolderList({ activeBtn }: Props) {
	const { data, isPending, isError, error } = useQuery({
		queryKey: FOLDER_KEYS.all,
		queryFn: getMyFolders,
	})

	const folders = data?.data || []
	const pathname = usePathname()

	const renderFoldersTypeMenu = () => {
		return folders.map(folder => (
			<FolderLine
				pathname={pathname}
				name={folder.name}
				key={folder.id}
				id={folder.id}
			/>
		))
	}
	const renderFoldersTypeGrid = () => {
		return folders.map(folder => (
			<FolderGrid
				id={folder.id}
				pathname={pathname}
				name={folder.name}
				key={folder.id}
				size={90}
			/>
		))
	}

	if (isPending) return <div className='mt-2 text-sm text-neutral-500'>Loading...</div>
	if (isError) return <div className='mt-2 text-sm text-red-500'>Ошибка: {error.message}</div>

	return activeBtn && activeBtn === 'menu' ? (
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
