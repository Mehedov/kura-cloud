import { cn } from '@/utils/cn'

interface Props {
	className?: string
	variant?: 'outline' | 'primary'
	children?: React.ReactNode
}

const VARIANT = {
	outline: 'bg-transparent border-2 border-neutral-200',
	primary:
		'border border-gray-200 bg-neutral-50 transition hover:bg-neutral-100',
}

export function Button({ className, variant, children }: Props) {
	return (
		<button
			className={cn(
				'cursor-pointer flex items-center justify-center gap-2 px-5 py-2 text-md font-medium text-neutral-700 rounded-lg',
				className,
				variant === 'outline' && VARIANT.outline,
				variant === 'primary' && VARIANT.primary
			)}
		>
			{children}
		</button>
	)
}
