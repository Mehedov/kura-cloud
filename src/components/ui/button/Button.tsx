import { cn } from '@/utils/cn'
import { ComponentPropsWithRef, forwardRef } from 'react'

interface Props extends ComponentPropsWithRef<'button'> {
	variant?: 'outline' | 'primary' | 'ghost' | 'secondary'
}

const VARIANTS = {
	outline: 'border border-neutral-200 hover:bg-neutral-100 text-neutral-700',
	primary: 'bg-neutral-700 transition hover:bg-neutral-600',
	ghost: 'bg-transparent text-neutral-700',
	secondary:
		'bg-neutral-50 text-neutral-700 border border-neutral-200 hover:bg-neutral-100',
}

export const Button = forwardRef<HTMLButtonElement, Props>(
	({ className, variant = 'primary', children, ...props }, ref) => {
		return (
			<button
				ref={ref}
				className={cn(
					'duration-200 ease-in-out cursor-pointer flex items-center justify-center gap-2 px-5 py-2 text-md font-medium rounded-lg text-white',
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
