'use client'

import type { IUser } from '@/entities/session/model/session.types'
import { ThemeToggle } from '@/shared/theme/ui/ThemeToggle'
import { Avatar } from '@/shared/ui/avatar/Avatar'
import { Button } from '@/shared/ui/button/Button'
import Input from '@/shared/ui/input/input'
import { Switch } from '@/shared/ui/switch/Switch'
import {
	Camera,
	CheckCircle2,
	Grid2x2,
	LayoutList,
	Monitor,
	Palette,
	Save,
	UserRound,
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import {
	AVATAR_COLORS,
	SELECT_CLASS,
	type AvatarColor,
} from '../model/settings.constants'
import {
	SectionFooter,
	SettingsRow,
	SettingsSection,
	SoonBadge,
} from './SettingsPrimitives'
import type { SettingsState } from '../model/use-settings-state'

export function ProfileSettingsSection({
	user,
	state,
	onStub,
}: {
	user: IUser | null
	state: SettingsState
	onStub: (feature: string) => void
}) {
	return (
		<SettingsSection
			id='profile'
			icon={UserRound}
			title='Профиль и аккаунт'
			description='Основная информация, аватар и адрес электронной почты.'
			status='mixed'
		>
			<div className='grid gap-6 xl:grid-cols-[13rem_minmax(0,1fr)]'>
				<div className='flex flex-col items-center rounded-xl border border-border bg-muted/30 p-5 text-center'>
					<div className='relative'>
						<Avatar
							name={state.profileName || user?.name}
							avatarUrl={user?.avatarUrl}
							avatarColor={state.avatarColor}
							id={user?.id}
							className='size-24 border-4 border-card text-2xl shadow-sm'
						/>
						<button
							type='button'
							onClick={() => onStub('Загрузка аватара')}
							aria-label='Изменить фотографию профиля'
							className='absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						>
							<Camera size={15} />
						</button>
					</div>
					<p className='mt-3 max-w-full truncate font-medium text-foreground'>
						{state.profileName || user?.name || 'Пользователь'}
					</p>
					<p className='max-w-full truncate text-sm text-muted-foreground'>
						{user?.email ?? '—'}
					</p>
					<div
						className='mt-4 flex flex-wrap justify-center gap-2'
						role='group'
						aria-label='Цвет аватара'
					>
						{AVATAR_COLORS.map(color => (
							<button
								key={color.value}
								type='button'
								aria-label={color.label}
								aria-pressed={state.avatarColor === color.value}
								onClick={() => state.setAvatarColor(color.value as AvatarColor)}
								className={cn(
									'size-6 rounded-full border-2 border-card ring-offset-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
									color.className,
									state.avatarColor === color.value &&
										'ring-2 ring-foreground/60',
								)}
							/>
						))}
					</div>
				</div>
				<div className='space-y-5'>
					<label className='block space-y-2 text-sm font-medium text-foreground'>
						Имя
						<Input
							value={state.profileName}
							onChange={event => state.setProfileName(event.target.value)}
							placeholder='Ваше имя'
						/>
					</label>
					<label className='block space-y-2 text-sm font-medium text-foreground'>
						Электронная почта
						<Input value={user?.email ?? ''} readOnly aria-readonly='true' />
					</label>
					<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
						<span className='inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300'>
							<CheckCircle2 size={14} /> Email подтверждён
						</span>
						<Button
							variant='secondary'
							onClick={() => onStub('Смена email')}
							className='w-full px-4 sm:w-auto'
						>
							Изменить email <SoonBadge />
						</Button>
					</div>
					<Button
						onClick={() => onStub('Сохранение профиля')}
						className='w-full sm:w-auto'
					>
						<Save size={16} /> Сохранить профиль
					</Button>
				</div>
			</div>
		</SettingsSection>
	)
}

export function AppearanceSettingsSection({
	state,
	onStub,
}: {
	state: SettingsState
	onStub: (feature: string) => void
}) {
	return (
		<SettingsSection
			id='appearance'
			icon={Palette}
			title='Внешний вид и язык'
			description='Цветовая схема, системная тема и региональные параметры.'
			status='mixed'
		>
			<div className='divide-y divide-border'>
				<SettingsRow
					title='Тема'
					description='Светлая или тёмная цветовая схема приложения'
				>
					<ThemeToggle />
				</SettingsRow>
				<SettingsRow
					title='Системная тема'
					description='Автоматически следовать настройкам устройства.'
					soon
				>
					<Switch
						checked={false}
						onCheckedChange={() => undefined}
						disabled
						aria-label='Использовать системную тему'
					/>
				</SettingsRow>
				<SettingsRow
					title='Язык интерфейса'
					description='Язык меню, кнопок и системных сообщений.'
					soon
				>
					<select
						value={state.locale}
						onChange={event => state.setLocale(event.target.value)}
						className={SELECT_CLASS}
						aria-label='Язык интерфейса'
					>
						<option value='ru'>Русский</option>
						<option value='en'>English</option>
					</select>
				</SettingsRow>
				<SettingsRow
					title='Формат даты'
					description='Как даты будут отображаться в списках файлов.'
					soon
				>
					<select
						value={state.dateFormat}
						onChange={event => state.setDateFormat(event.target.value)}
						className={SELECT_CLASS}
						aria-label='Формат даты'
					>
						<option value='dd.mm.yyyy'>ДД.ММ.ГГГГ</option>
						<option value='mm.dd.yyyy'>ММ.ДД.ГГГГ</option>
						<option value='yyyy-mm-dd'>ГГГГ-ММ-ДД</option>
					</select>
				</SettingsRow>
			</div>
			<SectionFooter onSave={() => onStub('Язык и регион')} />
		</SettingsSection>
	)
}

export function InterfaceSettingsSection({
	state,
	onStub,
}: {
	state: SettingsState
	onStub: (feature: string) => void
}) {
	return (
		<SettingsSection
			id='interface'
			icon={Monitor}
			title='Поведение интерфейса'
			description='Вид файлов, плотность элементов и анимации.'
		>
			<div className='divide-y divide-border'>
				<SettingsRow
					title='Вид файлов по умолчанию'
					description='Можно будет переопределить на любой странице.'
					soon
				>
					<div
						className='flex rounded-lg border border-border bg-card p-1'
						role='group'
						aria-label='Вид файлов по умолчанию'
					>
						{(
							[
								['grid', 'Сетка', Grid2x2],
								['list', 'Список', LayoutList],
							] as const
						).map(([value, label, Icon]) => (
							<button
								key={value}
								type='button'
								aria-pressed={state.viewMode === value}
								onClick={() => state.setViewMode(value)}
								className={cn(
									'flex items-center gap-2 rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
									state.viewMode === value
										? 'bg-primary text-primary-foreground'
										: 'text-muted-foreground hover:bg-muted',
								)}
							>
								<Icon size={16} /> {label}
							</button>
						))}
					</div>
				</SettingsRow>
				<SettingsRow
					title='Плотность элементов'
					description='Расстояние между строками, карточками и элементами меню.'
					soon
				>
					<select
						value={state.density}
						onChange={event => state.setDensity(event.target.value)}
						className={SELECT_CLASS}
						aria-label='Плотность интерфейса'
					>
						<option value='compact'>Компактная</option>
						<option value='comfortable'>Комфортная</option>
						<option value='spacious'>Просторная</option>
					</select>
				</SettingsRow>
				<SettingsRow
					title='Запоминать боковую панель'
					description='Сохранять свёрнутое или развёрнутое состояние.'
					soon
				>
					<Switch
						checked={state.rememberSidebar}
						onCheckedChange={state.setRememberSidebar}
						aria-label='Запоминать состояние боковой панели'
					/>
				</SettingsRow>
				<SettingsRow
					title='Уменьшить анимацию'
					description='Сократить движение и декоративные переходы.'
					soon
				>
					<Switch
						checked={state.reducedMotion}
						onCheckedChange={state.setReducedMotion}
						aria-label='Уменьшить анимацию'
					/>
				</SettingsRow>
			</div>
			<SectionFooter onSave={() => onStub('Настройки интерфейса')} />
		</SettingsSection>
	)
}
