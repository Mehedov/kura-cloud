'use client'

import { getMyFolders, getSuggestedFolders } from '@/entities/folder/api/folder.queries'
import { useQuery } from '@tanstack/react-query'
import { FOLDER_KEYS } from '@/shared/config/query-keys'
import { cn } from '@/shared/lib/cn'
import { FolderIcon } from '@/shared/assets/icons/FolderIcon'
import { FolderAvatarStack } from '@/entities/folder/ui/FolderGrid'
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value'
import { HardDrive, LoaderCircle, Search } from 'lucide-react'
import { useState } from 'react'

interface Props {
	selectFolderId: string
	setSelectFolderId: (value: string) => void
}

export default function UploadFolderSelect({
	selectFolderId,
	setSelectFolderId,
}: Props) {
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search.trim())
	const isSearchDebouncing = search.trim() !== debouncedSearch
	const { data: suggestedData, isPending: isSuggestedPending } = useQuery({
		queryKey: FOLDER_KEYS.suggested,
		queryFn: getSuggestedFolders,
	})
	const { data: searchData, isPending: isSearchPending, isError } = useQuery({
		queryKey: ['folder-search', debouncedSearch],
		queryFn: () => getMyFolders({ q: debouncedSearch, limit: 10 }),
		enabled: debouncedSearch.length > 0,
	})
	const folders = suggestedData?.data.items ?? []
	const searchResults = searchData?.data ?? []
	const selectFolder = (folderId: string) => setSelectFolderId(folderId)

	return (
		<section className='space-y-3'>
			<div>
				<h2 className='text-md font-medium text-foreground'>Куда загрузить?</h2>
					<p className='mt-1 text-sm text-muted-foreground'>
						По умолчанию файлы попадут в корень хранилища.
					</p>
				</div>
				<button
					type='button'
					onClick={() => selectFolder('')}
					className={cn(
						'flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-left text-sm hover:bg-muted',
						selectFolderId === '' && 'bg-accent ring-1 ring-border',
					)}
				>
					<HardDrive size={17} /> Корень хранилища
				</button>
			<label className='flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground'>
				<Search size={16} />
				<input
					value={search}
					onChange={event => setSearch(event.target.value)}
					placeholder='Поиск папки'
					className='w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground'
				/>
				{isSearchDebouncing && <LoaderCircle size={16} className='animate-spin' />}
			</label>
			{debouncedSearch ? (
				isError ? (
					<p className='text-sm text-destructive'>Не удалось найти папки.</p>
				) : searchResults.length === 0 && !isSearchPending ? (
					<p className='text-sm text-muted-foreground'>Папки не найдены.</p>
				) : (
					<div className='grid grid-cols-5 gap-2'>
						{searchResults.map(folder => (
								<button
									key={folder.id}
									type='button'
									onClick={() => selectFolder(folder.id)}
									className={cn(
										'relative flex min-w-0 flex-col items-center rounded-lg p-1 hover:bg-muted',
										selectFolderId === folder.id && 'bg-accent ring-1 ring-border',
									)}
								>
									<FolderAvatarStack collaborators={folder.collaborators} />
									<FolderIcon size={40} />
									<span className='mt-1 w-full truncate text-center text-xs text-foreground'>
										{folder.name}
									</span>
								</button>
						))}
					</div>
				)
				) : (
				<div>
					{isSuggestedPending ? (
						<LoaderCircle size={18} className='animate-spin text-muted-foreground' />
					) : folders.length > 0 ? (
						<div className='grid grid-cols-5 gap-2'>
							{folders.map(folder => (
								<button
									type='button'
									onClick={() => selectFolder(folder.id)}
									key={folder.id}
									className={cn(
										'relative flex min-w-0 flex-col items-center rounded-lg p-1 hover:bg-muted',
										selectFolderId === folder.id && 'bg-accent ring-1 ring-border',
									)}
								>
									<FolderAvatarStack collaborators={folder.collaborators} />
									<FolderIcon size={40} />
									<span className='mt-1 w-full truncate text-center text-xs text-foreground'>
										{folder.name}
									</span>
								</button>
							))}
						</div>
					) : (
						<p className='text-sm text-muted-foreground'>Активных папок пока нет.</p>
					)}
				</div>
			)}
		</section>
	)
}
