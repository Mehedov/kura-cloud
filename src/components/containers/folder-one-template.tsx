'use client'

import {
	Check,
	ChevronDown,
	EllipsisVertical,
	File,
	FileImage,
	FilePen,
	FilePlay,
	FileText,
	TextAlignStart,
	User,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { ListingType } from '../ui/ListingType'
import { Popover, PopoverContext } from '../ui/popover/popover'
import { PopoverContent } from '../ui/popover/popover-content'
import { PopoverTrigger } from '../ui/popover/popover-trigger'
import { FolderIcon } from '@/assets/icons/FolderIcon'
import { useParams, useSearchParams } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getFolderContent, hardDeleteFolder } from '@/services/folder.service'
import { ContextMenuContent } from '../elements/folder/folder'
import { FOLDER_KEYS } from '@/constants/queryKeys'
import { FileGrid } from '../elements/file/file'
import { Breadcrumb } from '../ui/breadcrumb'
import { BreadcrumbBasic } from '../ui/breadcrumbs/breadcrumb'

interface FoldersTemplateProps {
	breadcrumbsRoutes?: string[]
}

export function FolderOneTemplate({
	breadcrumbsRoutes = [],
}: FoldersTemplateProps) {
	const [activeBtn, setActiveBtn] = useState<'menu' | 'grid'>('grid')
	const searchParams = useSearchParams()
	const params = useParams()
	const folderId = searchParams.get('id')
	console.log(params)
	const { data: folderContent, isLoading } = useQuery({
		queryKey: ['FILES', folderId],
		queryFn: () => getFolderContent(folderId),
		enabled: !!folderId,
	})

	const renderFoldersArray = useMemo(() => {
		return folderContent?.data.files.map((file, index) => {
			// const fileName = file.name
			// const date = file.createdAt
			// const size = file.size
			// const owner = file.name

			if (activeBtn == 'grid') {
				return (
					<FileGrid
						name={file.name}
						id={file.id}
						key={file.id}
						imagePreview={file.thumbnailUrl}
					/>
				)
			}
		})
	}, [activeBtn, folderContent])

	if (isLoading) return 'Loading..'

	return (
		<section className='h-full flex flex-col'>
			<div className='flex items-center justify-between mb-5'>
				<BreadcrumbBasic />
			</div>
			<div className='flex justify-between items-center mb-2'>
				<div className='flex gap-2 items-center'>
					<Popover>
						<PopoverTrigger>
							<button className='w-40 flex items-center gap-2 border border-neutral-500 rounded-lg px-4 py-1 cursor-pointer hover:bg-neutral-100 duration-100 font-normal'>
								По названию <ChevronDown size={15} />
							</button>
						</PopoverTrigger>
						<PopoverContent className='w-45 '>
							<div className='flex flex-col gap-3 items-start w-full'>
								<div className='flex justify-start items-center gap-2 hover:bg-neutral-50 w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									<Check size={20} className='text-neutral-600' /> Названию
								</div>
								<div className='flex justify-start items-center gap-2 hover:bg-neutral-50 w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									Типу
								</div>
								<div className='flex justify-start items-center gap-2 hover:bg-neutral-50 w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									Размеру
								</div>
								<div className='flex justify-start items-center gap-2 hover:bg-neutral-50 w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									Дате изменения
								</div>
							</div>
						</PopoverContent>
					</Popover>
					<Popover>
						<PopoverTrigger>
							<button className='flex items-center gap-2 border border-neutral-500 rounded-lg px-4 py-1 cursor-pointer hover:bg-neutral-100 duration-100 font-normal'>
								Люди <ChevronDown size={15} />
							</button>
						</PopoverTrigger>
						<PopoverContent className='w-60 '>
							<div className='grid gap-4'>
								<div className='space-y-2'>
									<h4 className='leading-none font-medium'>Dimensions</h4>
									<p className='text-muted-foreground text-sm'>
										Set the dimensions for the layer.
									</p>
								</div>
								<div className='grid gap-2'>
									<div className='grid grid-cols-3 items-center gap-4'></div>
									<div className='grid grid-cols-3 items-center gap-4'></div>
									<div className='grid grid-cols-3 items-center gap-4'></div>
									<div className='grid grid-cols-3 items-center gap-4'></div>
								</div>
							</div>
						</PopoverContent>
					</Popover>
					<Popover>
						<PopoverTrigger>
							<button className='flex items-center gap-2 border border-neutral-500 rounded-lg px-4 py-1 cursor-pointer hover:bg-neutral-100 duration-100 font-normal'>
								<File size={18} className='text-neutral-600' />
								Тип <ChevronDown size={15} />
							</button>
						</PopoverTrigger>
						<PopoverContent className='w-45 '>
							<div className='flex flex-col gap-3 items-start w-full'>
								<div className='flex justify-between items-center bg-neutral-100  hover:bg-neutral-100 w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									<div className='flex items-center gap-2'>
										<FolderIcon size={20} color='#525252' /> Папки
									</div>
									<Check size={20} className='text-neutral-600' />
								</div>
								<div className='flex justify-start items-center gap-2 hover:bg-neutral-50 w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									<FileImage size={20} className='text-red-600' />
									Изображения
								</div>
								<div className='flex justify-start items-center gap-2 hover:bg-neutral-50 w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									<FileText size={20} className='text-red-600' />
									Файлы PDF
								</div>
								<div className='flex justify-start items-center gap-2 hover:bg-neutral-50 w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									<File size={20} className='text-neutral-600' />
									Файлы
								</div>
								<div className='flex justify-start items-center gap-2 hover:bg-neutral-50 w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									<FilePlay size={20} className='text-green-600' /> Видео
								</div>
								<div className='flex justify-start items-center gap-2 hover:bg-neutral-50 w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									<FilePen size={20} className='text-blue-600' />
									Документы
								</div>
							</div>
						</PopoverContent>
					</Popover>
				</div>

				<ListingType activeBtn={activeBtn} setActiveBtn={setActiveBtn} />
			</div>
			{activeBtn === 'menu' ? (
				<div className='flex flex-col'>
					<div className='w-full border-b border-neutral-400 p-3 flex'>
						<div className='w-[40%] font-normal'>Название</div>
						<div className='w-[20%] font-normal'>Владелец</div>
						<div className='w-[15%] font-normal'>Дата изменения</div>
						<div className='w-[15%] font-normal'>Размер</div>
						<div className='w-[10%]'>
							<Popover>
								<PopoverTrigger>
									<button className='flex items-center gap-2 cursor-pointer font-normal'>
										<TextAlignStart />
										Сортировка
									</button>
								</PopoverTrigger>
								<PopoverContent className='w-60  right-0'>
									<div className='grid gap-4'>
										<div className='space-y-2'>
											<h4 className='leading-none font-medium'>Dimensions</h4>
											<p className='text-muted-foreground text-sm'>
												Set the dimensions for the layer.
											</p>
										</div>
										<div className='grid gap-2'>
											<div className='grid grid-cols-3 items-center gap-4'></div>
											<div className='grid grid-cols-3 items-center gap-4'></div>
											<div className='grid grid-cols-3 items-center gap-4'></div>
											<div className='grid grid-cols-3 items-center gap-4'></div>
										</div>
									</div>
								</PopoverContent>
							</Popover>
						</div>
					</div>
					<div className='flex flex-col items-center'>{renderFolders()}</div>
				</div>
			) : (
				<div className='flex items-start gap-6 flex-wrap mt-5'>
					{renderFoldersArray}
				</div>
			)}
		</section>
	)
}
