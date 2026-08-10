'use client'

import { createPortal } from 'react-dom'
import { useEffect, useRef, useState, type ReactNode } from 'react'

type TooltipProps = {
	children: ReactNode
	content: ReactNode
	side?: 'top' | 'bottom'
}

type Position = {
	left: number
	top: number
}

export function Tooltip({ children, content, side = 'top' }: TooltipProps) {
	const triggerRef = useRef<HTMLSpanElement | null>(null)
	const [isVisible, setIsVisible] = useState(false)
	const [position, setPosition] = useState<Position | null>(null)

	useEffect(() => {
		if (!isVisible || !triggerRef.current) return

		const updatePosition = () => {
			if (!triggerRef.current) return
			const rect = triggerRef.current.getBoundingClientRect()
			setPosition({
				left: rect.left + rect.width / 2,
				top: side === 'bottom' ? rect.bottom + 8 : rect.top - 8,
			})
		}

		updatePosition()
		window.addEventListener('scroll', updatePosition, true)
		window.addEventListener('resize', updatePosition)

		return () => {
			window.removeEventListener('scroll', updatePosition, true)
			window.removeEventListener('resize', updatePosition)
		}
	}, [isVisible, side])

	return (
		<span
			ref={triggerRef}
			className='inline-flex shrink-0'
			onMouseEnter={() => setIsVisible(true)}
			onMouseLeave={() => setIsVisible(false)}
			onFocusCapture={() => setIsVisible(true)}
			onBlurCapture={() => setIsVisible(false)}
		>
			{children}
			{isVisible &&
				position &&
				createPortal(
					<span
						role='tooltip'
						className={`pointer-events-none fixed z-[1100] w-max max-w-64 -translate-x-1/2 rounded-lg border border-border bg-card px-3 py-2 text-left text-xs text-card-foreground shadow-md ${side === 'top' ? '-translate-y-full' : ''}`}
						style={{ left: position.left, top: position.top }}
					>
						{content}
					</span>,
					document.body,
				)}
		</span>
	)
}
