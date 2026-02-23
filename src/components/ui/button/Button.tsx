import { cn } from '@/utils/cn'
import { ComponentPropsWithRef, forwardRef } from 'react'

interface Props extends ComponentPropsWithRef<'button'> {
	variant?: 'outline' | 'primary'
}

const VARIANTS = {
	outline: 'bg-transparent border-2 border-neutral-200',
	primary:
		'border border-gray-200 bg-neutral-50 transition hover:bg-neutral-100',
}

export const Button = forwardRef<HTMLButtonElement, Props>(
	({ className, variant = 'primary', children, ...props }, ref) => {
		return (
			<button
				ref={ref}
				className={cn(
					'cursor-pointer flex items-center justify-center gap-2 px-5 py-2 text-md font-medium text-neutral-700 rounded-lg',
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
