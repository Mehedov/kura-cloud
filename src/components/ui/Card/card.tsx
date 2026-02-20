import { cn } from '@/utils/cn'
import { forwardRef } from 'react'

export const Card = forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	return (
		<div
			ref={ref}
			className={cn(
				className,
				'p-5 bg-neutral-50 rounded-lg border border-gray-200',
			)}
			{...props}
		></div>
	)
})

Card.displayName = 'Card'
