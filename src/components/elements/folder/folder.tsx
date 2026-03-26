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

export const ContextMenuContent: React.FC = memo(({ onDelete, folderId }) => (
	<div className='flex flex-col text-sm'>
		<button className='cursor-pointer flex items-center gap-2 text-left px-3 py-1.5 hover:bg-neutral-100 rounded'>
			<DownloadCloudIcon size={20} /> Скачать
		</button>
		<button className='cursor-pointer flex items-center gap-2 text-left text-md px-3 py-1.5 hover:bg-neutral-100 rounded'>
			<SquarePen size={20} />
			Переименовать
		</button>
		<button className='cursor-pointer flex items-center gap-2 text-left text-md px-3 py-1.5 hover:bg-neutral-100 rounded'>
			<FolderInput size={20} /> Переместить
		</button>
		<button
			className='cursor-pointer flex items-center gap-2 text-left text-md px-3 py-1.5 hover:bg-neutral-100 rounded'
			onClick={() => onDelete(folderId)}
		>
			<Trash2 size={20} /> Удалить
		</button>
	</div>
))

ContextMenuContent.displayName = 'ContextMenuContent'

export const FolderGrid = forwardRef<HTMLAnchorElement, FolderProps>(
	({ className, name, pathname, id, size, ...props }, ref) => {
		const queryClient = useQueryClient()

		const slug = name
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9-]/g, '')
		const deleteFolder = useMutation({
			mutationFn: hardDeleteFolder,
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.all })
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
								href={`${pathname}/${slug}`}
								className={cn(
									`flex flex-col items-center gap-2 p-2 rounded-xl duration-200 hover:-translate-y-1`,
									className,
								)}
								style={{ width: size ? `${size}px` : '100px' }}
								{...props}
								onContextMenu={e => {
									e.preventDefault()
									context?.setCoords({ x: e.clientX, y: e.clientY })
									context?.setOpen(true)
								}}
							>
								<FolderIcon size={size || 100} />
								<p
									className={`text-center text-sm font-medium leading-tight line-clamp-2 wrap-break-word w-full w-[${size}px]`}
								>
									{name}
								</p>
							</Link>
							<PopoverContent isContextMenu>
								<ContextMenuContent
									folderId={id}
									onDelete={onDeleteFolder}
									context={context}
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
	({ className, pathname, name, ...props }, ref) => {
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
									'w-full flex items-center p-2 hover:bg-neutral-50 rounded-lg',
									className,
								)}
								{...props}
							>
								<div className='w-[60%] flex items-center gap-3'>
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
