export const LANGUAGE_COOKIE = 'kura-language'

export const LANGUAGES = ['ru', 'en'] as const

export type Language = (typeof LANGUAGES)[number]

export const isLanguage = (value: unknown): value is Language =>
	LANGUAGES.includes(value as Language)

export const parseLanguage = (value?: string): Language =>
	isLanguage(value) ? value : 'ru'
