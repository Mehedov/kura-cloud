'use client'

import { getFolderItems } from '@/entities/folder/api/folder.queries'
import type { IFolderItemsParams } from '@/entities/folder/model/folder.types'
import type { FolderItemsFilters } from '@/features/folder-filters/model/folder-filters'
import { FOLDER_KEYS } from '@/shared/config/query-keys'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

interface UseFolderItemsOptions {
	folderId: string
	filters?: FolderItemsFilters
	limit?: number
}

export function useFolderItems({
	folderId,
	filters,
	limit = 50,
}: UseFolderItemsOptions) {
	const queryParams = useMemo<IFolderItemsParams>(
		() => ({
			sort: filters?.sort ?? 'name',
			order: filters?.order ?? 'asc',
			type: filters?.type && filters.type !== 'all' ? filters.type : undefined,
			q: filters?.q || undefined,
			page: filters?.page ?? 1,
			limit,
		}),
		[filters, limit],
	)

	return useQuery({
		queryKey: [...FOLDER_KEYS.files, folderId, queryParams],
		queryFn: () => getFolderItems(folderId, queryParams),
		enabled: Boolean(folderId),
	})
}
