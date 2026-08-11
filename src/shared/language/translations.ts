import type { Language } from '@/shared/language/lib/language'
import { languageEn } from '@/shared/language/languageEn'
import { languageRu } from '@/shared/language/languageRu'

export const translations = {
	ru: languageRu,
	en: languageEn,
} as const

export type TranslationKey = keyof typeof translations.ru
export type Translation = Record<TranslationKey, string>

export type TranslationParams = Record<string, string | number>

export function translate(
	language: Language,
	key: TranslationKey,
	params?: TranslationParams,
) {
	const value: string = translations[language][key]
	if (!params) return value
	return Object.entries(params).reduce(
		(result, [name, replacement]) =>
			result.replace(`{${name}}`, String(replacement)),
		value,
	)
}
