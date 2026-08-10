export const THEME_COOKIE = 'kura-theme'

export type Theme = 'light' | 'dark'

export function parseTheme(value: string | undefined): Theme {
	return value === 'dark' ? 'dark' : 'light'
}

export function isTheme(value: unknown): value is Theme {
	return value === 'light' || value === 'dark'
}
