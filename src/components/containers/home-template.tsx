'use client'

import { FolderIcon } from '@/assets/icons/FolderIcon'
import {
	Clock,
	FolderPlus,
	Funnel,
	Search,
	Star,
	UploadCloud,
} from 'lucide-react'
import { YourTable } from '../ui/YourTable'
import { Button } from '../ui/button/Button'
import useDropzone from '@/store/store'
import useDropzoneStore from '@/store/store'
import useAuthStore from '@/store/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Cookies from 'js-cookie'
import HomeFolders from '../elements/home-folders/home-folders'

interface HomeTemplatesProps {
	breadcrumbsRoutes?: string[]
}

export default function HomeTemplate({}: HomeTemplatesProps) {
	const { setIsOpenDropzone } = useDropzone(state => state)
	const { setIsOpenCreateFolder } = useDropzoneStore(state => state)

	const { user } = useAuthStore()

	return (
		<section className='flex flex-col gap-8 w-full'>
			<section className='flex flex-wrap items-center justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-semibold text-neutral-700'>
						Welcome back, {user?.name}
					</h1>
					<p className='text-sm text-neutral-500'>
						Welcome back! Let’s continue your activity on the dashboard.
					</p>
				</div>

				<div className='flex flex-wrap gap-3'>
					<Button
						variant='secondary'
						className='h-13'
						onClick={() => setIsOpenDropzone(true)}
					>
						<UploadCloud size={20} /> Upload or drop
					</Button>
					<Button
						variant='secondary'
						className='h-13'
						onClick={() => setIsOpenCreateFolder(true)}
					>
						<FolderPlus size={20} /> Create folder
					</Button>
				</div>
			</section>
			<HomeFolders />
			<section>
				<h2 className='text-md text-neutral-900 font-medium mb-4'>
					Suggested from your activity
				</h2>
				<div className='flex items-center justify-between'>
					<div className='w-[23%] flex justify-center flex-col items-center p-5 bg-neutral-50 rounded-lg border border-gray-200'>
						<FolderIcon size={150} />
						<p className='text-center'>DOCX</p>
					</div>
					<div className='w-[23%] flex justify-center flex-col items-center p-5 bg-neutral-50 rounded-lg border border-gray-200'>
						<FolderIcon size={150} />
						<p>JPG</p>
					</div>
					<div className='w-[23%] flex justify-center flex-col items-center p-5 bg-neutral-50 rounded-lg border border-gray-200'>
						<FolderIcon size={150} />
						<p>PDF</p>
					</div>
					<div className='w-[23%] flex justify-center flex-col items-center p-5 bg-neutral-50 rounded-lg border border-gray-200'>
						<FolderIcon size={150} />
						<p>PNG</p>
					</div>
				</div>
			</section>
			<section>
				<h2 className='text-md text-neutral-900 font-medium mb-4'>Your File</h2>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center gap-5'>
						<Button variant='secondary'>
							<Clock size={20} /> Recent
						</Button>
						<Button variant='secondary'>
							<Star size={20} /> Starred
						</Button>
					</div>
					<div className='flex items-center gap-5'>
						<Button variant='secondary'>
							<Funnel size={20} /> Filter
						</Button>

						<div className='flex items-center gap-2 border bg-neutral-50 text-neutral-700 border-gray-200 px-2 py-2 w-60 rounded-lg'>
							<Search className='text-neutral-700' />
							<input
								type='text'
								placeholder='Search file...'
								className='text-neutral-700 text-md placeholder:font-medium placeholder:text-neutral-700 w-full outline-0'
							/>
						</div>
					</div>
				</div>
				<YourTable />
			</section>
		</section>
	)
}
