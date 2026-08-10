export type StorageCategory =
	| 'Photo'
	| 'Video'
	| 'Document'
	| 'Other files'
	| 'Free Storage'

export interface IStorageStats {
	total: {
		used: number
		limit: number
		free: number
		usedFormatted: string
		limitFormatted: string
		freeFormatted: string
		percent: number
	}
	categories: Array<{
		label: StorageCategory
		value: number
		formattedValue: string
	}>
}
