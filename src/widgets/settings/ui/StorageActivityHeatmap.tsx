import { cn } from '@/shared/lib/cn'
import { Card } from '@/shared/ui/Card/card'
import ModalContainer from '@/shared/ui/modal/Modal'
import { Tooltip } from '@/shared/ui/tooltip/Tooltip'
import {
	Activity,
	Download,
	FilePenLine,
	FolderPlus,
	Link2,
	RotateCcw,
	Upload,
	X,
	type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'

const WEEK_COUNT = 53
const DAY_COUNT = WEEK_COUNT * 7
const WEEKDAY_LABELS = ['Вс', '', 'Вт', '', 'Чт', '', 'Сб']
const LEVEL_CLASSES = [
	'bg-muted-foreground/20 ring-1 ring-border/70 dark:bg-muted-foreground/30',
	'bg-[#f8dcae] dark:bg-[#6f4b1f]',
	'bg-[#f5c77d] dark:bg-[#9a672b]',
	'bg-[#F0A84B] dark:bg-[#F0A84B]',
	'bg-[#c77a18] dark:bg-[#f6bd68]',
]

const END_DATE = new Date(Date.UTC(2026, 7, 9))

type ActivityEvent = {
	label: string
	count: number
	icon: LucideIcon
	tone: string
}

type ActivityDay = {
	date: Date
	level: number
	events: ActivityEvent[]
}

function getDateForIndex(index: number) {
	const date = new Date(END_DATE)
	date.setUTCDate(END_DATE.getUTCDate() - (DAY_COUNT - index - 1))
	return date
}

function getActivityLevel(index: number, date: Date) {
	const weekday = date.getUTCDay()
	const wave = (index * 29 + date.getUTCDate() * 7) % 17
	if (weekday === 0 || weekday === 6) return wave > 12 ? 2 : 0
	if (wave < 3) return 0
	if (wave < 7) return 1
	if (wave < 12) return 2
	if (wave < 15) return 3
	return 4
}

function getDayActivity(index: number, date: Date): ActivityDay {
	const level = getActivityLevel(index, date)
	if (level === 0) return { date, level, events: [] }

	const wave = (index * 13 + date.getUTCDate() * 3) % 5
	const events: ActivityEvent[] = [
		{
			label: 'Файлы загружены',
			count: level + (wave % 3),
			icon: Upload,
			tone: 'bg-primary/10 text-primary',
		},
		{
			label: 'Файлы изменены',
			count: level + 1,
			icon: FilePenLine,
			tone: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
		},
	]

	if (wave % 2 === 0) {
		events.push({
			label: 'Скачивания',
			count: level + wave,
			icon: Download,
			tone: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
		})
	}
	if (level >= 2) {
		events.push({
			label: 'Ссылки опубликованы',
			count: (wave % 2) + 1,
			icon: Link2,
			tone: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
		})
	}
	if (wave === 1 || wave === 4) {
		events.push({
			label: 'Папки созданы',
			count: 1,
			icon: FolderPlus,
			tone: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
		})
	}
	if (wave === 3 && level >= 3) {
		events.push({
			label: 'Файлы восстановлены',
			count: 1,
			icon: RotateCcw,
			tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
		})
	}

	return { date, level, events }
}

function formatDate(date: Date) {
	return date.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC',
	})
}

function getMonthLabels() {
	return Array.from({ length: WEEK_COUNT }, (_, weekIndex) => {
		const date = getDateForIndex(weekIndex * 7)
		const previous =
			weekIndex === 0 ? null : getDateForIndex((weekIndex - 1) * 7)
		return date.getUTCMonth() !== previous?.getUTCMonth()
			? {
					weekIndex,
					label: date.toLocaleDateString('ru-RU', {
						month: 'short',
						timeZone: 'UTC',
					}),
				}
			: null
	}).filter(Boolean) as Array<{ weekIndex: number; label: string }>
}

