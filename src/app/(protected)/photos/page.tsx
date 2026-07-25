'use client'

import { useState } from 'react'

import Image from 'next/image'

import { Card } from '@/components/ui/Card/card'
import { Button } from '@/components/ui/button/Button'
import Input from '@/components/ui/input/input'
import { PHOTOS } from '@/constants/queryKeys'
import { getPhotos } from '@/services/file.service'
import { formatBytes } from '@/utils/formatBytes.util'
import { useQuery } from '@tanstack/react-query'
import {
	ArrowUpRight,
	Camera,
	Clock3,
	Grid3X3,
	ImageIcon,
	ListFilter,
	Search,
	Share2,
	Sparkles,
} from 'lucide-react'

const PHOTO_COLLECTIONS = [
	{
		title: 'UI Explorations',
		count: '18 photos',
		accent: 'from-orange-200 via-amber-100 to-white',
	},
	{
		title: 'Dashboard Shots',
		count: '12 photos',
		accent: 'from-sky-200 via-cyan-100 to-white',
	},
	{
		title: 'Brand References',
		count: '9 photos',
		accent: 'from-emerald-200 via-lime-100 to-white',
	},
] as const

const PHOTO_ITEM_BADGES = {
	Recent: 'bg-sky-100 text-sky-700',
	Folder: 'bg-muted text-foreground',
} as const

