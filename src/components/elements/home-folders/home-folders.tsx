import { PAGES } from '@/config/page.config'
import { FolderGrid } from '../folder/folder'
import { getMyFolders } from '@/services/folder.service'
import { useQuery } from '@tanstack/react-query'
import { FOLDER_KEYS } from '@/constants/queryKeys'
import Link from 'next/link'
import { useMemo } from 'react'

export default function HomeFolders() {
	const { data, isPending, isError, error } = useQuery({
		queryKey: FOLDER_KEYS.all,
		queryFn: getMyFolders,
	})

	const folders = data?.data || []

	const foldersRender = useMemo(() => {
		return folders.slice(0, 10).map((folder, index) => {
			return (
				<FolderGrid
					id={folder.id}
					name={folder.name}
					key={index}
					size={90}
					pathname={PAGES.folders}
				/>
			)
		})
	}, [folders])

	if (isPending) return <div>Загрузка...</div>
	if (isError) return <div>Ошибка: {error.message}</div>

	return (
		<section>
			<h2 className='text-md text-neutral-900 font-medium mb-4'>
				<Link
					href='/folders'
					className='text-md text-neutral-900 font-medium mb-4 duration-200 ease-in-out hover:text-neutral-600'
				>
					Folders {folders.length > 10 && `more ${folders.length - 10}...`}
				</Link>
			</h2>
			<div className='flex items-center flex-wrap gap-4'>{foldersRender}</div>
		</section>
	)
}
