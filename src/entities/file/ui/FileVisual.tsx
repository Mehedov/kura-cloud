import { File as FileIcon, FilePlay, FileText } from 'lucide-react'
import Image from 'next/image'

type FileVisualType = 'photo' | 'video' | 'document' | 'other'

interface FileVisualProps {
	type: FileVisualType
	thumbnailUrl?: string | null
	alt: string
	size?: number
}

export function FileVisual({
	type,
	thumbnailUrl,
	alt,
	size = 68,
}: FileVisualProps) {
	const iconSize = Math.round(size * 0.72)

	return (
		<div
			className='flex shrink-0 items-center justify-center overflow-hidden rounded-lg text-muted-foreground'
			style={{ width: size, height: size }}
		>
			{type === 'photo' && thumbnailUrl ? (
				<Image
					src={thumbnailUrl}
					alt={alt}
					width={size}
					height={size}
					unoptimized
					className='h-full w-full rounded-lg object-cover'
					style={{ width: size, height: size }}
				/>
			) : type === 'video' ? (
				<FilePlay size={iconSize} className='text-green-600' />
			) : type === 'document' ? (
				<FileText size={iconSize} className='text-red-600' />
			) : (
				<FileIcon size={iconSize} />
			)}
		</div>
	)
}
