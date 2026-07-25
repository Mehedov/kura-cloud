import {
	Popover,
	PopoverContext,
	PopoverContextProps,
} from '@/components/ui/popover/popover'
import { PopoverContent } from '@/components/ui/popover/popover-content'
import { getDownloadUrl } from '@/services/file.service'
import {
	ResourceActionsDialogs,
	type ResourceAction,
} from '@/components/elements/resource-actions/resource-actions-dialogs'
import { moveToTrash } from '@/services/folder.service'
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
	File as FileIcon,
} from 'lucide-react'
import React, { forwardRef, memo, useState } from 'react'
import Image from 'next/image'

export type FileProps = React.HTMLAttributes<HTMLDivElement> & {
	name: string
	id: string
	context?: PopoverContextProps | undefined
	imagePreview?: string
}

interface ContextMenuContentProps {
	onDelete?: () => void
	downloadUrl?: string
	onRename?: () => void
	onMove?: () => void
}

export const ContextMenuContent = memo(
	({ onDelete, downloadUrl, onRename, onMove }: ContextMenuContentProps) => (
		<div className='flex flex-col text-sm'>
			<button className='cursor-pointer flex items-center gap-2 text-left px-3 py-1.5 hover:bg-muted rounded'>
				<DownloadCloudIcon size={20} /> Просмотреть
			</button>
			{downloadUrl ? (
				<a
					href={downloadUrl}
					className='cursor-pointer flex items-center gap-2 text-left px-3 py-1.5 hover:bg-muted rounded'
				>
					<DownloadCloudIcon size={20} /> Скачать
				</a>
			) : null}
			<button
				className='cursor-pointer flex items-center gap-2 text-left text-md px-3 py-1.5 hover:bg-muted rounded'
				onClick={onRename}
			>
				<SquarePen size={20} />
				Переименовать
			</button>
			<button
				className='cursor-pointer flex items-center gap-2 text-left text-md px-3 py-1.5 hover:bg-muted rounded'
				onClick={onMove}
			>
				<FolderInput size={20} /> Переместить
			</button>
			<button
				className='cursor-pointer flex items-center gap-2 text-left text-md px-3 py-1.5 hover:bg-muted rounded'
				onClick={onDelete}
			>
				<Trash2 size={20} /> Удалить
			</button>
		</div>
	),
)

ContextMenuContent.displayName = 'ContextMenuContent'

export const FileGrid = forwardRef<HTMLDivElement, FileProps>(
	({ className, name, id, imagePreview, ...props }, ref) => {
		const queryClient = useQueryClient()
		const [action, setAction] = useState<ResourceAction>(null)

		const fileId = id

		const { data } = useQuery({
			queryKey: ['downloadUrl', fileId],
			queryFn: () => getDownloadUrl(fileId),
			enabled: !!fileId,
		})

		const deleteFile = useMutation({
			mutationFn: moveToTrash,
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['FILES'] })
				queryClient.invalidateQueries({ queryKey: ['home-folders'] })
				queryClient.invalidateQueries({ queryKey: ['root-folders'] })
			},
		})

		const onDeleteFile = () => {
			if (fileId) {
				deleteFile.mutate({ id: fileId, type: 'file' })
			}
		}
		return (
			<Popover>
				<PopoverContext.Consumer>
					{context => (
						<>
							<div
								ref={ref}
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
								{(name.endsWith('.jpg') ||
									name.endsWith('.jpeg') ||
									name.endsWith('.png') ||
									name.endsWith('.svg')) && imagePreview ? (
									<Image
										src={imagePreview}
										alt={name}
										width={70}
										height={70}
										unoptimized
										className='rounded-md'
									/>
								) : name.endsWith('.docx') ? (
									<FilePen size={70} className='text-blue-600' />
								) : name.endsWith('.pdf') ? (
									<FileText size={70} className='text-red-600' />
								) : name.endsWith('.mp4') || name.endsWith('.mp3') ? (
									<FilePlay size={70} className='text-green-600' />
								) : (
									<FileIcon size={70} className='text-foreground' />
								)}

								<div className='text-center text-sm font-medium leading-tight line-clamp-2 wrap-break-word w-full mt-2'>
									{name}
								</div>
							</div>
							<PopoverContent isContextMenu>
								<ContextMenuContent
									onDelete={onDeleteFile}
									downloadUrl={data?.downloadUrl}
									onRename={() => setAction('rename')}
									onMove={() => setAction('move')}
								/>
							</PopoverContent>
							<ResourceActionsDialogs
								id={id}
								type='file'
								name={name}
								action={action}
								onClose={() => setAction(null)}
							/>
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
// 								className='flex items-center w-full border-border py-2 border-b px-4 hover:bg-muted'
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
// 										<File size={25} className='text-foreground' />
// 									)}
// 									<div className='overflow-wrap'>{fileName}</div>
// 								</div>

// 								<div className='flex items-center gap-2 w-[20%]'>
// 									<div className='w-8 h-8 rounded-full overflow-hidden flex items-center justify-center border border-border'>
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
// 									<EllipsisVertical size={25} className='text-muted-foreground' />
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