export default function Photo() {
	const [searchValue, setSearchValue] = useState('')

	const {
		data: photos = [],
		isPending,
		isError,
		error,
	} = useQuery({
		queryKey: PHOTOS.photos,
		queryFn: getPhotos,
	})

	const filteredPhotos = photos.filter(photo =>
		photo.name.toLowerCase().includes(searchValue.toLowerCase()),
	)

	const storageUsed = photos.reduce(
		(total, photo) => total + Number(photo.size || 0),
		0,
	)

	const metrics = [
		{
			label: 'All photos',
			value: String(photos.length),
			icon: ImageIcon,
		},
		{
			label: 'Shared',
			value: String(Math.min(12, Math.max(0, Math.floor(photos.length / 3)))),
			icon: Share2,
		},
	] as const

	if (isPending) {
		return (
			<section className='flex w-full flex-col gap-4 pb-6'>
				<Card className='rounded-[28px] bg-card p-8'>
					<div className='text-lg font-medium text-foreground'>
						Loading photo workspace...
					</div>
					<div className='mt-2 text-sm text-muted-foreground'>
						Preparing gallery and visual previews.
					</div>
				</Card>
			</section>
		)
	}

	if (isError) {
		return (
			<section className='flex w-full flex-col gap-4 pb-6'>
				<Card className='rounded-[28px] bg-card p-8'>
					<div className='text-lg font-medium text-foreground'>
						Failed to load photos
					</div>
					<div className='mt-2 text-sm text-muted-foreground'>
						{error instanceof Error ? error.message : 'Unknown error'}
					</div>
				</Card>
			</section>
		)
	}

	return (
		<section className='flex w-full flex-col gap-8 pb-6'>
			<section className='relative overflow-hidden rounded-[28px] border border-border bg-linear-to-br from-neutral-900 via-neutral-800 to-neutral-700 px-7 py-7 text-white'>
					<div className='absolute -top-12 right-10 h-44 w-44 rounded-full bg-white/10 blur-3xl' />
					<div className='absolute bottom-0 right-0 h-52 w-52 translate-x-16 translate-y-16 rounded-full bg-amber-300/15 blur-3xl' />

					<div className='relative grid gap-8 lg:grid-cols-[1.25fr_0.9fr] lg:items-end'>
						<div className='max-w-2xl'>
							<div className='mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-white/85 backdrop-blur-xs'>
								<Sparkles size={16} />
								Photo workspace
							</div>

							<h1 className='text-3xl font-semibold tracking-tight text-white sm:text-4xl'>
								All your visual references in one clean gallery
							</h1>
							<p className='mt-3 max-w-xl text-sm leading-6 text-neutral-300 sm:text-base'>
								Sort, preview and group key design shots in the same calm
								workspace language as the rest of Kura Drive.
							</p>

							<div className='mt-6 flex flex-wrap gap-3'>
								<Button>
									<Camera size={18} /> Add photos
								</Button>
							</div>
						</div>

						<div className='grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3'>
							{PHOTO_COLLECTIONS.map(collection => (
								<div
									key={collection.title}
									className={`rounded-2xl border border-white/10 bg-linear-to-br ${collection.accent} p-4 text-foreground shadow-sm`}
								>
									<div className='mb-8 inline-flex rounded-xl bg-card/85 p-2 text-foreground'>
										<ImageIcon size={18} />
									</div>
									<div className='text-sm font-medium'>{collection.title}</div>
									<div className='mt-1 text-xs text-foreground'>
										{collection.count}
									</div>
								</div>
							))}
						</div>
					</div>
			</section>

			<section className='grid gap-4 md:grid-cols-2'>
					{metrics.map(metric => (
						<Card key={metric.label} className='bg-card p-4'>
							<div className='flex items-start justify-between'>
								<div>
									<p className='text-sm text-muted-foreground'>{metric.label}</p>
									<p className='mt-2 text-3xl font-semibold text-foreground'>
										{metric.value}
									</p>
								</div>
								<div className='rounded-2xl bg-muted p-3 text-foreground'>
									<metric.icon size={18} />
								</div>
							</div>
						</Card>
					))}
			</section>

			<section className='flex flex-col gap-4 rounded-[24px] border border-border bg-card p-5 shadow-[0_12px_40px_rgba(23,23,23,0.04)]'>
					<div className='flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between'>
						<div>
							<h2 className='text-2xl font-semibold text-foreground'>
								Photo gallery
							</h2>
							<p className='mt-1 text-sm text-muted-foreground'>
								A curated overview of visuals, previews and active design shots.
							</p>
						</div>

						<div className='flex flex-wrap gap-3'>
							<Button variant='secondary'>
								<Clock3 size={18} /> Recent
							</Button>
							<Button variant='secondary'>
								<ListFilter size={18} /> Filter
							</Button>
							<Button variant='secondary'>
								<Grid3X3 size={18} /> Grid view
							</Button>
						</div>
					</div>

					<div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]'>
						<Input
							Icon={Search}
							placeholder='Search photo or tag...'
							className='bg-muted'
							value={searchValue}
							onChange={e => setSearchValue(e.target.value)}
						/>

						<Card className='flex items-center justify-between gap-4 bg-muted p-4'>
							<div>
								<p className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>
									Storage
								</p>
								<p className='mt-1 text-sm font-medium text-foreground'>
									{formatBytes(storageUsed)} used in visual assets
								</p>
							</div>
							<div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground'>
								<ArrowUpRight size={18} />
							</div>
						</Card>
					</div>

					<div className='grid gap-5 md:grid-cols-2 2xl:grid-cols-3'>
						{filteredPhotos.map(item => (
							<div
								key={item.id}
								className='overflow-hidden rounded-[24px] border border-border bg-card p-0 shadow-none'
							>
								<div className='group relative aspect-[4/3] overflow-hidden border-b border-border bg-muted'>
									{item.thumbnailUrl ? (
										<Image
											src={item.thumbnailUrl}
											alt={item.name}
											fill
											unoptimized
											className='rounded-md object-cover object-top transition duration-300 group-hover:scale-[1.03]'
										/>
									) : (
										<div className='flex h-full w-full items-center justify-center bg-linear-to-br from-neutral-100 to-neutral-200 text-sm font-medium text-muted-foreground'>
											No preview
										</div>
									)}
									<div className='absolute inset-0 bg-linear-to-t from-neutral-950/40 via-transparent to-transparent' />
									<div className='absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-xs'>
										{item.name}
									</div>
								</div>

								<div className='space-y-3 p-4'>
									<div className='flex items-start justify-between gap-3'>
										<div>
											<h3 className='text-base font-medium text-foreground'>
												{item.createdAt
													? new Date(item.createdAt).toLocaleDateString()
													: 'Recently updated'}
											</h3>
											<p className='mt-1 text-sm text-muted-foreground'>
												{item.folderId ? 'Stored in folder' : 'Loose photo'}
											</p>
										</div>
										<span
											className={`rounded-full px-2.5 py-1 text-xs font-medium ${
												item.folderId
													? PHOTO_ITEM_BADGES.Folder
													: PHOTO_ITEM_BADGES.Recent
											}`}
										>
											{item.folderId ? 'Folder' : 'Recent'}
										</span>
									</div>

									<div className='flex items-center justify-between border-t border-border pt-3 text-sm text-muted-foreground'>
										<span>{formatBytes(item.size)}</span>
										<button className='cursor-pointer font-medium text-foreground transition hover:text-foreground'>
											Open
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
			</section>
		</section>
	)
}
