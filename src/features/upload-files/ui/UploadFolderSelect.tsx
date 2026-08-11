'use client'

import { getMyFolders, getSuggestedFolders } from '@/entities/folder/api/folder.queries'
import { useQuery } from '@tanstack/react-query'
import { FOLDER_KEYS } from '@/shared/config/query-keys'
import { cn } from '@/shared/lib/cn'
import { FolderIcon } from '@/shared/assets/icons/FolderIcon'
import { FolderAvatarStack } from '@/entities/folder/ui/FolderGrid'
import useAuthStore from '@/entities/session/model/session.store'
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value'
import { HardDrive, LoaderCircle, Search } from 'lucide-react'
import { useState } from 'react'
import useLanguage from '@/shared/language/model'
import { translate } from '@/shared/language/translations'

interface Props {
	selectFolderId: string
	setSelectFolderId: (value: string) => void
}

export default function UploadFolderSelect({
	selectFolderId,
	setSelectFolderId,
}: Props) {
	const userId = useAuthStore(state => state.user?.id)
	const language = useLanguage(state => state.language)
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search.trim())
	const isSearchDebouncing = search.trim() !== debouncedSearch
	const { data: suggestedData, isPending: isSuggestedPending } = useQuery({
		queryKey: FOLDER_KEYS.suggestedForUser(userId ?? ''),
		queryFn: getSuggestedFolders,
		enabled: Boolean(userId),
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
					<h2 className='text-md font-medium text-foreground'>{translate(language, 'whereToUpload')}</h2>
					<p className='mt-1 text-sm text-muted-foreground'>
						{translate(language, 'uploadDefaultDescription')}
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
						<HardDrive size={17} /> {translate(language, 'moveToRoot')}
				</button>
			<label className='flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground'>
				<Search size={16} />
				<input
					value={search}
					onChange={event => setSearch(event.target.value)}
						placeholder={translate(language, 'searchFolder')}
					className='w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground'
				/>
				{isSearchDebouncing && <LoaderCircle size={16} className='animate-spin' />}
			</label>
			{debouncedSearch ? (
				isError ? (
						<p className='text-sm text-destructive'>{translate(language, 'foldersSearchError')}</p>
				) : searchResults.length === 0 && !isSearchPending ? (
						<p className='text-sm text-muted-foreground'>{translate(language, 'foldersNotFound')}</p>
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
							<p className='text-sm text-muted-foreground'>{translate(language, 'noActiveFolders')}</p>
					)}
				</div>
			)}
		</section>
	)
}
