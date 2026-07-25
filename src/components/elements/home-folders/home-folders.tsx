import { PAGES } from '@/config/page.config'
import { FolderGrid } from '../folder/folder'
import { getMyFolders } from '@/services/folder.service'
import { useQuery } from '@tanstack/react-query'
import { FOLDER_KEYS } from '@/constants/queryKeys'
import Link from 'next/link'
import {
	EmptyState,
	ErrorState,
	LoadingState,
} from '@/components/ui/states/async-state'

export default function HomeFolders() {
	const { data, isPending, isError, error, refetch } = useQuery({
		queryKey: FOLDER_KEYS.all,
		queryFn: getMyFolders,
	})

	const folders = data?.data || []

	const foldersRender = folders.slice(0, 10).map(folder => (
		<FolderGrid
			id={folder.id}
			name={folder.name}
			key={folder.id}
			size={90}
			pathname={PAGES.folders}
		/>
	))

	if (isPending) return <LoadingState title='Загружаем папки' />
	if (isError)
		return <ErrorState description={error.message} onRetry={() => void refetch()} />
	if (folders.length === 0)
		return (
			<EmptyState
				title='Создайте первую папку'
				description='Она появится здесь и будет доступна на главной странице.'
			/>
		)

	return (
		<section>
			<h2 className='text-md text-foreground font-medium mb-4'>
				<Link
					href='/folders'
					className='text-md text-foreground font-medium mb-4 duration-200 ease-in-out hover:text-foreground'
				>
					Folders {folders.length > 10 && `more ${folders.length - 10}...`}
				</Link>
			</h2>
			<div className='flex items-start flex-wrap gap-4'>{foldersRender}</div>
		</section>
	)
}
