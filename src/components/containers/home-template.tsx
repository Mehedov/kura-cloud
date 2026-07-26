'use client'

import { FolderPlus, UploadCloud } from 'lucide-react'
import { Button } from '../ui/button/Button'
import useDropzone from '@/store/store'
import useDropzoneStore from '@/store/store'
import useAuthStore from '@/store/auth'
import HomeFolders from '../elements/home-folders/home-folders'
import SuggestedFolders from '../elements/suggested-folders/suggested-folders'
import { HomeFiles } from '../elements/home-files/home-files'

interface HomeTemplatesProps {
	breadcrumbsRoutes?: string[]
}

export default function HomeTemplate({}: HomeTemplatesProps) {
	const { setIsOpenDropzone } = useDropzone(state => state)
	const { setIsOpenCreateFolder } = useDropzoneStore(state => state)

	const { user } = useAuthStore()

	return (
		<section className='flex flex-col gap-8 w-full'>
			<section className='flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-2xl font-semibold text-foreground'>
						Welcome back, {user?.name}
					</h1>
					<p className='text-sm text-muted-foreground'>
						Welcome back! Let’s continue your activity on the dashboard.
					</p>
				</div>

				<div className='grid grid-cols-1 gap-3 sm:flex sm:flex-wrap'>
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
			<SuggestedFolders />
			<HomeFiles />
		</section>
	)
}
