'use client'

import useThemeStore from '@/store/theme'
import { useEffect } from 'react'

export function ThemeBootstrap() {
	const initializeTheme = useThemeStore(state => state.initializeTheme)

	useEffect(() => {
		initializeTheme()
	}, [initializeTheme])

	return null
}
