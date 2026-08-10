import type { IStorageStats } from '@/entities/storage/model/storage.types'
import {
	Database,
	HardDrive,
	PieChart,
	UploadCloud,
	type LucideIcon,
} from 'lucide-react'

const SUMMARY_TILES: Array<{
	key: 'used' | 'free' | 'limit' | 'percent'
	label: string
	icon: LucideIcon
}> = [
	{ key: 'used', label: 'Занято', icon: UploadCloud },
	{ key: 'free', label: 'Свободно', icon: HardDrive },
	{ key: 'limit', label: 'Лимит', icon: Database },
	{ key: 'percent', label: 'Использовано', icon: PieChart },
]

function getTileValue(
	data: IStorageStats,
	key: (typeof SUMMARY_TILES)[number]['key'],
) {
	if (key === 'used') return data.total.usedFormatted
	if (key === 'free') return data.total.freeFormatted
	if (key === 'limit') return data.total.limitFormatted
	return `${Math.round(data.total.percent)}%`
}

export function StorageOverviewTiles({ data }: { data: IStorageStats }) {
	return (
		<div className='space-y-4'>
			<div className='grid grid-cols-2 gap-3 xl:grid-cols-4'>
				{SUMMARY_TILES.map(({ key, label, icon: Icon }) => (
					<div
						key={key}
						className='rounded-xl border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/40'
					>
						<div className='flex items-center justify-between gap-2'>
							<span className='text-xs font-medium text-muted-foreground'>
								{label}
							</span>
							<Icon size={16} />
						</div>
						<p className='mt-3 text-xl font-semibold tracking-tight text-foreground'>
							{getTileValue(data, key)}
						</p>
					</div>
				))}
			</div>
		</div>
	)
}
