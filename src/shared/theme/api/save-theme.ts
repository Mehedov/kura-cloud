'use server'

import { cookies } from 'next/headers'
import { isTheme, THEME_COOKIE, type Theme } from '@/shared/theme/lib/theme'

export async function saveTheme(theme: Theme): Promise<void> {
	if (!isTheme(theme)) throw new Error('Invalid theme')

	const cookieStore = await cookies()
	cookieStore.set(THEME_COOKIE, theme, {
		path: '/',
		maxAge: 60 * 60 * 24 * 365,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
	})
}
