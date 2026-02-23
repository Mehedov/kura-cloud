'use client'

import React, { forwardRef } from 'react'
import { PopoverContent } from '../../ui/popover/popover-content'
import { EllipsisVertical, FolderClosed } from 'lucide-react'
import Link from 'next/link'
import { Popover, PopoverContext } from '../../ui/popover/popover'
import { cn } from '@/utils/cn'
import { PopoverTrigger } from '../../ui/popover/popover-trigger'
import { ContextMenuContent, FolderProps } from '../folder/folder'

const HomeFolderElement = forwardRef<HTMLAnchorElement, FolderProps>(
	({ className, name, ...props }, ref) => {
		return (
			<Popover>
				<PopoverContext.Consumer>
					{context => (
						<>
							<Link
								ref={ref}
								href={`/folders/${name
									.toLowerCase()
									.replace(/\s+/g, '-')
									.replace(/[^a-z0-9-]/g, '')}`}
								className={cn(
									'flex justify-between items-center w-[256px] bg-neutral-50 rounded-lg border border-gray-200 px-4 py-3',
									className,
								)}
								onContextMenu={e => {
									e.preventDefault()
									context?.setCoords({ x: e.clientX, y: e.clientY })
									context?.setOpen(true)
								}}
								{...props}
							>
								<div className='flex items-center gap-2'>
									<FolderClosed size={20} />
									<span className='text-neutral-700 line-clamp-1'>{name}</span>
								</div>
								<PopoverTrigger>
									<EllipsisVertical className='text-neutral-700' />
								</PopoverTrigger>
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

HomeFolderElement.displayName = 'HomeFolderElement'
export default HomeFolderElement
