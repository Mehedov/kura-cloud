export const formatDate = (value?: string) => {
	if (!value) return '—'

	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return '—'

	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	}).format(date)
}
