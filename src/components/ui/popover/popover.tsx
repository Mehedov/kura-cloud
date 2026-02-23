'use client'

import { cn } from '@/utils/cn'
import {
	createContext,
	PropsWithChildren,
	useEffect,
	useRef,
	useState,
} from 'react'

interface PopoverContextProps {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	coords: { x: number; y: number }
	setCoords: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>
}

export const PopoverContext = createContext<PopoverContextProps | undefined>(
	undefined,
)

export function Popover({
	children,
	className,
}: PropsWithChildren<{ className?: string }>) {
	const [open, setOpen] = useState(false)
	const [coords, setCoords] = useState({ x: 0, y: 0 })
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!open) return
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [open])

	return (
		<PopoverContext.Provider value={{ open, setOpen, coords, setCoords }}>
			<div ref={containerRef} className={cn('relative', className)}>
				{children}
			</div>
		</PopoverContext.Provider>
	)
}
