'use client'

import { saveLanguage } from '@/shared/language/api/save-language'
import { parseLanguage, type Language } from '@/shared/language/lib/language'
import { translations, type Translation } from '@/shared/language/translations'
import { create } from 'zustand'

const isBrowser = () => typeof document !== 'undefined'

interface LanguageState {
	language: Language
	isSaving: boolean
	initializeLanguage: (language: Language) => void
	setLanguage: (language: Language) => Promise<boolean>
	t: Translation
}

const getDocumentLanguage = (): Language => isBrowser() ? parseLanguage(document.documentElement.lang) : 'ru'

const useLanguage = create<LanguageState>((set, get) => ({
	language: getDocumentLanguage(),
	t: translations[getDocumentLanguage()],
	isSaving: false,
	initializeLanguage: language => {
		if (!isBrowser()) return
		document.documentElement.lang = language
		set({ language, t: translations[language] })
	},
	setLanguage: async language => {
		if (!isBrowser() || language === get().language) return true
		const previousLanguage = get().language
		document.documentElement.lang = language
		set({ language, t: translations[language], isSaving: true })
		try {
			await saveLanguage(language)
			return true
		} catch {
			document.documentElement.lang = previousLanguage
			set({ language: previousLanguage, t: translations[previousLanguage] })
			return false
		} finally {
			set({ isSaving: false })
		}
	},
}))

export default useLanguage
