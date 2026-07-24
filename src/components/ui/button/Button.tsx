import { cn } from '@/utils/cn'
import { ComponentPropsWithRef, forwardRef } from 'react'

interface Props extends ComponentPropsWithRef<'button'> {
	variant?: 'outline' | 'primary' | 'ghost' | 'secondary'
}

const VARIANTS = {
	outline:
		'border border-border bg-card text-card-foreground hover:bg-muted',
	primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
	ghost: 'bg-transparent text-foreground hover:bg-muted',
	secondary:
		'border border-border bg-secondary text-secondary-foreground hover:bg-accent',
}

export const Button = forwardRef<HTMLButtonElement, Props>(
	({ className, variant = 'primary', children, ...props }, ref) => {
		return (
			<button
				ref={ref}
				className={cn(
					'duration-200 ease-in-out cursor-pointer flex items-center justify-center gap-2 rounded-lg px-5 py-2 text-md font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
					className,
					VARIANTS[variant],
				)}
				{...props}
			>
				{children}
			</button>
		)
	},
)

Button.displayName = 'Button'
