'use client'

import { ReactNode, useEffect, useRef } from 'react'

interface Props {
	children: ReactNode
	isOpen: boolean
	onClose: (value: boolean) => void
}

export default function ModalContainer({ children, isOpen, onClose }: Props) {
	const modalRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
				onClose(false)
			}
		}
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isOpen, onClose])

	return (
		<div className='fixed inset-0 z-1000 flex items-center justify-center overflow-y-auto bg-foreground/20 p-4 backdrop-blur-[1px]'>
			<div ref={modalRef}> {children}</div>
		</div>
	)
}
