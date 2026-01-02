import { useContext } from 'react'
import { PopoverContext } from './popover'
import { cn } from '@/utils/cn'

interface Props {
	className?: string
	children: React.ReactNode
}

export function PopoverContent({ children, className }: Props) {
	const context = useContext(PopoverContext)

	if (!context) {
		throw new Error('PopoverContent must be used within a Popover')
	}

	const { open } = context

	if (!open) {
		return null
	}

	return (
		<div
			className={cn(
				className,
				open ? 'opacity-100' : 'opacity-0',
				'z-1000 p-2 border border-neutral-200 absolute bg-white duration-200 ease-in-out transition-opacity top-8.75 rounded-lg shadow-lg'
			)}
		>
			{children}
		</div>
	)
}
