'use client'

import React, { forwardRef, useContext } from 'react'
import { PopoverContext } from './popover'
import { cn } from '@/utils/cn'

type Props = React.HTMLAttributes<HTMLDivElement> & {
	isContextMenu?: boolean
}

export const PopoverContent = forwardRef<HTMLDivElement, Props>(
	({ className, children, isContextMenu, style, ...props }, ref) => {
		const context = useContext(PopoverContext)
		if (!context)
			throw new Error('PopoverContent must be used within a Popover')

		const { open, coords } = context
		if (!open) return null

		const contextStyles: React.CSSProperties = isContextMenu
			? { position: 'fixed', top: coords.y, left: coords.x, margin: 0 }
			: {}

		return (
			<div
				ref={ref}
				style={{ ...contextStyles, ...style }}
				className={cn(
					'z-[1000] p-1 border border-neutral-200 absolute bg-white rounded-lg shadow-xl min-w-[150px]',
					!isContextMenu && 'top-full mt-2',
					className,
				)}
				{...props}
			>
				{children}
			</div>
		)
	},
)

PopoverContent.displayName = 'PopoverContent'
