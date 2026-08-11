import type { Language } from '@/shared/language/lib/language'

export const formatDate = (value?: string, language: Language = 'ru') => {
	if (!value) return '—'

	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return '—'

	return new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-US', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	}).format(date)
}
