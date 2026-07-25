import type {
	FolderItemsOrder,
	FolderItemsSort,
} from '@/types/folder.type'

export const FOLDER_ITEM_SORTS = ['name', 'updatedAt', 'size'] as const
export const FOLDER_ITEM_TYPES = [
	'all',
	'photo',
	'video',
	'document',
	'other',
] as const

export type FolderItemTypeFilter = (typeof FOLDER_ITEM_TYPES)[number]

export interface FolderItemsFilters {
	q: string
	type: FolderItemTypeFilter
	sort: FolderItemsSort
	order: FolderItemsOrder
	page: number
}

const DEFAULT_FILTERS: FolderItemsFilters = {
	q: '',
	type: 'all',
	sort: 'name',
	order: 'asc',
	page: 1,
}

const isSort = (value: string | null): value is FolderItemsSort =>
	FOLDER_ITEM_SORTS.includes(value as FolderItemsSort)

const isType = (value: string | null): value is FolderItemTypeFilter =>
	FOLDER_ITEM_TYPES.includes(value as FolderItemTypeFilter)

export function parseFolderItemsFilters(
	params: Pick<URLSearchParams, 'get'>,
): FolderItemsFilters {
	const rawSort = params.get('sort')
	const rawType = params.get('type')
	const sort = isSort(rawSort) ? rawSort : 'name'
	const order = params.get('order') === 'desc' ? 'desc' : 'asc'
	const pageValue = params.get('page')
	const parsedPage = pageValue && /^\d+$/.test(pageValue) ? Number(pageValue) : 1

	return {
		q: (params.get('q') ?? '').trim().slice(0, 100),
		type: isType(rawType) ? rawType : 'all',
		sort,
		order: sort === 'name' ? 'asc' : order,
		page: Number.isSafeInteger(parsedPage) ? Math.max(parsedPage, 1) : 1,
	}
}

export function toFolderItemsSearchParams(filters: FolderItemsFilters) {
	const params = new URLSearchParams()
	if (filters.q) params.set('q', filters.q)
	if (filters.type !== DEFAULT_FILTERS.type) params.set('type', filters.type)
	if (filters.sort !== DEFAULT_FILTERS.sort) params.set('sort', filters.sort)
	if (filters.order !== DEFAULT_FILTERS.order) params.set('order', filters.order)
	if (filters.page !== DEFAULT_FILTERS.page) params.set('page', String(filters.page))
	return params
}
