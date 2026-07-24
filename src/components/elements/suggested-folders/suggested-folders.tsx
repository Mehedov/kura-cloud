'use client'

import { FolderIcon } from '@/assets/icons/FolderIcon'
import { PAGES } from '@/config/page.config'
import { FOLDER_KEYS } from '@/constants/queryKeys'
import { getSuggestedFolders } from '@/services/folder.service'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

export default function SuggestedFolders() {
	const { data, isPending, isError } = useQuery({
		queryKey: FOLDER_KEYS.suggested,
		queryFn: getSuggestedFolders,
	})

	const folders = data?.data.items || []

	return (
		<section>
			<h2 className='mb-4 text-md font-medium text-neutral-900'>
				Suggested based on your activity
			</h2>

			{isPending ? (
				<div className='text-sm text-neutral-500'>Загрузка...</div>
			) : isError ? (
				<div className='text-sm text-red-500'>Не удалось загрузить папки.</div>
			) : folders.length === 0 ? (
				<div className='text-sm text-neutral-500'>Недавних папок пока нет.</div>
			) : (
				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5'>
					{folders.map(folder => (
						<Link
							key={folder.id}
							href={{
								pathname: `${PAGES.folders}/${folder.name}`,
								query: { id: folder.id },
							}}
							className='flex w-full flex-col items-center justify-center rounded-lg border border-gray-200 bg-neutral-50 p-5 transition-colors hover:bg-neutral-100'
						>
							<FolderIcon size={150} />
							<p className='mt-2 w-full text-center line-clamp-2'>
								{folder.name}
							</p>
						</Link>
					))}
				</div>
			)}
		</section>
	)
}
