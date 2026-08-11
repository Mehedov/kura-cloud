'use client'

import { FileGrid } from '@/entities/file/ui/FileGrid'
import { getFavorites } from '@/entities/folder/api/folder.queries'
import { FolderGrid } from '@/entities/folder/ui/FolderGrid'
import { FOLDER_KEYS } from '@/shared/config/query-keys'
import { EmptyState, ErrorState, LoadingState } from '@/shared/ui/states/async-state'
import { useQuery } from '@tanstack/react-query'
import { Star } from 'lucide-react'
import useLanguage from '@/shared/language/model'

export default function FavoritePage() {
	const { data, isPending, isError, error, refetch } = useQuery({
		queryKey: FOLDER_KEYS.favorites,
		queryFn: async () => (await getFavorites()).data,
	})
	const { favorite, objects, folders: foldersLabel, files: filesLabel, favoriteDescription, loadingFavorites, favoriteEmpty, favoriteEmptyDescription } = useLanguage(state => state.t)

	const folders = data?.folders ?? []
	const files = data?.files ?? []
	const total = folders.length + files.length

	return (
		<section className='flex min-w-0 flex-col gap-6 pb-6'>
			<div className='flex items-start justify-between gap-4'>
				<div>
					<h1 className='flex items-center gap-2 text-2xl font-semibold text-foreground'>
						<Star className='text-amber-500' size={24} /> {favorite}
					</h1>
					<p className='mt-1 text-sm text-muted-foreground'>
						{favoriteDescription}
					</p>
				</div>
				{!isPending && !isError && (
					<span className='rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground'>
						{total} {objects}
					</span>
				)}
			</div>

			{isPending ? (
				<LoadingState title={loadingFavorites} />
			) : isError ? (
				<ErrorState description={error.message} onRetry={() => void refetch()} />
			) : total === 0 ? (
				<EmptyState
					title={favoriteEmpty}
					description={favoriteEmptyDescription}
				/>
			) : (
				<>
					{folders.length > 0 && (
						<div>
					<h2 className='mb-4 text-base font-medium text-foreground'>{foldersLabel}</h2>
							<div className='grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-5'>
								{folders.map(folder => (
									<FolderGrid
										key={folder.id}
										id={folder.id}
										name={folder.name}
										pathname='/folders'
										size={96}
										collaborators={folder.collaborators}
									/>
								))}
							</div>
						</div>
					)}

					{files.length > 0 && (
						<div>
						<h2 className='mb-4 text-base font-medium text-foreground'>{filesLabel}</h2>
							<div className='grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-5'>
								{files.map(file => (
									<FileGrid
										key={file.id}
										id={file.id}
										name={file.name}
										type={file.type}
										imagePreview={file.thumbnailUrl}
										size={96}
									/>
								))}
							</div>
						</div>
					)}
				</>
			)}
		</section>
	)
}
