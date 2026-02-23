import { cn } from '@/utils/cn'
import { LucideIcon } from 'lucide-react'
import { ComponentPropsWithRef, forwardRef } from 'react'

interface Props extends ComponentPropsWithRef<'input'> {
	variant?: 'outline' | 'primary'
	Icon?: LucideIcon
}

const VARIANTS = {
	outline: 'text-neutral-600 text-sm w-full outline-0',
	primary:
		'border border-gray-200 bg-neutral-50 transition hover:bg-neutral-100',
}

const Input = forwardRef<HTMLInputElement, Props>(
	({ className, placeholder, variant = 'outline', Icon }, ref) => {
		return (
			<div
				className={cn(
					'flex items-center gap-1 border border-neutral-200 px-3 py-2 rounded-lg',
					className,
				)}
			>
				{Icon && <Icon className='text-neutral-400' size={20} />}
				<input
					ref={ref}
					type='text'
					className={cn('text-neutral-600 text-md w-full', VARIANTS[variant])}
					placeholder={placeholder}
				/>
			</div>
		)
	},
)

Input.displayName = 'Input'
export default Input
