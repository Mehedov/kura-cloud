'use client'

import type { IUser } from '@/entities/session/model/session.types'
import { Switch } from '@/shared/ui/switch/Switch'
import { Bell, Mail, UploadCloud, Users } from 'lucide-react'
import Link from 'next/link'
import { SELECT_CLASS } from '../model/settings.constants'
import {
	SectionFooter,
	SettingsRow,
	SettingsSection,
} from './SettingsPrimitives'
import type { SettingsState } from '../model/use-settings-state'

export function UploadSettingsSection({
	state,
	onStub,
}: {
	state: SettingsState
	onStub: (feature: string) => void
}) {
	return (
		<SettingsSection
			id='uploads'
			icon={UploadCloud}
			title='Загрузка файлов'
			description='Каталог назначения и правила обработки новых файлов'
		>
			<div className='divide-y divide-border'>
				<SettingsRow
					title='Папка по умолчанию'
					description='Куда загружать файлы вне открытой папки.'
					soon
				>
					<select
						value={state.uploadTarget}
						onChange={event => state.setUploadTarget(event.target.value)}
						className={SELECT_CLASS}
						aria-label='Папка загрузки по умолчанию'
					>
						<option value='root'>Корень хранилища</option>
						<option value='last'>Последняя папка</option>
						<option value='ask'>Спрашивать каждый раз</option>
					</select>
				</SettingsRow>
				<SettingsRow
					title='Совпадение имён'
					description='Что делать, если файл с таким именем уже существует.'
					soon
				>
					<select
						value={state.duplicateStrategy}
						onChange={event => state.setDuplicateStrategy(event.target.value)}
						className={SELECT_CLASS}
						aria-label='Действие при совпадении имён'
					>
						<option value='rename'>Переименовать копию</option>
						<option value='ask'>Спрашивать</option>
						<option value='replace'>Заменить файл</option>
					</select>
				</SettingsRow>
				<SettingsRow
					title='Запоминать последнюю папку'
					description='Предлагать последний выбранный каталог при новой загрузке.'
					soon
				>
					<Switch
						checked={state.rememberUploadFolder}
						onCheckedChange={state.setRememberUploadFolder}
						aria-label='Запоминать последнюю папку загрузки'
					/>
				</SettingsRow>
				<SettingsRow
					title='Автоматическая организация'
					description='Распределять фото и документы по умным папкам.'
					soon
				>
					<Switch
						checked={state.autoOrganize}
						onCheckedChange={state.setAutoOrganize}
						aria-label='Автоматически организовывать файлы'
					/>
				</SettingsRow>
			</div>
			<SectionFooter onSave={() => onStub('Настройки загрузки')} />
		</SettingsSection>
	)
}

export function SharingSettingsSection({
	state,
	onStub,
}: {
	state: SettingsState
	onStub: (feature: string) => void
}) {
	return (
		<SettingsSection
			id='sharing'
			icon={Users}
			title='Общий доступ'
			description='Разрешения по умолчанию и поведение публичных ссылок'
		>
			<div className='divide-y divide-border'>
				<SettingsRow
					title='Разрешение по умолчанию'
					description='Начальное значение при предоставлении доступа.'
					soon
				>
					<select
						value={state.defaultPermission}
						onChange={event => state.setDefaultPermission(event.target.value)}
						className={SELECT_CLASS}
						aria-label='Разрешение общего доступа по умолчанию'
					>
						<option value='viewer'>Только просмотр</option>
						<option value='editor'>Редактирование</option>
					</select>
				</SettingsRow>
				<SettingsRow
					title='Разрешить повторную передачу'
					description='Пользователи с доступом смогут приглашать других.'
					soon
				>
					<Switch
						checked={state.allowReshare}
						onCheckedChange={state.setAllowReshare}
						aria-label='Разрешить повторную передачу доступа'
					/>
				</SettingsRow>
				<SettingsRow
					title='Срок действия ссылок'
					description='Автоматически отключать публичные ссылки.'
					soon
				>
					<select
						value={state.linkExpiration}
						onChange={event => state.setLinkExpiration(event.target.value)}
						className={SELECT_CLASS}
						aria-label='Срок действия публичных ссылок'
					>
						<option value='never'>Без срока</option>
						<option value='1'>1 день</option>
						<option value='7'>7 дней</option>
						<option value='30'>30 дней</option>
					</select>
				</SettingsRow>
				<SettingsRow
					title='Управление доступами'
					description='Просмотреть входящие и выданные разрешения.'
				>
					<Link
						href='/shared'
						className='inline-flex items-center justify-center rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
					>
						Открыть общие файлы
					</Link>
				</SettingsRow>
			</div>
			<SectionFooter onSave={() => onStub('Настройки общего доступа')} />
		</SettingsSection>
	)
}

const ROWS = [
	[
		'sharedAccess',
		'Изменения общего доступа',
		'Новые приглашения и изменение разрешений.',
	],
	[
		'fileChanges',
		'Изменения файлов',
		'Редактирование и удаление общих файлов.',
	],
	[
		'storageWarnings',
		'Заполнение хранилища',
		'Предупреждать при приближении к лимиту.',
	],
	[
		'weeklyDigest',
		'Еженедельная сводка',
		'Краткая статистика активности раз в неделю.',
	],
] as const

export function NotificationsSettingsSection({
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
			id='notifications'
			icon={Bell}
			title='Уведомления'
			description='Выберите каналы и события, о которых хотите узнавать.'
		>
			<div className='grid gap-4 lg:grid-cols-2'>
				<div className='rounded-xl border border-border p-4'>
					<div className='mb-4 flex items-center gap-3'>
						<Bell size={19} className='text-muted-foreground' />
						<div>
							<h3 className='text-sm font-medium'>В приложении</h3>
							<p className='text-xs text-muted-foreground'>
								Центр уведомлений Kura Drive
							</p>
						</div>
					</div>
					<Switch
						checked={state.notifications.inApp}
						onCheckedChange={checked =>
							state.updateNotification('inApp', checked)
						}
						aria-label='Уведомления в приложении'
					/>
				</div>
				<div className='rounded-xl border border-border p-4'>
					<div className='mb-4 flex items-center gap-3'>
						<Mail size={19} className='text-muted-foreground' />
						<div>
							<h3 className='text-sm font-medium'>По email</h3>
							<p className='text-xs text-muted-foreground'>
								Письма на {user?.email ?? 'ваш адрес'}
							</p>
						</div>
					</div>
					<Switch
						checked={state.notifications.email}
						onCheckedChange={checked =>
							state.updateNotification('email', checked)
						}
						aria-label='Уведомления по электронной почте'
					/>
				</div>
			</div>
			<div className='mt-5 divide-y divide-border border-t border-border pt-1'>
				{ROWS.map(([key, title, description]) => (
					<SettingsRow key={key} title={title} description={description} soon>
						<Switch
							checked={state.notifications[key]}
							onCheckedChange={checked =>
								state.updateNotification(key, checked)
							}
							aria-label={title}
						/>
					</SettingsRow>
				))}
			</div>
			<SectionFooter onSave={() => onStub('Настройки уведомлений')} />
		</SettingsSection>
	)
}
