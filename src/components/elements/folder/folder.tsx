import { FolderIcon } from '@/assets/icons/FolderIcon'
import {
	Popover,
	PopoverContext,
	PopoverContextProps,
} from '@/components/ui/popover/popover'
import { PopoverContent } from '@/components/ui/popover/popover-content'
import { FOLDER_KEYS } from '@/constants/queryKeys'
import {
	ResourceActionsDialogs,
	type ResourceAction,
} from '@/components/elements/resource-actions/resource-actions-dialogs'
import { moveToTrash } from '@/services/folder.service'
import { cn } from '@/utils/cn'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DownloadCloudIcon, FolderInput, SquarePen, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React, { forwardRef, memo, useState } from 'react'

export type FolderProps = React.HTMLAttributes<HTMLAnchorElement> & {
	pathname?: string
	slug?: string
	name: string
	size?: number
	id: string
	updatedAt?: string
	context?: PopoverContextProps | undefined
}

export const ContextMenuContent: React.FC<{
	onDelete?: (itemId: string) => void
	itemId?: string
	onRename?: () => void
	onMove?: () => void
}> = memo(({ onDelete, itemId, onRename, onMove }) => (
	<div className='flex flex-col text-sm'>
		<button className='cursor-pointer flex items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-muted'>
			<DownloadCloudIcon size={20} /> Скачать
		</button>
		<button
			className='cursor-pointer flex items-center gap-2 rounded px-3 py-1.5 text-left text-md hover:bg-muted'
			onClick={onRename}
		>
			<SquarePen size={20} />
			Переименовать
		</button>
		<button
			className='cursor-pointer flex items-center gap-2 rounded px-3 py-1.5 text-left text-md hover:bg-muted'
			onClick={onMove}
		>
			<FolderInput size={20} /> Переместить
		</button>
		{onDelete && itemId ? (
			<button
				className='cursor-pointer flex items-center gap-2 rounded px-3 py-1.5 text-left text-md hover:bg-muted'
				onClick={() => onDelete(itemId)}
			>
				<Trash2 size={20} /> Удалить
			</button>
		) : null}
	</div>
))

ContextMenuContent.displayName = 'ContextMenuContent'

export const FolderGrid = forwardRef<HTMLAnchorElement, FolderProps>(
	(
		{
			className,
			name,
			pathname,
			id,
			size,
			...props
		},
		ref,
	) => {
		const queryClient = useQueryClient()
		const [action, setAction] = useState<ResourceAction>(null)
		const itemSize = size || 100
		const itemHref = `${pathname}/${id}`

		const deleteFolder = useMutation({
			mutationFn: moveToTrash,
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.all })
				queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.root })
				queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.files })
				queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.suggested })
			},
		})

		const onDeleteFolder = (folderId: string) => {
			if (folderId) {
				deleteFolder.mutate({ id: folderId, type: 'folder' })
			}
		}

		return (
			<Popover>
				<PopoverContext.Consumer>
					{context => (
						<>
							<Link
								ref={ref}
								href={itemHref}
								className={cn(
									'flex flex-col items-center rounded-xl duration-200 hover:-translate-y-1',
									className,
								)}
								style={{ width: `${itemSize}px` }}
								{...props}
								onContextMenu={e => {
									e.preventDefault()
									context?.setCoords({ x: e.clientX, y: e.clientY })
									context?.setOpen(true)
								}}
							>
								<FolderIcon size={itemSize} />
								<p className='mt-1 w-full text-center text-sm font-medium leading-tight line-clamp-2 wrap-break-word'>
									{name}
								</p>
							</Link>
							<PopoverContent isContextMenu>
								<ContextMenuContent
									itemId={id}
									onDelete={onDeleteFolder}
									onRename={() => setAction('rename')}
									onMove={() => setAction('move')}
								/>
							</PopoverContent>
							<ResourceActionsDialogs
								id={id}
								type='folder'
								name={name}
								action={action}
								onClose={() => setAction(null)}
							/>
						</>
					)}
				</PopoverContext.Consumer>
			</Popover>
		)
	},
)

FolderGrid.displayName = 'FolderGrid'

export const FolderLine = forwardRef<HTMLAnchorElement, FolderProps>(
	(
		{
			className,
			pathname,
			name,
			id,
			updatedAt,
			...props
		},
		ref,
	) => {
		const itemHref = `${pathname}/${id}`
		const [action, setAction] = useState<ResourceAction>(null)

		return (
			<Popover className='w-full'>
				<PopoverContext.Consumer>
					{context => (
						<>
							<Link
								ref={ref}
								href={itemHref}
								onContextMenu={e => {
									e.preventDefault()
									context?.setCoords({ x: e.clientX, y: e.clientY })
									context?.setOpen(true)
								}}
								className={cn(
									'w-full flex items-center rounded-lg p-2 hover:bg-muted',
									className,
								)}
								{...props}
							>
								<div className='flex w-[60%] items-center gap-3'>
									<FolderIcon size={30} />
									<span className='line-clamp-1 text-sm'>{name}</span>
								</div>
								<span className='w-[20%] text-sm text-muted-foreground'>
									{updatedAt
										? new Intl.DateTimeFormat('ru-RU', {
												day: '2-digit',
												month: 'short',
												year: 'numeric',
											}).format(new Date(updatedAt))
										: '—'}
								</span>
								<span className='w-[20%] text-sm text-muted-foreground'>Папка</span>
							</Link>
							<PopoverContent isContextMenu>
								<ContextMenuContent
									onRename={() => setAction('rename')}
									onMove={() => setAction('move')}
								/>
							</PopoverContent>
							<ResourceActionsDialogs
								id={id}
								type='folder'
								name={name}
								action={action}
								onClose={() => setAction(null)}
							/>
						</>
					)}
				</PopoverContext.Consumer>
			</Popover>
		)
	},
)

FolderLine.displayName = 'FolderLine'
