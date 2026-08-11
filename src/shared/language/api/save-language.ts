'use server'

import { cookies } from 'next/headers'
import { isLanguage, LANGUAGE_COOKIE, type Language } from '@/shared/language/lib/language'

export async function saveLanguage(language: Language): Promise<void> {
	if (!isLanguage(language)) throw new Error('Invalid language')

	const cookieStore = await cookies()
	cookieStore.set(LANGUAGE_COOKIE, language, {
		path: '/',
		maxAge: 60 * 60 * 24 * 365,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
	})
}
