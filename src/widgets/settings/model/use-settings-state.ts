'use client'

import type { IUser } from '@/entities/session/model/session.types'
import { useState } from 'react'
import type { AvatarColor } from './settings.constants'

export function useSettingsState(user: IUser | null) {
	const [profileName, setProfileName] = useState(user?.name ?? '')
	const [avatarColor, setAvatarColor] = useState<AvatarColor>(
		user?.avatarColor ?? 'amber',
	)
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
	const [density, setDensity] = useState('comfortable')
	const [rememberSidebar, setRememberSidebar] = useState(true)
	const [reducedMotion, setReducedMotion] = useState(false)
	const [locale, setLocale] = useState('ru')
	const [dateFormat, setDateFormat] = useState('dd.mm.yyyy')
	const [uploadTarget, setUploadTarget] = useState('root')
	const [duplicateStrategy, setDuplicateStrategy] = useState('rename')
	const [rememberUploadFolder, setRememberUploadFolder] = useState(true)
	const [autoOrganize, setAutoOrganize] = useState(false)
	const [defaultPermission, setDefaultPermission] = useState('viewer')
	const [allowReshare, setAllowReshare] = useState(false)
	const [linkExpiration, setLinkExpiration] = useState('never')
	const [notifications, setNotifications] = useState({
		inApp: true,
		email: false,
		sharedAccess: true,
		fileChanges: true,
		storageWarnings: true,
		weeklyDigest: false,
	})
	const [trashRetention, setTrashRetention] = useState('30')

	const updateNotification = (
		key: keyof typeof notifications,
		checked: boolean,
	) => setNotifications(current => ({ ...current, [key]: checked }))

	return {
		profileName,
		setProfileName,
		avatarColor,
		setAvatarColor,
		viewMode,
		setViewMode,
		density,
		setDensity,
		rememberSidebar,
		setRememberSidebar,
		reducedMotion,
		setReducedMotion,
		locale,
		setLocale,
		dateFormat,
		setDateFormat,
		uploadTarget,
		setUploadTarget,
		duplicateStrategy,
		setDuplicateStrategy,
		rememberUploadFolder,
		setRememberUploadFolder,
		autoOrganize,
		setAutoOrganize,
		defaultPermission,
		setDefaultPermission,
		allowReshare,
		setAllowReshare,
		linkExpiration,
		setLinkExpiration,
		notifications,
		updateNotification,
		trashRetention,
		setTrashRetention,
	}
}

export type SettingsState = ReturnType<typeof useSettingsState>
