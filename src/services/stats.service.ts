import $api from '@/http/http'
import type { IStorageStats } from '@/types/stats.type'

export const getStorageStats = () => $api.get<IStorageStats>('/stats')
