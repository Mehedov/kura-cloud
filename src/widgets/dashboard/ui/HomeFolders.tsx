import { PAGES } from '@/shared/config/page.config'
import { FolderGrid } from '@/entities/folder/ui/FolderGrid'
import { getFolderItems } from '@/entities/folder/api/folder.queries'
import { useQuery } from '@tanstack/react-query'
import { FOLDER_KEYS } from '@/shared/config/query-keys'
import Link from 'next/link'
import {
	EmptyState,
	ErrorState,
	LoadingState,
} from '@/shared/ui/states/async-state'

export default function HomeFolders() {
	const { data, isPending, isError, error, refetch } = useQuery({
		queryKey: FOLDER_KEYS.root,
		queryFn: () =>
			getFolderItems('root', {
				kind: 'folders',
				sort: 'name',
				order: 'asc',
				page: 1,
				limit: 10,
			}),
	})

	const folders = (data?.data.items ?? []).filter(
		item => item.kind === 'folder',
	)

	const foldersRender = folders.map(folder => (
		<FolderGrid
			id={folder.id}
			name={folder.name}
			key={folder.id}
			size={90}
			pathname={PAGES.folders}
			collaborators={folder.collaborators}
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
					Folders {data?.data.pagination.total && data.data.pagination.total > 10 && `more ${data.data.pagination.total - 10}...`}
				</Link>
			</h2>
			<div className='flex items-start flex-wrap gap-4'>{foldersRender}</div>
		</section>
	)
}
