'use client'

import React, { useContext, ReactElement, MouseEvent } from 'react'
import { PopoverContext } from './popover'

interface PopoverTriggerProps {
	children?: React.ReactNode
}

interface CloneProps {
	onClick?: (e: MouseEvent) => void
}

export function PopoverTrigger({ children }: PopoverTriggerProps) {
	const context = useContext(PopoverContext)

	if (!context) {
		throw new Error('PopoverTrigger must be used within a Popover')
	}

	const { setOpen } = context

	if (!children || !React.isValidElement(children)) {
		return null
	}

	const child = children as ReactElement<CloneProps>

	return React.cloneElement(child, {
		onClick: (e: MouseEvent) => {
			child.props.onClick?.(e)

			e.preventDefault()
			setOpen(prev => !prev)
		},
	})
}
