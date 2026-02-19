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
}

export const PopoverContext = createContext<PopoverContextProps | undefined>(
	undefined,
)

export function Popover({
	children,
	className,
}: PropsWithChildren<{ className?: string }>) {
	const [open, setOpen] = useState(false)
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
		<PopoverContext.Provider value={{ open, setOpen }}>
			<div ref={containerRef} className={cn(className, 'relative')}>
				{children}
			</div>
		</PopoverContext.Provider>
	)
}
