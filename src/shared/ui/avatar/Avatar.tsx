'use client'

import { cn } from '@/shared/lib/cn'
import { useState } from 'react'

const avatarColors = {
	sky: 'bg-sky-600',
	violet: 'bg-violet-600',
	emerald: 'bg-emerald-600',
	rose: 'bg-rose-600',
	amber: 'bg-amber-600',
} as const

type AvatarColor = keyof typeof avatarColors

type AvatarProps = {
	name?: string | null
	avatarUrl?: string | null
	avatarColor?: AvatarColor | string | null
	id?: string | null
	className?: string
	imageClassName?: string
	alt?: string
	title?: string
}

function fallbackColor(id: string) {
	const colors = Object.values(avatarColors)
	const hash = [...id].reduce((total, character) => total + character.charCodeAt(0), 0)
	return colors[hash % colors.length]
}

export function Avatar({
	name,
	avatarUrl,
	avatarColor,
	id,
	className,
	imageClassName,
	alt,
	title,
}: AvatarProps) {
	const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null)
	const imageUrl = avatarUrl?.trim()
	const imageFailed = Boolean(imageUrl && failedImageUrl === imageUrl)
	const initial = name?.trim().charAt(0).toUpperCase() || '?'
	const color = avatarColor && avatarColor in avatarColors
		? avatarColors[avatarColor as AvatarColor]
		: fallbackColor(id ?? name ?? '?')

	return (
		<span
			className={cn(
				'grid shrink-0 place-items-center overflow-hidden rounded-full bg-primary font-semibold text-primary-foreground',
				!imageUrl || imageFailed ? color : undefined,
				className,
			)}
			title={title}
		>
			{imageUrl && !imageFailed ? (
				// Native img keeps user-provided remote avatar hosts independent from Next image allowlists.
				// eslint-disable-next-line @next/next/no-img-element
				<img
					src={imageUrl}
					alt={alt ?? name ?? ''}
					className={cn('size-full object-cover', imageClassName)}
					onError={() => setFailedImageUrl(imageUrl)}
				/>
			) : (
				initial
			)}
		</span>
	)
}
