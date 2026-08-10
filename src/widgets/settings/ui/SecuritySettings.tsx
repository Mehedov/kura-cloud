'use client'

import { Button } from '@/shared/ui/button/Button'
import { Card } from '@/shared/ui/Card/card'
import ModalContainer from '@/shared/ui/modal/Modal'
import {
	AlertTriangle,
	Database,
	Download,
	FileArchive,
	KeyRound,
	LockKeyhole,
	LogOut,
	Monitor,
	ShieldCheck,
	Smartphone,
	Trash2,
} from 'lucide-react'
import { SettingsRow, SettingsSection, SoonBadge } from './SettingsPrimitives'
import type { ConfirmAction } from '../model/settings.constants'

export function SecuritySettingsSection({
	onStub,
	onLogout,
}: {
	onStub: (feature: string) => void
	onLogout: () => void
}) {
	return (
		<SettingsSection
			id='security'
			icon={ShieldCheck}
			title='Безопасность и сессии'
			description='Пароль, двухфакторная защита и активные устройства.'
			status='mixed'
		>
			<div className='divide-y divide-border'>
				<SettingsRow
					title='Пароль'
					description='Изменение пароля для входа в аккаунт.'
					soon
				>
					<Button
						variant='secondary'
						onClick={() => onStub('Изменение пароля')}
						className='w-full px-4 sm:w-auto'
					>
						<KeyRound size={16} /> Изменить пароль
					</Button>
				</SettingsRow>
				<SettingsRow
					title='Двухфакторная аутентификация'
					description='Дополнительный код при входе в аккаунт.'
					soon
				>
					<Button
						variant='secondary'
						onClick={() => onStub('Двухфакторная аутентификация')}
						className='w-full px-4 sm:w-auto'
					>
						<LockKeyhole size={16} /> Настроить
					</Button>
				</SettingsRow>
			</div>
			<div className='mt-6 border-t border-border pt-5'>
				<div className='mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
					<div>
						<h3 className='font-medium text-foreground'>Активные устройства</h3>
						<p className='mt-1 text-sm text-muted-foreground'>
							Сессии, в которых выполнен вход в Kura Drive.
						</p>
					</div>
					<Button
						variant='ghost'
						onClick={() => onStub('История входов')}
						className='w-full px-3 sm:w-auto'
					>
						История входов <SoonBadge />
					</Button>
				</div>
				<div className='rounded-xl border border-border bg-muted/25 p-4'>
					<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
						<div className='flex items-center gap-3'>
							<div className='flex size-10 items-center justify-center rounded-lg bg-card'>
								<Monitor size={19} />
							</div>
							<div>
								<p className='text-sm font-medium'>Текущий браузер</p>
								<p className='text-xs text-muted-foreground'>
									Текущая сессия · активна сейчас
								</p>
							</div>
						</div>
						<span className='inline-flex w-fit rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300'>
							Это устройство
						</span>
					</div>
					<div className='mt-3 flex items-center gap-2 text-xs text-muted-foreground'>
						<Smartphone size={14} /> Остальные устройства появятся после
						подключения управления сессиями.
					</div>
				</div>
				<div className='mt-4 flex flex-col gap-2 sm:flex-row'>
					<Button
						variant='secondary'
						onClick={() => onStub('Выход на всех устройствах')}
						className='w-full sm:w-auto'
					>
						Выйти везде <SoonBadge />
					</Button>
					<Button
						variant='outline'
						onClick={onLogout}
						className='w-full sm:w-auto'
					>
						<LogOut size={16} /> Выйти на этом устройстве
					</Button>
				</div>
			</div>
		</SettingsSection>
	)
}

export function DataSettingsSection({
	onStub,
	onDeleteAccount,
}: {
	onStub: (feature: string) => void
	onDeleteAccount: () => void
}) {
	return (
		<SettingsSection
			id='data'
			icon={Database}
			title='Данные и приватность'
			description='Экспорт данных, архив аккаунта и необратимые действия.'
			danger
		>
			<div className='grid gap-4 md:grid-cols-2'>
				<ActionCard
					icon={Download}
					title='Экспорт данных'
					description='Скачать метаданные профиля, папок и общих доступов.'
					action='Запросить экспорт'
					onClick={() => onStub('Экспорт данных')}
				/>
				<ActionCard
					icon={FileArchive}
					title='Архив файлов'
					description='Подготовить единый архив содержимого хранилища.'
					action='Создать архив'
					onClick={() => onStub('Архив файлов')}
				/>
			</div>
			<div className='mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4'>
				<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
					<div>
						<div className='flex items-center gap-2'>
							<AlertTriangle size={18} className='text-destructive' />
							<h3 className='font-medium text-foreground'>Удалить аккаунт</h3>
							<SoonBadge />
						</div>
						<p className='mt-1 max-w-xl text-sm text-muted-foreground'>
							Профиль, файлы и выданные доступы будут удалены без возможности
							восстановления.
						</p>
					</div>
					<Button
						variant='destructive'
						onClick={onDeleteAccount}
						className='w-full shrink-0 sm:w-auto'
					>
						<Trash2 size={16} /> Удалить аккаунт
					</Button>
				</div>
			</div>
		</SettingsSection>
	)
}

function ActionCard({
	icon: Icon,
	title,
	description,
	action,
	onClick,
}: {
	icon: typeof Download
	title: string
	description: string
	action: string
	onClick: () => void
}) {
	return (
		<div className='rounded-xl border border-border p-4'>
			<div className='flex size-10 items-center justify-center rounded-lg bg-muted'>
				<Icon size={19} />
			</div>
			<h3 className='mt-4 font-medium text-foreground'>{title}</h3>
			<p className='mt-1 text-sm text-muted-foreground'>{description}</p>
			<Button
				variant='secondary'
				onClick={onClick}
				className='mt-4 w-full px-4'
			>
				<Icon size={16} /> {action} <SoonBadge />
			</Button>
		</div>
	)
}

export function SettingsConfirmModal({
	action,
	copy,
	isPending,
	onClose,
	onConfirm,
}: {
	action: Exclude<ConfirmAction, null>
	copy: Record<
		Exclude<ConfirmAction, null>,
		{ title: string; description: string; confirmLabel: string }
	>
	isPending: boolean
	onClose: () => void
	onConfirm: () => void
}) {
	return (
		<ModalContainer isOpen onClose={onClose} ariaLabel={copy[action].title}>
			<Card className='w-[min(calc(100vw-2rem),30rem)]'>
				<div className='flex items-start gap-3'>
					<div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10'>
						<AlertTriangle size={20} className='text-destructive' />
					</div>
					<div>
						<h2 className='text-lg font-semibold text-foreground'>
							{copy[action].title}
						</h2>
						<p className='mt-2 text-sm text-muted-foreground'>
							{copy[action].description}
						</p>
					</div>
				</div>
				<div className='mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
					<Button variant='secondary' onClick={onClose} disabled={isPending}>
						Отмена
					</Button>
					<Button
						variant='destructive'
						onClick={onConfirm}
						disabled={isPending}
					>
						{isPending && action === 'logout'
							? 'Выходим…'
							: copy[action].confirmLabel}
					</Button>
				</div>
			</Card>
		</ModalContainer>
	)
}
