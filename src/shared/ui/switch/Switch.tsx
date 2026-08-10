import { cn } from '@/shared/lib/cn'
import { forwardRef, type ComponentPropsWithRef } from 'react'

export interface SwitchProps extends Omit<
	ComponentPropsWithRef<'button'>,
	'onClick'
> {
	checked: boolean
	onCheckedChange: (checked: boolean) => void
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
	(
		{ checked, onCheckedChange, disabled, className, children, ...props },
		ref,
	) => {
		const handleClick = () => {
			if (!disabled) onCheckedChange(!checked)
		}

		return (
			<button
				ref={ref}
				{...props}
				type='button'
				role='switch'
				aria-checked={checked}
				disabled={disabled}
				onClick={handleClick}
				className={cn(
					'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
					checked ? 'bg-primary' : 'bg-muted',
					className,
				)}
			>
				<span
					aria-hidden='true'
					className={cn(
						'pointer-events-none block size-5 rounded-full bg-background shadow-sm ring-0 transition-transform',
						checked ? 'translate-x-5' : 'translate-x-0.5',
					)}
				/>
				{children}
			</button>
		)
	},
)

Switch.displayName = 'Switch'
