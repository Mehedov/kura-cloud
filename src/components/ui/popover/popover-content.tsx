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

	return (
		<div
			className={cn(
				className,
				open ? 'opacity-100' : 'opacity-0',
				`z-1000 p-2 border border-neutral-200 absolute bg-white duration-100 ease-in-out transition-opacity top-8.75 rounded-lg shadow-lg opacity-${open ? '100' : '0'}`,
			)}
		>
			{children}
		</div>
	)
}
