import $api from '@/shared/api/http'
import type { IStorageStats } from '@/entities/storage/model/storage.types'

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null

const isStorageStats = (value: unknown): value is IStorageStats => {
	if (
		!isRecord(value) ||
		!isRecord(value.total) ||
		!Array.isArray(value.categories)
	) {
		return false
	}

	return (
		typeof value.total.usedFormatted === 'string' &&
		typeof value.total.limitFormatted === 'string' &&
		typeof value.total.freeFormatted === 'string' &&
		typeof value.total.percent === 'number'
	)
}

const parseStorageStats = (payload: unknown): IStorageStats => {
	if (isStorageStats(payload)) return payload

	if (isRecord(payload)) {
		if (isStorageStats(payload.data)) return payload.data
		if (isStorageStats(payload.stats)) return payload.stats
	}

	throw new Error('Сервер вернул статистику хранилища в неизвестном формате')
}

export const getStorageStats = async (): Promise<IStorageStats> => {
	const response = await $api.get<unknown>('/stats')
	return parseStorageStats(response.data)
}
