import { cn } from '@/utils/cn'
import { AlertCircle, FolderOpen, LoaderCircle, RefreshCw } from 'lucide-react'
import { ReactNode } from 'react'

interface StateProps {
	title: string
	description?: string
	className?: string
	children?: ReactNode
}

function StateContainer({
	title,
	description,
	className,
	children,
}: StateProps) {
	return (
		<div
			className={cn(
				'flex min-h-40 w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-6 text-center',
				className,
			)}
		>
			{children}
			<p className='mt-3 font-medium text-foreground'>{title}</p>
			{description && (
				<p className='mt-1 max-w-sm text-sm text-muted-foreground'>
					{description}
				</p>
			)}
		</div>
	)
}

export function LoadingState({
	title = 'Загрузка...',
	description,
	className,
}: Omit<StateProps, 'children'>) {
	return (
		<StateContainer title={title} description={description} className={className}>
			<LoaderCircle className='animate-spin text-muted-foreground' size={28} />
		</StateContainer>
	)
}

export function EmptyState({
	title,
	description,
	className,
}: Omit<StateProps, 'children'>) {
	return (
		<StateContainer title={title} description={description} className={className}>
			<FolderOpen className='text-muted-foreground' size={32} />
		</StateContainer>
	)
}


interface ErrorStateProps {
	title?: string
	description?: string
	className?: string
	onRetry?: () => void
}

export function ErrorState({
	title = 'Не удалось загрузить данные',
	description = 'Проверьте подключение к интернету и попробуйте ещё раз.',
	className,
	onRetry,
}: ErrorStateProps) {
	return (
		<StateContainer title={title} description={description} className={className}>
			<AlertCircle className='text-destructive' size={32} />
			{onRetry && (
				<button
					type='button'
					onClick={onRetry}
					className='mt-4 inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent'
				>
					<RefreshCw size={16} /> Повторить
				</button>
			)}
		</StateContainer>
	)
}
