'use client'

import {
	parseFolderItemsFilters,
	toFolderItemsSearchParams,
	type FolderItemTypeFilter,
	type FolderItemsFilters,
} from '@/features/folder-filters/model/folder-filters'
import type { FolderItemsSort } from '@/entities/folder/model/folder.types'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

type NavigationMode = 'push' | 'replace'

interface UseFolderItemsFiltersOptions {
	enableType?: boolean
}

export function useFolderItemsFilters({
	enableType = true,
}: UseFolderItemsFiltersOptions = {}) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const filters = useMemo(() => {
		const parsedFilters = parseFolderItemsFilters(searchParams)
		return {
			...parsedFilters,
			type: enableType ? parsedFilters.type : ('all' as const),
		}
	}, [enableType, searchParams])
	const navigate = (
		nextFilters: FolderItemsFilters,
		mode: NavigationMode = 'push',
	) => {
		const query = toFolderItemsSearchParams(nextFilters).toString()
		const href = query ? `${pathname}?${query}` : pathname
		router[mode](href, { scroll: false })
	}

	return {
		filters,
		setSearch: (q: string) => {
			const normalizedQuery = q.trim().slice(0, 100)
			if (normalizedQuery === filters.q) return
			navigate({ ...filters, q: normalizedQuery, page: 1 }, 'replace')
		},
		setType: (type: FolderItemTypeFilter) =>
			navigate({ ...filters, type, page: 1 }),
		setSort: (sort: FolderItemsSort) =>
			navigate({
				...filters,
				sort,
				order: sort === 'name' ? 'asc' : 'desc',
				page: 1,
			}),
		setPage: (page: number) => navigate({ ...filters, page }),
		resetFilters: () => navigate({ ...filters, q: '', type: 'all', sort: 'name', order: 'asc', page: 1 }),
		hasActiveFilters:
			Boolean(filters.q) || filters.type !== 'all' || filters.sort !== 'name',
	}
}
