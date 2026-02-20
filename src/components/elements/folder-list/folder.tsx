import { FolderIcon } from '@/assets/icons/FolderIcon'
import { cn } from '@/utils/cn'
import Link from 'next/link'
import React, { forwardRef } from 'react'

type Props = React.HTMLAttributes<HTMLAnchorElement> & {
	pathname: string
	slug: string
	name: string
}

export const FolderLine = forwardRef<HTMLAnchorElement, Props>(
	({ className, pathname, slug, name, ...props }, ref) => {
		return (
			<Link
				ref={ref}
				href={`${pathname}/${slug}`}
				{...props}
				className={cn('w-full flex items-center', className)}
			>
				<div className='w-[60%] flex items-center gap-2'>
					<FolderIcon size={35} />
					<span className='line-clamp-2 leading-snug text-sm break-all'>
						{name}
					</span>
				</div>

				<span className='w-[10%] text-sm text-neutral-400'>20.20.2005</span>
				<span className='w-[20%] text-sm text-neutral-400'>20 GB</span>
			</Link>
		)
	},
)

FolderLine.displayName = 'Folder'

export const FolderGrid = forwardRef<HTMLAnchorElement, Props>(
	({ className, pathname, slug, name, ...props }, ref) => {
		return (
			<Link
				ref={ref}
				href={`${pathname}/${slug}`}
				className={cn(
					'w-30 flex flex-col items-center duration-200 ease-in-out hover:-translate-y-1',
					className,
				)}
				{...props}
			>
				<FolderIcon size={100} />
				<p className='text-center line-clamp-2 leading-snug text-sm break-keep'>
					{name}
				</p>
			</Link>
		)
	},
)

FolderGrid.displayName = 'FolderGrid'
