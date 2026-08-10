'use client'

import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/button/Button'
import { Card } from '@/shared/ui/Card/card'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export function StatusBadge({
	status,
}: {
	status: 'ready' | 'mixed' | 'soon'
}) {
	const label =
		status === 'ready' ? 'Работает' : status === 'mixed' ? 'Частично' : 'Скоро'

	return (
		<span
			className={cn(
				'rounded-full px-2.5 py-1 text-xs font-medium',
				status === 'ready' &&
					'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
				status === 'mixed' &&
					'bg-amber-500/10 text-amber-700 dark:text-amber-300',
				status === 'soon' && 'bg-muted text-muted-foreground',
			)}
		>
			{label}
		</span>
	)
}

export function SoonBadge() {
	return (
		<span className='rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground'>
			Скоро
		</span>
	)
}

export function SettingsSection({
	id,
	icon: Icon,
	title,
	description,
	children,
	status = 'soon',
	danger = false,
}: {
	id: string
	icon: LucideIcon
	title: string
	description: string
	children: ReactNode
	status?: 'ready' | 'mixed' | 'soon'
	danger?: boolean
}) {
	const titleId = `${id}-title`

	return (
		<section id={id} aria-labelledby={titleId} className='scroll-mt-6'>
			<Card className={cn(danger && 'border-destructive/40')}>
				<div className='mb-6 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between'>
					<div className='flex items-start gap-3'>
						<div
							className={cn(
								'flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted',
								danger && 'bg-destructive/10',
							)}
						>
							<Icon
								size={20}
								className={
									danger ? 'text-destructive' : 'text-muted-foreground'
								}
							/>
						</div>
						<div>
							<h2 id={titleId} className='font-semibold text-foreground'>
								{title}
							</h2>
							<p className='mt-1 text-sm text-muted-foreground'>
								{description}
							</p>
						</div>
					</div>
					<StatusBadge status={status} />
				</div>
				{children}
			</Card>
		</section>
	)
}

export function SettingsRow({
	title,
	description,
	children,
	soon = false,
}: {
	title: string
	description: string
	children: ReactNode
	soon?: boolean
}) {
	return (
		<div className='flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between'>
			<div className='min-w-0 sm:pr-6'>
				<div className='flex flex-wrap items-center gap-2'>
					<h3 className='text-sm font-medium text-foreground'>{title}</h3>
					{soon && <SoonBadge />}
				</div>
				<p className='mt-1 text-sm text-muted-foreground'>{description}</p>
			</div>
			<div className='shrink-0'>{children}</div>
		</div>
	)
}

export function SectionFooter({ onSave }: { onSave: () => void }) {
	return (
		<div className='mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between'>
			<p className='text-xs text-muted-foreground'>
				Пока настройка действует только в макете интерфейса.
			</p>
			<Button onClick={onSave} className='w-full px-4 sm:w-auto'>
				Сохранить
			</Button>
		</div>
	)
}
