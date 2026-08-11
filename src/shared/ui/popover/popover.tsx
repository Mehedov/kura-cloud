'use client'

import { cn } from '@/shared/lib/cn'
import {
	createContext,
	PropsWithChildren,
	useEffect,
	useRef,
	useState,
} from 'react'

export interface PopoverContextProps {
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
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setOpen(false)
		}
		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [open])

	return (
		<PopoverContext.Provider value={{ open, setOpen, coords, setCoords }}>
			<div ref={containerRef} className={cn('relative', className)}>
				{children}
			</div>
		</PopoverContext.Provider>
	)
}
