'use client'

import useThemeStore from '@/store/theme'
import type { Theme } from '@/lib/theme'
import { useEffect } from 'react'

interface ThemeBootstrapProps {
	theme: Theme
}

export function ThemeBootstrap({ theme }: ThemeBootstrapProps) {
	const initializeTheme = useThemeStore(state => state.initializeTheme)

	useEffect(() => {
		initializeTheme(theme)
	}, [initializeTheme, theme])

	return null
}
