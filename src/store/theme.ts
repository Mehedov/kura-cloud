'use client'

import { create } from 'zustand'

export type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'kura-theme'
const isBrowser = () => typeof document !== 'undefined'

const applyTheme = (theme: Theme) => {
	document.documentElement.classList.toggle('dark', theme === 'dark')
	document.documentElement.style.colorScheme = theme
	return theme
}

interface ThemeState {
	theme: Theme
	resolvedTheme: 'light' | 'dark'
	isInitialized: boolean
	initializeTheme: () => void
	setTheme: (theme: Theme) => void
}

const useThemeStore = create<ThemeState>((set, get) => ({
	theme: 'light',
	resolvedTheme: 'light',
	isInitialized: false,
	initializeTheme: () => {
		if (get().isInitialized || !isBrowser()) return

		const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
		const theme: Theme =
			storedTheme === 'light' || storedTheme === 'dark'
				? storedTheme
				: 'light'

		set({
			theme,
			resolvedTheme: applyTheme(theme),
			isInitialized: true,
		})
	},
	setTheme: theme => {
		if (!isBrowser()) return
		localStorage.setItem(THEME_STORAGE_KEY, theme)
		set({ theme, resolvedTheme: applyTheme(theme) })
	},
}))

export default useThemeStore
