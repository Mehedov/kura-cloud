'use client'

import {
	Check,
	ChevronDown,
	File,
	FileImage,
	FilePen,
	FilePlay,
	FileText,
	TextAlignStart,
} from 'lucide-react'
import { useState } from 'react'
import { ListingType } from '../ui/ListingType'
import { Popover } from '../ui/popover/popover'
import { PopoverContent } from '../ui/popover/popover-content'
import { PopoverTrigger } from '../ui/popover/popover-trigger'
import { FolderIcon } from '@/assets/icons/FolderIcon'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getFolderContent } from '@/services/folder.service'
import { FileGrid } from '../elements/file/file'
import { BreadcrumbBasic } from '../ui/breadcrumbs/breadcrumb'
import {
	EmptyState,
	ErrorState,
	LoadingState,
} from '../ui/states/async-state'

export function FolderOneTemplate() {
	const [activeBtn, setActiveBtn] = useState<'menu' | 'grid'>('grid')
	const searchParams = useSearchParams()
	const folderId = searchParams.get('id')
	const {
		data: folderContent,
		isPending,
		isError,
		error,
		refetch,
	} = useQuery({
		queryKey: ['FILES', folderId],
		queryFn: () => getFolderContent(folderId ?? ''),
		enabled: !!folderId,
	})

	const files = folderContent?.data.files ?? []
	const fileCards = files.map(file => (
		<FileGrid
			name={file.name}
			id={file.id}
			key={file.id}
			imagePreview={file.thumbnailUrl}
		/>
	))

	if (!folderId)
		return (
			<EmptyState
				title='Папка не выбрана'
				description='Вернитесь к списку папок и выберите нужную.'
			/>
		)
	if (isPending) return <LoadingState title='Загружаем содержимое папки' />
	if (isError)
		return <ErrorState description={error.message} onRetry={() => void refetch()} />
	if (files.length === 0)
		return (
			<EmptyState
				title='В этой папке пока нет файлов'
				description='Загрузите файл, чтобы он появился здесь.'
			/>
		)

	return (
		<section className='h-full flex flex-col'>
			<div className='flex items-center justify-between mb-5'>
				<BreadcrumbBasic />
			</div>
			<div className='flex justify-between items-center mb-2'>
				<div className='flex gap-2 items-center'>
					<Popover>
						<PopoverTrigger>
							<button className='w-40 flex items-center gap-2 border border-border rounded-lg px-4 py-1 cursor-pointer hover:bg-muted duration-100 font-normal'>
								По названию <ChevronDown size={15} />
							</button>
						</PopoverTrigger>
						<PopoverContent className='w-45 '>
							<div className='flex flex-col gap-3 items-start w-full'>
								<div className='flex justify-start items-center gap-2 hover:bg-muted w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									<Check size={20} className='text-foreground' /> Названию
								</div>
								<div className='flex justify-start items-center gap-2 hover:bg-muted w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									Типу
								</div>
								<div className='flex justify-start items-center gap-2 hover:bg-muted w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									Размеру
								</div>
								<div className='flex justify-start items-center gap-2 hover:bg-muted w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									Дате изменения
								</div>
							</div>
						</PopoverContent>
					</Popover>
					<Popover>
						<PopoverTrigger>
							<button className='flex items-center gap-2 border border-border rounded-lg px-4 py-1 cursor-pointer hover:bg-muted duration-100 font-normal'>
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
							<button className='flex items-center gap-2 border border-border rounded-lg px-4 py-1 cursor-pointer hover:bg-muted duration-100 font-normal'>
								<File size={18} className='text-foreground' />
								Тип <ChevronDown size={15} />
							</button>
						</PopoverTrigger>
						<PopoverContent className='w-45 '>
							<div className='flex flex-col gap-3 items-start w-full'>
								<div className='flex justify-between items-center bg-muted  hover:bg-muted w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									<div className='flex items-center gap-2'>
										<FolderIcon size={20} color='#525252' /> Папки
									</div>
									<Check size={20} className='text-foreground' />
								</div>
								<div className='flex justify-start items-center gap-2 hover:bg-muted w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									<FileImage size={20} className='text-red-600' />
									Изображения
								</div>
								<div className='flex justify-start items-center gap-2 hover:bg-muted w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									<FileText size={20} className='text-red-600' />
									Файлы PDF
								</div>
								<div className='flex justify-start items-center gap-2 hover:bg-muted w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									<File size={20} className='text-foreground' />
									Файлы
								</div>
								<div className='flex justify-start items-center gap-2 hover:bg-muted w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
									<FilePlay size={20} className='text-green-600' /> Видео
								</div>
								<div className='flex justify-start items-center gap-2 hover:bg-muted w-full cursor-pointer px-2 py-1 rounded-lg text-sm'>
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
					<div className='w-full border-b border-border p-3 flex'>
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
					<div className='flex w-full flex-col'>
						{files.map(file => (
							<div
								key={file.id}
								className='flex items-center border-b border-border px-3 py-2 text-sm'
							>
								{file.name}
							</div>
						))}
					</div>
				</div>
			) : (
				<div className='flex items-start gap-6 flex-wrap mt-5'>
					{fileCards}
				</div>
			)}
		</section>
	)
}
