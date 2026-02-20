'use client'

import { FolderIcon } from '@/assets/icons/FolderIcon'
import { Popover, PopoverContext } from '@/components/ui/popover/popover'
import { PopoverContent } from '@/components/ui/popover/popover-content'
import { cn } from '@/utils/cn'
import Link from 'next/link'
import React, { forwardRef } from 'react'

type FolderProps = React.HTMLAttributes<HTMLAnchorElement> & {
	pathname: string
	slug: string
	name: string
}

const ContextMenuContent = () => (
	<div className='flex flex-col text-sm'>
		<button className='text-left px-3 py-1.5 hover:bg-neutral-100 rounded'>
			Открыть
		</button>
		<button className='text-left px-3 py-1.5 hover:bg-neutral-100 rounded text-red-500'>
			Удалить
		</button>
	</div>
)

export const FolderGrid = forwardRef<HTMLAnchorElement, FolderProps>(
	({ className, pathname, slug, name, ...props }, ref) => {
		return (
			<Popover className='w-full'>
				<PopoverContext.Consumer>
					{context => (
						<>
							<Link
								ref={ref}
								href={`${pathname}/${slug}`}
								className={cn(
									'w-28.5 flex flex-col items-center gap-2 p-2 rounded-xl duration-200 hover:-translate-y-1',
									className,
								)}
								{...props}
								onContextMenu={e => {
									e.preventDefault()
									context?.setCoords({ x: e.clientX, y: e.clientY })
									context?.setOpen(true)
								}}
							>
								<FolderIcon size={100} />
								<p className='text-center text-sm font-medium leading-tight line-clamp-2 wrap-break-word w-full'>
									{name}
								</p>
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

FolderGrid.displayName = 'FolderGrid'

export const FolderLine = forwardRef<HTMLAnchorElement, FolderProps>(
	({ className, pathname, slug, name, ...props }, ref) => {
		return (
			<Popover>
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
