import { cn } from '@/utils/cn'
import { createContext, PropsWithChildren, useState } from 'react'
interface PopoverContextProps {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const PopoverContext = createContext<PopoverContextProps | undefined>(
	undefined
)

export function Popover({
	children,
	className,
}: PropsWithChildren<{ className?: string }>) {
	const [open, setOpen] = useState(false)
	return (
		<PopoverContext.Provider value={{ open, setOpen }}>
			<div className={cn(className, 'relative')}>{children}</div>
		</PopoverContext.Provider>
	)
}
