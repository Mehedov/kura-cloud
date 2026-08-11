'use client'

import { ReactNode, useEffect, useRef } from 'react'
import useLanguage from '@/shared/language/model'

interface Props {
	children: ReactNode
	isOpen: boolean
	onClose: (value: boolean) => void
	ariaLabel?: string
}

const FOCUSABLE_ELEMENTS =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function ModalContainer({
	children,
	isOpen,
	onClose,
	ariaLabel,
}: Props) {
	const { dialog } = useLanguage(state => state.t)
	const modalRef = useRef<HTMLDivElement | null>(null)
	const previousFocusRef = useRef<HTMLElement | null>(null)

	useEffect(() => {
		if (!isOpen) return

		previousFocusRef.current = document.activeElement as HTMLElement | null
		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		const focusable = modalRef.current?.querySelector<HTMLElement>(FOCUSABLE_ELEMENTS)
		;(focusable ?? modalRef.current)?.focus()

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				event.preventDefault()
				onClose(false)
				return
			}
			if (event.key !== 'Tab' || !modalRef.current) return

			const elements = Array.from(
				modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS),
			)
			if (elements.length === 0) {
				event.preventDefault()
				modalRef.current.focus()
				return
			}
			const first = elements[0]
			const last = elements[elements.length - 1]
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault()
				last.focus()
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault()
				first.focus()
			}
		}

		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.body.style.overflow = previousOverflow
			previousFocusRef.current?.focus()
		}
	}, [isOpen, onClose])

	if (!isOpen) return null

	return (
		<div
			className='fixed inset-0 z-1000 flex items-center justify-center overflow-y-auto bg-foreground/20 p-4 backdrop-blur-[1px]'
			onMouseDown={event => {
				if (event.target === event.currentTarget) onClose(false)
			}}
		>
			<div
				ref={modalRef}
				role='dialog'
				aria-modal='true'
				aria-label={ariaLabel ?? dialog}
				tabIndex={-1}
			>
				{children}
			</div>
		</div>
	)
}
