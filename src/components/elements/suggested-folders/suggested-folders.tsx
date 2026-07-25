'use client'

import { FolderIcon } from '@/assets/icons/FolderIcon'
import { PAGES } from '@/config/page.config'
import { FOLDER_KEYS } from '@/constants/queryKeys'
import { getSuggestedFolders } from '@/services/folder.service'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import {
	EmptyState,
	ErrorState,
	LoadingState,
} from '@/components/ui/states/async-state'

export default function SuggestedFolders() {
	const { data, isPending, isError, refetch } = useQuery({
		queryKey: FOLDER_KEYS.suggested,
		queryFn: getSuggestedFolders,
	})

	const folders = data?.data.items || []

	return (
		<section>
			<h2 className='mb-4 text-md font-medium text-foreground'>
				Suggested based on your activity
			</h2>

			{isPending ? (
				<LoadingState title='Подбираем папки' className='min-h-32' />
			) : isError ? (
				<ErrorState
					title='Не удалось подобрать папки'
					onRetry={() => void refetch()}
					className='min-h-32'
				/>
			) : folders.length === 0 ? (
				<EmptyState
					title='Недавних папок пока нет'
					description='Откройте папку или добавьте в неё файл — она появится здесь.'
					className='min-h-32'
				/>
			) : (
				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5'>
					{folders.map(folder => (
						<Link
							key={folder.id}
							href={`${PAGES.folders}/${folder.id}`}
							className='flex w-full flex-col items-center justify-center rounded-lg border border-border bg-muted p-5 transition-colors hover:bg-muted'
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
