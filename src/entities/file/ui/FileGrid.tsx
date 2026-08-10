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
	moveToTrash,
	restoreFromTrash,
} from '@/entities/folder/api/folder.queries'
import { cn } from '@/shared/lib/cn'
import { formatFileName } from '@/shared/lib/formatFileName.util'
import { useToastStore } from '@/shared/ui/toast/model/toast.store'
import { invalidateStorageQueries } from '@/shared/lib/invalidate-storage-queries'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	DownloadCloudIcon,
	FolderInput,
	Share2,
	SquarePen,
	Trash2,
} from 'lucide-react'
import React, { forwardRef, memo, useState } from 'react'

export type FileProps = React.HTMLAttributes<HTMLDivElement> & {
	name: string
	id: string
	context?: PopoverContextProps | undefined
	imagePreview?: string
	type?: 'photo' | 'video' | 'document' | 'other'
	size?: number
	canEdit?: boolean
	canMove?: boolean
	canManageAccess?: boolean
	canMoveToRoot?: boolean
	canUndoDelete?: boolean
}

interface ContextMenuContentProps {
	onDelete?: () => void
	downloadUrl?: string
	onRename?: () => void
	onMove?: () => void
	onShare?: () => void
	canEdit?: boolean
	canMove?: boolean
}

export const ContextMenuContent = memo(
	({
		onDelete,
		downloadUrl,
		onRename,
		onMove,
		onShare,
		canEdit = true,
		canMove = true,
	}: ContextMenuContentProps) => (
		<div className='flex flex-col text-sm'>
			{downloadUrl ? (
				<a
					href={downloadUrl}
					className='cursor-pointer flex items-center gap-2 text-left px-3 py-1.5 hover:bg-muted rounded'
				>
					<DownloadCloudIcon size={20} /> Скачать
				</a>
			) : null}
			{canEdit && onShare && (
				<button
					className='cursor-pointer flex items-center gap-2 text-left text-md px-3 py-1.5 hover:bg-muted rounded'
					onClick={onShare}
				>
					<Share2 size={20} /> Поделиться
				</button>
			)}
			{canEdit && (
				<button
					className='cursor-pointer flex items-center gap-2 text-left text-md px-3 py-1.5 hover:bg-muted rounded'
					onClick={onRename}
				>
					<SquarePen size={20} />
					Переименовать
				</button>
			)}
			{canEdit && canMove && (
				<button
					className='cursor-pointer flex items-center gap-2 text-left text-md px-3 py-1.5 hover:bg-muted rounded'
					onClick={onMove}
				>
					<FolderInput size={20} /> Переместить
				</button>
			)}
			{canEdit && onDelete && (
				<button
					className='cursor-pointer flex items-center gap-2 text-left text-md px-3 py-1.5 hover:bg-muted rounded'
					onClick={onDelete}
				>
					<Trash2 size={20} /> Удалить
				</button>
			)}
		</div>
	),
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
			canEdit = true,
			canMove = true,
			canManageAccess = true,
			canMoveToRoot = true,
			canUndoDelete = true,
			...props
		},
		ref,
	) => {
		const queryClient = useQueryClient()
		const showToast = useToastStore(state => state.show)
		const [action, setAction] = useState<ResourceAction>(null)
		const [isShareOpen, setIsShareOpen] = useState(false)
		const [shouldFetchDownload, setShouldFetchDownload] = useState(false)

		const fileId = id

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
					`Файл «${formatFileName(name)}» перемещён в корзину`,
					'success',
					canUndoDelete
						? {
								label: 'Отменить',
								onClick: () =>
									void restoreFromTrash({ id: fileId, type: 'file' })
										.then(() => invalidateStorageQueries(queryClient))
										.catch(() =>
											showToast('Не удалось восстановить файл', 'error'),
										),
							}
						: undefined,
				)
			},
			onError: () =>
				showToast('Не удалось переместить файл в корзину', 'error'),
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
									canEdit={canEdit}
									canMove={canMove}
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
