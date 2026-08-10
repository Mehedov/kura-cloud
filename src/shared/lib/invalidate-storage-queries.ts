import { STORAGE_QUERY_ROOTS } from '@/shared/config/query-keys'
import type { QueryClient } from '@tanstack/react-query'

export const invalidateStorageQueries = (queryClient: QueryClient) =>
	Promise.all(
		STORAGE_QUERY_ROOTS.map(queryKey =>
			queryClient.invalidateQueries({ queryKey }),
		),
	)
