export const formatBytes = (value: string | number, fractionDigits = 1) => {
	const bytes = Number(value)

	if (!Number.isFinite(bytes) || bytes <= 0) {
		return '0 B'
	}

	const units = ['B', 'KB', 'MB', 'GB', 'TB']
	const unitIndex = Math.min(
		Math.floor(Math.log(bytes) / Math.log(1024)),
		units.length - 1,
	)

	const formatted = bytes / 1024 ** unitIndex
	const rounded = Number(
		formatted.toFixed(unitIndex === 0 ? 0 : fractionDigits),
	)

	return `${rounded} ${units[unitIndex]}`
}