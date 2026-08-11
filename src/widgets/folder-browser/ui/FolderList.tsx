import { FolderCollection } from '@/widgets/folder-browser/ui/FolderCollection'
import type { FolderItemsFilters } from '@/features/folder-filters/model/folder-filters'

interface Props {
	activeBtn?: 'menu' | 'grid'
	filters: FolderItemsFilters
	hasActiveFilters: boolean
	onPageChange: (page: number) => void
}

export function FolderList({
	activeBtn,
	filters,
	hasActiveFilters,
	onPageChange,
}: Props) {
	return (
		<FolderCollection
			activeBtn={activeBtn}
			filters={filters}
			hasActiveFilters={hasActiveFilters}
			onPageChange={onPageChange}
		/>
	)
}
