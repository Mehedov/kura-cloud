'use client'

import type { IStorageStats } from '@/entities/storage/model/storage.types'
import { Button } from '@/shared/ui/button/Button'
import { HardDrive, RefreshCw, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { SELECT_CLASS } from '../model/settings.constants'
import { SettingsRow, SettingsSection, SoonBadge } from './SettingsPrimitives'
import type { SettingsState } from '../model/use-settings-state'
import type { ConfirmAction } from '../model/settings.constants'
import { StorageOverviewTiles } from './StorageOverviewTiles'
import { StorageActivityHeatmap } from './StorageActivityHeatmap'

export function StorageSettingsSection({
	state,
	data,
	isPending,
	isError,
	onRetry,
	onConfirm,
	onStub,
}: {
	state: SettingsState
	data: IStorageStats | undefined
	isPending: boolean
	isError: boolean
	onRetry: () => void
	onConfirm: (action: Exclude<ConfirmAction, 'logout' | null>) => void
	onStub: (feature: string) => void
}) {
	return (
		<SettingsSection
			id='storage'
			icon={HardDrive}
			title='Хранилище и корзина'
			description='Использование места, тариф и политика удаления файлов.'
			status='mixed'
		>
			{isPending ? (
				<div className='space-y-4' aria-label='Загрузка статистики хранилища'>
					<div className='h-24 animate-pulse rounded-xl bg-muted' />
					<div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-5'>
						{Array.from({ length: 5 }, (_, index) => (
							<div
								key={index}
								className='h-16 animate-pulse rounded-lg bg-muted'
							/>
						))}
					</div>
				</div>
			) : isError ? (
				<div className='flex flex-col gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between'>
					<div>
						<p className='font-medium text-foreground'>
							Не удалось загрузить статистику
						</p>
						<p className='mt-1 text-sm text-muted-foreground'>
							Проверьте подключение и попробуйте ещё раз.
						</p>
					</div>
					<Button
						variant='secondary'
						onClick={onRetry}
						className='w-full sm:w-auto'
					>
						<RefreshCw size={16} /> Повторить
					</Button>
				</div>
			) : data ? (
				<div className='space-y-5'>
					<StorageActivityHeatmap />
					<StorageOverviewTiles data={data} />
				</div>
			) : null}

			<div className='mt-6 divide-y divide-border border-t border-border pt-5'>
				<SettingsRow
					title='Тариф хранилища'
					description='Увеличение лимита и управление подпиской.'
					soon
				>
					<Button
						variant='secondary'
						onClick={() => onStub('Управление тарифом')}
						className='w-full px-4 sm:w-auto'
					>
						Расширить хранилище
					</Button>
				</SettingsRow>
				<SettingsRow
					title='Автоочистка корзины'
					description='Удалять файлы после выбранного срока.'
					soon
				>
					<select
						value={state.trashRetention}
						onChange={event => state.setTrashRetention(event.target.value)}
						className={SELECT_CLASS}
						aria-label='Срок хранения файлов в корзине'
					>
						<option value='never'>Никогда</option>
						<option value='7'>Через 7 дней</option>
						<option value='30'>Через 30 дней</option>
						<option value='90'>Через 90 дней</option>
					</select>
				</SettingsRow>
				<SettingsRow
					title='Корзина'
					description='Просмотрите удалённые объекты или очистите их.'
				>
					<div className='flex flex-col gap-2 sm:flex-row'>
						<Link
							href='/basket'
							className='inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						>
							Открыть корзину
						</Link>
						<Button
							variant='ghost'
							onClick={() => onConfirm('empty-trash')}
							className='px-4 text-destructive hover:text-destructive'
						>
							<Trash2 size={16} /> Очистить <SoonBadge />
						</Button>
					</div>
				</SettingsRow>
			</div>
		</SettingsSection>
	)
}