export function StorageActivityHeatmap() {
	const monthLabels = getMonthLabels()
	const [selectedDay, setSelectedDay] = useState<ActivityDay | null>(null)

	return (
		<div className='overflow-hidden rounded-xl bg-muted/20 p-4'>
			<div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
				<div className='flex items-start gap-3'>
					<Activity size={18} />
					<h3 className='text-sm font-medium text-foreground'>
						Активность хранилища
					</h3>
				</div>
			</div>

			<div className='mt-5 overflow-x-auto pb-1'>
				<div className='grid min-w-[47rem] grid-cols-[2rem_repeat(53,0.75rem)] gap-1'>
					<div />
					{monthLabels.map(({ weekIndex, label }) => (
						<span
							key={`${weekIndex}-${label}`}
							className='text-[10px] capitalize text-muted-foreground'
							style={{ gridColumnStart: weekIndex + 2 }}
						>
							{label}
						</span>
					))}
					<div className='grid grid-rows-7 gap-1 pt-1'>
						{WEEKDAY_LABELS.map((label, index) => (
							<span
								key={index}
								className='flex h-3 items-center text-[10px] text-muted-foreground'
							>
								{label}
							</span>
						))}
					</div>
					{Array.from({ length: WEEK_COUNT }, (_, weekIndex) => (
						<div key={weekIndex} className='grid grid-rows-7 gap-1 pt-1'>
							{Array.from({ length: 7 }, (_, weekday) => {
								const index = weekIndex * 7 + weekday
								const date = getDateForIndex(index)
								const day = getDayActivity(index, date)
								const totalEvents = day.events.reduce(
									(total, event) => total + event.count,
									0,
								)
								return (
									<Tooltip
										key={date.toISOString()}
										content={
											<div className='min-w-48'>
												<div className='flex items-baseline justify-between gap-4'>
													<p className='font-semibold'>{formatDate(date)}</p>
													<span className='text-[11px] text-muted-foreground'>
														{totalEvents} операций
													</span>
												</div>
												{day.events.length === 0 ? (
													<p className='mt-2 text-muted-foreground'>
														Нет активности
													</p>
												) : (
													<div className='mt-2 space-y-1.5'>
														{day.events.map(event => {
															const Icon = event.icon
															return (
																<div
																	key={event.label}
																	className='flex items-center gap-2'
																>
																	<span
																		className={cn(
																			'flex size-5 shrink-0 items-center justify-center rounded-md',
																			event.tone,
																		)}
																	>
																		<Icon size={12} />
																	</span>
																	<span className='min-w-0 flex-1 truncate text-muted-foreground'>
																		{event.label}
																	</span>
																	<span className='font-semibold'>
																		{event.count}
																	</span>
																</div>
															)
														})}
													</div>
												)}
											</div>
										}
									>
										<button
											type='button'
											aria-label={`${formatDate(date)}, ${totalEvents} операций. Открыть детали`}
											onClick={() => setSelectedDay(day)}
											className={cn(
												'size-3 rounded-[3px] p-0 transition-colors hover:ring-2 hover:ring-ring/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
												LEVEL_CLASSES[day.level],
											)}
										/>
									</Tooltip>
								)
							})}
						</div>
					))}
				</div>
			</div>

			<div className='mt-3 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground'>
				<span>Меньше</span>
				{LEVEL_CLASSES.map((className, index) => (
					<span key={index} className={cn('size-3 rounded-[3px]', className)} />
				))}
				<span>Больше</span>
			</div>

			{selectedDay && (
				<ModalContainer
					isOpen
					onClose={() => setSelectedDay(null)}
					ariaLabel={`Активность за ${formatDate(selectedDay.date)}`}
				>
					<Card className='w-[min(calc(100vw-2rem),32rem)]'>
						<div className='flex items-start justify-between gap-4'>
							<div>
								<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Активность хранилища
								</p>
								<h2 className='mt-1 text-lg font-semibold text-foreground'>
									{formatDate(selectedDay.date)}
								</h2>
							</div>
							<button
								type='button'
								onClick={() => setSelectedDay(null)}
								className='rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
								aria-label='Закрыть детали активности'
							>
								<X size={18} />
							</button>
						</div>

						{selectedDay.events.length === 0 ? (
							<div className='mt-6 rounded-xl border border-dashed border-border bg-muted/30 p-5 text-center'>
								<p className='text-sm font-medium text-foreground'>
									Нет активности
								</p>
								<p className='mt-1 text-sm text-muted-foreground'>
									В этот день с файлами ничего не происходило.
								</p>
							</div>
						) : (
							<div className='mt-6 space-y-2'>
								{selectedDay.events.map(event => {
									const Icon = event.icon
									return (
										<div
											key={event.label}
											className='flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5'
										>
											<div className='flex min-w-0 items-center gap-3'>
												<span
													className={cn(
														'flex size-7 shrink-0 items-center justify-center rounded-lg',
														event.tone,
													)}
												>
													<Icon size={15} />
												</span>
												<span className='truncate text-sm text-foreground'>
													{event.label}
												</span>
											</div>
											<span className='text-sm font-semibold text-foreground'>
												{event.count}
											</span>
										</div>
									)
								})}
							</div>
						)}
					</Card>
				</ModalContainer>
			)}
		</div>
	)
}
