'use client'

import { getStorageStats } from '@/entities/storage/api/storage.queries'
import useAuthStore from '@/entities/session/model/session.store'
import { logout } from '@/features/profile-logout/api/logout.api'
import { FOLDER_KEYS } from '@/shared/config/query-keys'
import { useToastStore } from '@/shared/ui/toast/model/toast.store'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { SettingsNavigation } from './SettingsNavigation'
import {
	AppearanceSettingsSection,
	InterfaceSettingsSection,
	ProfileSettingsSection,
} from './AccountSettings'
import {
	NotificationsSettingsSection,
	SharingSettingsSection,
	UploadSettingsSection,
} from './CollaborationSettings'
import {
	DataSettingsSection,
	SecuritySettingsSection,
	SettingsConfirmModal,
} from './SecuritySettings'
import { StorageSettingsSection } from './StorageSettings'
import type { ConfirmAction } from '../model/settings.constants'
import { useSettingsState } from '../model/use-settings-state'

const CONFIRM_COPY = {
	logout: {
		title: 'Выйти из аккаунта?',
		description:
			'Текущая сессия будет завершена. Несохранённые изменения макета сбросятся.',
		confirmLabel: 'Выйти',
	},
	'empty-trash': {
		title: 'Очистить корзину?',
		description:
			'Все объекты из корзины будут удалены без возможности восстановления.',
		confirmLabel: 'Очистить корзину',
	},
	'delete-account': {
		title: 'Удалить аккаунт?',
		description:
			'Профиль, файлы и доступы будут удалены без возможности восстановления.',
		confirmLabel: 'Удалить аккаунт',
	},
} as const

export default function SettingsPage() {
	const user = useAuthStore(state => state.user)
	const setIsAuth = useAuthStore(state => state.setIsAuth)
	const showToast = useToastStore(state => state.show)
	const queryClient = useQueryClient()
	const state = useSettingsState(user)
	const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)

	const storageQuery = useQuery({
		queryKey: FOLDER_KEYS.storageStats,
		queryFn: getStorageStats,
	})
	const logoutMutation = useMutation({
		mutationFn: logout,
		onSuccess: async () => {
			setConfirmAction(null)
			setIsAuth(false)
			await queryClient.cancelQueries()
			queryClient.clear()
		},
		onError: () => showToast('Не удалось выйти из аккаунта', 'error'),
	})

	const showStub = (feature: string) =>
		showToast(
			`${feature}: интерфейс готов, подключение данных будет добавлено позже.`,
		)
	const handleConfirm = () => {
		if (confirmAction === 'logout') {
			logoutMutation.mutate()
			return
		}
		if (confirmAction === 'empty-trash') showStub('Очистка корзины')
		if (confirmAction === 'delete-account') showStub('Удаление аккаунта')
		setConfirmAction(null)
	}

	return (
		<section className='w-full max-w-7xl pb-10'>
			<div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
				<h1 className='text-3xl font-semibold text-foreground'>Настройки</h1>

				<div className='flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs text-muted-foreground'>
					<CheckCircle2 size={15} className='text-emerald-600' /> Настройки
					аккаунта
				</div>
			</div>

			<div className='grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_15rem]'>
				<SettingsNavigation />
				<div className='order-last min-w-0 space-y-6 lg:order-first lg:col-start-1'>
					<ProfileSettingsSection user={user} state={state} onStub={showStub} />
					<AppearanceSettingsSection state={state} onStub={showStub} />
					<InterfaceSettingsSection state={state} onStub={showStub} />
					<StorageSettingsSection
						state={state}
						data={storageQuery.data}
						isPending={storageQuery.isPending}
						isError={storageQuery.isError}
						onRetry={() => void storageQuery.refetch()}
						onConfirm={action => setConfirmAction(action)}
						onStub={showStub}
					/>
					<UploadSettingsSection state={state} onStub={showStub} />
					<SharingSettingsSection state={state} onStub={showStub} />
					<NotificationsSettingsSection
						user={user}
						state={state}
						onStub={showStub}
					/>
					<SecuritySettingsSection
						onStub={showStub}
						onLogout={() => setConfirmAction('logout')}
					/>
					<DataSettingsSection
						onStub={showStub}
						onDeleteAccount={() => setConfirmAction('delete-account')}
					/>
				</div>
			</div>

			{confirmAction && (
				<SettingsConfirmModal
					action={confirmAction}
					copy={CONFIRM_COPY}
					isPending={logoutMutation.isPending}
					onClose={() => setConfirmAction(null)}
					onConfirm={handleConfirm}
				/>
			)}
		</section>
	)
}
