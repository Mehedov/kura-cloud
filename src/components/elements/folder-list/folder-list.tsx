import { FolderGrid, FolderLine } from '@/components/elements/folder/folder'
import { FOLDER_KEYS } from '@/constants/queryKeys'
import { getFolderItems } from '@/services/folder.service'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import {
	EmptyState,
	ErrorState,
	LoadingState,
} from '@/components/ui/states/async-state'

interface Props {
	activeBtn?: 'menu' | 'grid'
	sortBy: 'name' | 'updatedAt'
}

export function FolderList({ activeBtn, sortBy }: Props) {
	const { data, isPending, isError, error, refetch } = useQuery({
		queryKey: [...FOLDER_KEYS.all, sortBy],
		queryFn: () =>
			getFolderItems('root', {
				sort: sortBy,
				order: sortBy === 'updatedAt' ? 'desc' : 'asc',
				limit: 100,
			}),
	})

	const folders = (data?.data.items ?? []).filter(
		item => item.kind === 'folder',
	)
	const pathname = usePathname()

	const renderFoldersTypeMenu = () => {
		return folders.map(folder => (
			<FolderLine
				pathname={pathname}
				name={folder.name}
				key={folder.id}
				id={folder.id}
				updatedAt={folder.updatedAt}
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

	if (isPending) return <LoadingState title='Загружаем папки' />
	if (isError)
		return <ErrorState description={error.message} onRetry={() => void refetch()} />
	if (folders.length === 0)
		return (
			<EmptyState
				title='Здесь пока нет папок'
				description='Создайте первую папку, чтобы начать организовывать файлы.'
			/>
		)

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
