'use client'

import { saveTheme } from '@/shared/theme/api/save-theme'
import { parseTheme, type Theme } from '@/shared/theme/lib/theme'
import { create } from 'zustand'

const isBrowser = () => typeof document !== 'undefined'

const applyTheme = (theme: Theme) => {
	const root = document.documentElement
	root.classList.add('theme-changing')
	root.dataset.theme = theme
	root.style.colorScheme = theme

	requestAnimationFrame(() => {
		requestAnimationFrame(() => root.classList.remove('theme-changing'))
	})
}

const getDocumentTheme = (): Theme =>
	isBrowser() ? parseTheme(document.documentElement.dataset.theme) : 'light'

interface ThemeState {
	theme: Theme
	isSaving: boolean
	initializeTheme: (theme: Theme) => void
	setTheme: (theme: Theme) => Promise<boolean>
}

const useThemeStore = create<ThemeState>((set, get) => ({
	theme: getDocumentTheme(),
	isSaving: false,
	initializeTheme: theme => {
		if (!isBrowser()) return
		applyTheme(theme)
		set({ theme })
	},
	setTheme: async theme => {
		if (!isBrowser() || theme === get().theme) return true

		const previousTheme = get().theme
		applyTheme(theme)
		set({ theme, isSaving: true })

		try {
			await saveTheme(theme)
			return true
		} catch {
			applyTheme(previousTheme)
			set({ theme: previousTheme })
			return false
		} finally {
			set({ isSaving: false })
		}
	},
}))

export default useThemeStore
