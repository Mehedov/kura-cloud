import {
	Popover,
	PopoverContext,
	PopoverContextProps,
} from '@/shared/ui/popover/popover'
import { PopoverContent } from '@/shared/ui/popover/popover-content'
import { getDownloadUrl } from '@/entities/file/api/file.queries'
import { FileVisual } from '@/entities/file/ui/FileVisual'
import { ShareResourceDialog } from '@/features/share-resource/ui/ShareResourceDialog'
import {
	ResourceActionsDialogs,
	type ResourceAction,
} from '@/features/manage-resource/ui/ResourceActionsDialogs'
import {
	getFavorites,
	moveToTrash,
	restoreFromTrash,
	toggleFavorite,
} from '@/entities/folder/api/folder.queries'
import { FOLDER_KEYS } from '@/shared/config/query-keys'
import { cn } from '@/shared/lib/cn'
import { formatFileName } from '@/shared/lib/formatFileName.util'
import { useResourceAccess } from '@/entities/resource/model/resource-access'
import { useToastStore } from '@/shared/ui/toast/model/toast.store'
import { invalidateStorageQueries } from '@/shared/lib/invalidate-storage-queries'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	DownloadCloudIcon,
	FolderInput,
	Share2,
	SquarePen,
	Star,
	Trash2,
} from 'lucide-react'
import React, { forwardRef, memo, useState } from 'react'
import useLanguage from '@/shared/language/model'
import { translate } from '@/shared/language/translations'

export type FileProps = React.HTMLAttributes<HTMLDivElement> & {
	name: string
	id: string
	context?: PopoverContextProps | undefined
	imagePreview?: string
	type?: 'photo' | 'video' | 'document' | 'other'
	size?: number
}

interface ContextMenuContentProps {
	onDelete?: () => void
	downloadUrl?: string
	onRename?: () => void
	onMove?: () => void
	onShare?: () => void
	onFavorite?: () => void
	isFavorite?: boolean
}

export const ContextMenuContent = memo(
	({
		onDelete,
		downloadUrl,
		onRename,
		onMove,
		onShare,
		onFavorite,
		isFavorite,
	}: ContextMenuContentProps) => {
		const { canEdit, canMove, canManageAccess } = useResourceAccess()
		const language = useLanguage(state => state.language)

		return (
		<div className='flex flex-col text-sm'>
			{downloadUrl ? (
				<a
					href={downloadUrl}
					className='cursor-pointer flex items-center gap-2 text-left px-3 py-1.5 hover:bg-muted rounded'
				>
					<DownloadCloudIcon size={20} /> {translate(language, 'download')}
				</a>
			) : null}
			{canManageAccess && onShare && (
				<button
					className='cursor-pointer flex items-center gap-2 text-left text-md px-3 py-1.5 hover:bg-muted rounded'
					onClick={onShare}
				>
					<Share2 size={20} /> {translate(language, 'share')}
				</button>
			)}
			{onFavorite && (
				<button
					className='cursor-pointer flex items-center gap-2 text-left text-md px-3 py-1.5 hover:bg-muted rounded'
					onClick={onFavorite}
				>
					<Star size={20} />{' '}
					{translate(language, isFavorite ? 'removeFromFavorite' : 'addToFavorite')}
				</button>
			)}
			{canEdit && (
				<button
					className='cursor-pointer flex items-center gap-2 text-left text-md px-3 py-1.5 hover:bg-muted rounded'
					onClick={onRename}
				>
					<SquarePen size={20} />
					{translate(language, 'rename')}
				</button>
			)}
			{canEdit && canMove && (
				<button
					className='cursor-pointer flex items-center gap-2 text-left text-md px-3 py-1.5 hover:bg-muted rounded'
					onClick={onMove}
				>
					<FolderInput size={20} /> {translate(language, 'move')}
				</button>
			)}
			{canEdit && onDelete && (
				<button
					className='cursor-pointer flex items-center gap-2 text-left text-md px-3 py-1.5 hover:bg-muted rounded'
					onClick={onDelete}
				>
					<Trash2 size={20} /> {translate(language, 'delete')}
				</button>
			)}
		</div>
		)
	},
)

ContextMenuContent.displayName = 'ContextMenuContent'

