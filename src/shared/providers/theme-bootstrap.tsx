'use client'

import useThemeStore from '@/shared/theme/model'
import type { Theme } from '@/shared/theme/lib/theme'
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
