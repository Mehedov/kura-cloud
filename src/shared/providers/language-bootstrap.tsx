'use client'

import useLanguage from '@/shared/language/model'
import type { Language } from '@/shared/language/lib/language'
import { useEffect } from 'react'

export function LanguageBootstrap({ language }: { language: Language }) {
	const initializeLanguage = useLanguage(state => state.initializeLanguage)

	useEffect(() => {
		initializeLanguage(language)
	}, [initializeLanguage, language])

	return null
}