export const FileGrid = forwardRef<HTMLDivElement, FileProps>(
	(
		{
			className,
			name,
			id,
			imagePreview,
			type = 'other',
		size = 90,
			...props
		},
		ref,
	) => {
		const queryClient = useQueryClient()
		const showToast = useToastStore(state => state.show)
		const language = useLanguage(state => state.language)
		const { canManageAccess, canMoveToRoot, canUndoDelete } = useResourceAccess()
		const [action, setAction] = useState<ResourceAction>(null)
		const [isShareOpen, setIsShareOpen] = useState(false)
		const [shouldFetchDownload, setShouldFetchDownload] = useState(false)

		const fileId = id
		const { data: favorites } = useQuery({
			queryKey: FOLDER_KEYS.favorites,
			queryFn: async () => (await getFavorites()).data,
		})
		const isFavorite = favorites?.files.some(file => file.id === fileId) ?? false

		const { data } = useQuery({
			queryKey: ['downloadUrl', fileId],
			queryFn: () => getDownloadUrl(fileId),
			enabled: Boolean(fileId && shouldFetchDownload),
		})

		const deleteFile = useMutation({
			mutationFn: moveToTrash,
			onSuccess: () => {
				void invalidateStorageQueries(queryClient)
				showToast(
					translate(language, 'fileMovedToTrash', { name: formatFileName(name) }),
					'success',
					canUndoDelete
						? {
								label: translate(language, 'undo'),
								onClick: () =>
									void restoreFromTrash({ id: fileId, type: 'file' })
										.then(() => invalidateStorageQueries(queryClient))
										.catch(() =>
										showToast(translate(language, 'restoreFileFailed'), 'error'),
										),
							}
						: undefined,
				)
			},
			onError: () =>
				showToast(translate(language, 'moveFileToTrashFailed'), 'error'),
		})

		const favoriteFile = useMutation({
			mutationFn: toggleFavorite,
			onSuccess: () => {
				void invalidateStorageQueries(queryClient)
				showToast(
					isFavorite
						? translate(language, 'fileRemovedFromFavorites', { name: formatFileName(name) })
						: translate(language, 'fileAddedToFavorites', { name: formatFileName(name) }),
					'success',
				)
			},
			onError: () => showToast(translate(language, 'fileFavoriteFailed'), 'error'),
		})

		const onDeleteFile = () => {
			if (fileId) {
				deleteFile.mutate({ id: fileId, type: 'file' })
			}
		}
		return (
			<Popover>
				<PopoverContext.Consumer>
					{context => (
						<>
							<div
								ref={ref}
								onContextMenu={e => {
									e.preventDefault()
									setShouldFetchDownload(true)
									context?.setCoords({ x: e.clientX, y: e.clientY })
									context?.setOpen(true)
								}}
								className={cn(
									'relative flex flex-col items-center duration-200 ease-in-out hover:-translate-y-1 cursor-pointer',
									className,
								)}
								style={{ width: `${size}px` }}
								{...props}
							>
								<FileVisual
									type={type}
									thumbnailUrl={imagePreview}
									alt={formatFileName(name)}
									size={size}
								/>

								<div className='text-center text-sm font-medium leading-tight line-clamp-2 wrap-break-word w-full mt-2'>
									{formatFileName(name)}
								</div>
							</div>
							<PopoverContent isContextMenu>
								<ContextMenuContent
									onDelete={onDeleteFile}
									downloadUrl={data?.downloadUrl}
									onRename={() => {
										context?.setOpen(false)
										setAction('rename')
									}}
									onMove={() => {
										context?.setOpen(false)
										setAction('move')
									}}
									onShare={
										canManageAccess
											? () => {
													context?.setOpen(false)
													setIsShareOpen(true)
												}
										: undefined
									}
									onFavorite={() => {
										context?.setOpen(false)
										favoriteFile.mutate({ id: fileId, type: 'file' })
									}}
									isFavorite={isFavorite}
								/>
							</PopoverContent>
							<ResourceActionsDialogs
								id={id}
								type='file'
								name={name}
								action={action}
								onClose={() => setAction(null)}
								allowRoot={canMoveToRoot}
							/>
							{isShareOpen && (
								<ShareResourceDialog
									resourceId={id}
									resourceType='file'
									resourceName={formatFileName(name)}
									onClose={() => setIsShareOpen(false)}
								/>
							)}
						</>
					)}
				</PopoverContext.Consumer>
			</Popover>
		)
	},
)

FileGrid.displayName = 'FileGrid'
