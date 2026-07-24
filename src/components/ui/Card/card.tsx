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
				'rounded-lg border border-border bg-card p-5 text-card-foreground',
			)}
			{...props}
		></div>
	)
})

Card.displayName = 'Card'
