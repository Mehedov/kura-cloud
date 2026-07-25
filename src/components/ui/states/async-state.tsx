import { cn } from '@/utils/cn'
import {
	AlertCircle,
	FolderOpen,
	LoaderCircle,
	RefreshCw,
} from 'lucide-react'
import Link from 'next/link'
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
		<StateContainer
			title={title}
			description={description}
			className={className}
		>
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
		<StateContainer
			title={title}
			description={description}
			className={className}
		>
			<FolderOpen className='text-muted-foreground' size={32} />
		</StateContainer>
	)
}

interface NoResultsStateProps {
	title?: string
	description?: string
	className?: string
}

export function NoResultsState({
	title = 'Ничего не найдено',
	description = 'Измените запрос или сбросьте фильтры.',
	className,
}: NoResultsStateProps) {
	return (
		<StateContainer
			title={title}
			description={description}
			className={className}
		/>
	)
}

interface ResourceNotFoundStateProps extends Omit<StateProps, 'children'> {
	backHref?: string
	backLabel?: string
}

export function ResourceNotFoundState({
	title = 'Ресурс не найден',
	description = 'Возможно, он был удалён или у вас больше нет к нему доступа.',
	className,
	backHref = '/folders',
	backLabel = 'Вернуться к папкам',
}: ResourceNotFoundStateProps) {
	return (
		<StateContainer
			title={title}
			description={description}
			className={className}
		>
			<FolderOpen className='text-muted-foreground' size={32} />
			<Link
				href={backHref}
				className='mt-4 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent'
			>
				{backLabel}
			</Link>
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
		<StateContainer
			title={title}
			description={description}
			className={className}
		>
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
