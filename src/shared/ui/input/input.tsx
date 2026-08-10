import { cn } from '@/shared/lib/cn'
import { LucideIcon } from 'lucide-react'
import { ComponentPropsWithRef, forwardRef } from 'react'

interface Props extends ComponentPropsWithRef<'input'> {
	variant?: 'outline' | 'primary'
	Icon?: LucideIcon
	size?: number
}

const VARIANTS = {
	outline: 'text-foreground text-sm',
	primary:
		'border border-border bg-secondary transition-colors hover:bg-accent outline-0',
}

const Input = forwardRef<HTMLInputElement, Props>(
	(
		{ className, placeholder, variant = 'outline', Icon, size, ...props },
		ref,
	) => {
		return (
			<div
				className={cn(
					'w-full flex items-center gap-1 rounded-lg border border-input bg-background px-3 py-2 text-foreground focus-within:ring-2 focus-within:ring-ring',
					className,
				)}
				style={{
					height: size,
				}}
			>
				{Icon && <Icon className='text-muted-foreground' size={20} />}
				<input
					ref={ref}
					type='text'
					className={cn(
						'w-full bg-transparent text-lg text-foreground outline-0 placeholder:text-muted-foreground',
						VARIANTS[variant],
					)}
					placeholder={placeholder}
					{...props}
				/>
			</div>
		)
	},
)

Input.displayName = 'Input'
export default Input
