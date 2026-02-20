import React, { forwardRef, useContext } from 'react'
import { PopoverContext } from './popover'
import { cn } from '@/utils/cn'

type Props = React.HTMLAttributes<HTMLElement>

export const PopoverContent = forwardRef<HTMLElement, Props>(
	({ className, children, ...props }, ref) => {
		const context = useContext(PopoverContext)

		if (!context) {
			throw new Error('PopoverContent must be used within a Popover')
		}

		const { open } = context

		if (!open) return null

		return (
			<div
				ref={ref as React.RefObject<HTMLDivElement>}
				className={cn(
					'z-1000 p-2 border border-neutral-200 absolute bg-white transition-opacity duration-200 ease-in-out top-8.75 rounded-lg shadow-lg',
					open ? 'opacity-100' : 'opacity-0',
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
