'use client'

import { PopoverContext } from '@/shared/ui/popover/popover'
import { MoreVertical } from 'lucide-react'
import { useContext } from 'react'

interface ContextMenuTriggerProps {
	ariaLabel: string
	className?: string
	onOpen?: () => void
}

export function ContextMenuTrigger({
	ariaLabel,
	className = 'absolute right-2 top-2 z-20 rounded-md bg-black/55 p-1 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100',
	onOpen,
}: ContextMenuTriggerProps) {
	const context = useContext(PopoverContext)

	return (
		<button
			type='button'
			aria-label={ariaLabel}
			aria-haspopup='menu'
			aria-expanded={context?.open ?? false}
			className={className}
			onClick={event => {
				event.stopPropagation()
				onOpen?.()
				const rect = event.currentTarget.getBoundingClientRect()
				context?.setCoords({ x: rect.left, y: rect.bottom + 4 })
				context?.setOpen(open => !open)
			}}
		>
			<MoreVertical size={18} />
		</button>
	)
}
