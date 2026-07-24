import { FolderIcon } from '@/assets/icons/FolderIcon'
import {
	Popover,
	PopoverContext,
	PopoverContextProps,
} from '@/components/ui/popover/popover'
import { PopoverContent } from '@/components/ui/popover/popover-content'
import { FOLDER_KEYS } from '@/constants/queryKeys'
import { hardDeleteFolder } from '@/services/folder.service'
import { cn } from '@/utils/cn'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DownloadCloudIcon, FolderInput, SquarePen, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React, { forwardRef, memo } from 'react'

export type FolderProps = React.HTMLAttributes<HTMLAnchorElement> & {
	pathname?: string
	slug?: string
	name: string
	size?: number
	id: string
	context?: PopoverContextProps | undefined
}

export const ContextMenuContent: React.FC<{
	onDelete?: (itemId: string) => void
	itemId?: string
}> = memo(({ onDelete, itemId }) => (
	<div className='flex flex-col text-sm'>
		<button className='cursor-pointer flex items-center gap-2 rounded px-3 py-1.5 text-left hover:bg-neutral-100'>
			<DownloadCloudIcon size={20} /> Скачать
		</button>
		<button className='cursor-pointer flex items-center gap-2 rounded px-3 py-1.5 text-left text-md hover:bg-neutral-100'>
			<SquarePen size={20} />
			Переименовать
		</button>
		<button className='cursor-pointer flex items-center gap-2 rounded px-3 py-1.5 text-left text-md hover:bg-neutral-100'>
			<FolderInput size={20} /> Переместить
		</button>
		{onDelete && itemId ? (
			<button
				className='cursor-pointer flex items-center gap-2 rounded px-3 py-1.5 text-left text-md hover:bg-neutral-100'
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
		const itemSize = size || 100
		const itemHref = {
			pathname: `${pathname}/${name}`,
			query: { id },
		} as const

		const deleteFolder = useMutation({
			mutationFn: hardDeleteFolder,
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.all })
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
								/>
							</PopoverContent>
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
			...props
		},
		ref,
	) => {
		const slug = name
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9-]/g, '')

		return (
			<Popover className='w-full'>
				<PopoverContext.Consumer>
					{context => (
						<>
							<Link
								ref={ref}
								href={`${pathname}/${slug}`}
								onContextMenu={e => {
									e.preventDefault()
									context?.setCoords({ x: e.clientX, y: e.clientY })
									context?.setOpen(true)
								}}
								className={cn(
									'w-full flex items-center rounded-lg p-2 hover:bg-neutral-50',
									className,
								)}
								{...props}
							>
								<div className='flex w-[60%] items-center gap-3'>
									<FolderIcon size={30} />
									<span className='line-clamp-1 text-sm'>{name}</span>
								</div>
								<span className='w-[20%] text-sm text-neutral-400'>
									20.02.2025
								</span>
								<span className='w-[20%] text-sm text-neutral-400'>20 GB</span>
							</Link>
							<PopoverContent isContextMenu>
								<ContextMenuContent />
							</PopoverContent>
						</>
					)}
				</PopoverContext.Consumer>
			</Popover>
		)
	},
)

FolderLine.displayName = 'FolderLine'
