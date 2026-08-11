import $api from '@/shared/api/http'
import type { IStorageStats } from '@/entities/storage/model/storage.types'

export const getStorageStats = () => $api.get<IStorageStats>('/stats')
