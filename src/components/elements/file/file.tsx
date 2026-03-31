import { FolderIcon } from '@/assets/icons/FolderIcon'
import {
	Popover,
	PopoverContext,
	PopoverContextProps,
} from '@/components/ui/popover/popover'
import { PopoverContent } from '@/components/ui/popover/popover-content'
import { getDownloadUrl } from '@/services/file.service'
import { hardDeleteFolder } from '@/services/folder.service'
import { cn } from '@/utils/cn'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	DownloadCloudIcon,
	FilePen,
	FilePlay,
	FileText,
	FolderInput,
	SquarePen,
	Trash2,
} from 'lucide-react'
import Link from 'next/link'
import React, { forwardRef, memo } from 'react'
import Image from 'next/image'

export type FileProps = React.HTMLAttributes<HTMLAnchorElement> & {
	pathname?: string
	slug?: string
	name: string
	size?: number
	id: string
	context?: PopoverContextProps | undefined
	downloadUrl: string
	imagePreview: string
}

export const ContextMenuContent: React.FC = memo(
	({ onDelete, itemId, downloadUrl }) => (
		<div className='flex flex-col text-sm'>
			<button className='cursor-pointer flex items-center gap-2 text-left px-3 py-1.5 hover:bg-neutral-100 rounded'>
				<DownloadCloudIcon size={20} /> Просмотреть
			</button>
			<Link
				href={downloadUrl}
				className='cursor-pointer flex items-center gap-2 text-left px-3 py-1.5 hover:bg-neutral-100 rounded'
			>
				<DownloadCloudIcon size={20} /> Скачать
			</Link>
			<button className='cursor-pointer flex items-center gap-2 text-left text-md px-3 py-1.5 hover:bg-neutral-100 rounded'>
				<SquarePen size={20} />
				Переименовать
			</button>
			<button className='cursor-pointer flex items-center gap-2 text-left text-md px-3 py-1.5 hover:bg-neutral-100 rounded'>
				<FolderInput size={20} /> Переместить
			</button>
			<button
				className='cursor-pointer flex items-center gap-2 text-left text-md px-3 py-1.5 hover:bg-neutral-100 rounded'
				onClick={() => onDelete(itemId)}
			>
				<Trash2 size={20} /> Удалить
			</button>
		</div>
	),
)

ContextMenuContent.displayName = 'ContextMenuContent'

export const FileGrid = forwardRef<HTMLDivElement, FileProps>(
	({ className, name, pathname, id, size, imagePreview, ...props }, ref) => {
		const queryClient = useQueryClient()

		const href = `${pathname}/${name}`
		const fileId = id

		const { data, isPending, isError, error } = useQuery({
			queryKey: ['downloadUrl', fileId],
			queryFn: () => getDownloadUrl(fileId),
			enabled: !!fileId,
		})

		const deleteFile = useMutation({
			mutationFn: hardDeleteFolder,
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['FILES'] })
			},
		})

		const onDeleteFile = () => {
			deleteFile.mutate({ id: fileId, type: 'file' })
		}
		return (
			<Popover>
				<PopoverContext.Consumer>
					{context => (
						<>
							<div
								ref={ref}
								href={href}
								onContextMenu={e => {
									e.preventDefault()
									context?.setCoords({ x: e.clientX, y: e.clientY })
									context?.setOpen(true)
								}}
								className={cn(
									'w-25 flex flex-col items-center duration-200 ease-in-out hover:-translate-y-1 cursor-pointer',
									className,
								)}
								{...props}
							>
								{name.endsWith('.jpg') ||
								name.endsWith('.png') ||
								name.endsWith('.svg') ? (
									<Image
										src={imagePreview}
										alt={name}
										width={200}
										height={200}
										unoptimized
										className='rounded-md'
									/>
								) : name.endsWith('.docx') ? (
									<FilePen size={55} className='text-blue-600' />
								) : name.endsWith('.pdf') ? (
									<FileText size={55} className='text-red-600' />
								) : name.endsWith('.mp4') || name.endsWith('.mp3') ? (
									<FilePlay size={55} className='text-green-600' />
								) : (
									<File size={55} className='text-neutral-600' />
								)}

								<div className='text-center text-sm font-medium leading-tight line-clamp-2 wrap-break-word w-full mt-2'>
									{name}
								</div>
							</div>
							<PopoverContent isContextMenu>
								<ContextMenuContent
									itemId={fileId}
									onDelete={onDeleteFile}
									context={context}
									downloadUrl={data?.downloadUrl}
								/>
							</PopoverContent>
						</>
					)}
				</PopoverContext.Consumer>
			</Popover>
		)
	},
)

FileGrid.displayName = 'FileGrid'

// export const FileLine = forwardRef<HTMLAnchorElement, FolderProps>(
// 	({ className, pathname, name, ...props }, ref) => {
// 		const slug = name
// 			.toLowerCase()
// 			.replace(/\s+/g, '-')
// 			.replace(/[^a-z0-9-]/g, '')
// 		return (
// 			<Popover className='w-full'>
// 				<PopoverContext.Consumer>
// 					{context => (
// 						<>
// 							<div
// 								key={index}
// 								className='flex items-center w-full border-neutral-200 py-2 border-b px-4 hover:bg-neutral-100'
// 							>
// 								<div className='w-[40%] flex items-center gap-2'>
// 									{fileName.endsWith('.jpg') ||
// 									fileName.endsWith('.png') ||
// 									fileName.endsWith('.svg') ? (
// 										<FileImage size={25} className='text-red-600' />
// 									) : fileName.endsWith('.docx') ? (
// 										<FilePen size={25} className='text-blue-600' />
// 									) : fileName.endsWith('.pdf') ? (
// 										<FileText size={25} className='text-red-600' />
// 									) : fileName.endsWith('.mp4') || fileName.endsWith('.mp3') ? (
// 										<FilePlay size={25} className='text-green-600' />
// 									) : (
// 										<File size={25} className='text-neutral-600' />
// 									)}
// 									<div className='overflow-wrap'>{fileName}</div>
// 								</div>

// 								<div className='flex items-center gap-2 w-[20%]'>
// 									<div className='w-8 h-8 rounded-full overflow-hidden flex items-center justify-center border border-neutral-400'>
// 										{/* <Image
// 								src={avatar}
// 								alt='avatar'
// 								className='object-cover'
// 								width={24}
// 								height={24}
// 							/> */}
// 										<User size={24} />
// 									</div>
// 									<span>{owner}</span>
// 								</div>
// 								<div className='w-[15%]'>{date}</div>
// 								<div className='w-[15%]'>{size}</div>
// 								<div className='w-[10%] p-2 flex items-center justify-end text-center'>
// 									<EllipsisVertical size={25} className='text-neutral-400' />
// 								</div>
// 							</div>
// 							<PopoverContent isContextMenu>
// 								<ContextMenuContent />
// 							</PopoverContent>
// 						</>
// 					)}
// 				</PopoverContext.Consumer>
// 			</Popover>
// 		)
// 	},
// )
// FileLine.displayName = 'FileLine'
