import React, { PropsWithChildren, useContext } from 'react'
import { PopoverContext } from './popover'

export function PopoverTrigger({ children }: PropsWithChildren) {
	const context = useContext(PopoverContext)
	if (!context) {
		throw new Error('PopoverTrigger must be used within a Popover')
	}
	const { setOpen } = context
	const handleClick = () => {
		setOpen(prev => !prev)
	}
	const cloneChild = React.cloneElement(
		children as React.ReactElement<{ onClick: () => void }>,
		{
			onClick: handleClick,
		}
	)
	return cloneChild
}
