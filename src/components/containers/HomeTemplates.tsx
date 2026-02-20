import { FolderIcon } from '@/assets/icons/FolderIcon'
import {
	Clock,
	EllipsisVertical,
	FolderClosed,
	FolderPlus,
	Funnel,
	Plus,
	Search,
	Star,
	UploadCloud,
} from 'lucide-react'
import Link from 'next/link'
import { Title } from '../ui/Title'
import { YourTable } from '../ui/YourTable'
import { Button } from '../ui/button/Button'

interface HomeTemplatesProps {
	breadcrumbsRoutes?: string[]
}

const folderNames = [
	'UI UX Design',
	'Documentation',
	'Marketing MaterialsMaterials',
	'Financial Reports',
	'Client Presentations',
	'Source Code',
	'Database Backups',
	'API Documentation',
	'User Research',
	'Product Roadmap',
	'Meeting Notes',
	'Design Assets',
	'Quality Assurance',
	'Deployment Scripts',
	'Configuration Files',
	'Test Results',
	'Analytics Reports',
	'Security Policies',
	'User Manuals',
	'Training Materials',
]

export const HomeTemplates = ({
	breadcrumbsRoutes = [],
}: HomeTemplatesProps) => {
	const foldersRender = () => {
		return folderNames.slice(0, 10).map((_, index) => {
			return (
				<Link
					href={`/folders/${_.toLowerCase()
						.replace(/\s+/g, '-')
						.replace(/[^a-z0-9-]/g, '')}`}
					key={index}
					className='flex justify-between items-center w-[256px] bg-neutral-50 rounded-lg border border-gray-200 px-4 py-3'
				>
					<div className='flex items-center gap-2'>
						<FolderClosed size={20} />
						<span className='text-neutral-700 line-clamp-1'>{_}</span>
					</div>
					<EllipsisVertical className='text-neutral-700' />
				</Link>
			)
		})
	}

	return (
		<section className='flex flex-col gap-8 w-full'>
			<section className='flex flex-wrap items-center justify-between gap-4'>
				<Title
					title='Welcome back, Mehedov Nikolay'
					description='Welcome back! Let’s continue your activity on the dashboard.'
				/>

				<div className='flex flex-wrap gap-3'>
					<Button variant='primary' className=' h-13'>
						<Plus size={20} /> Create
					</Button>
					<Button variant='primary' className='h-13'>
						<UploadCloud size={20} /> Upload or drop
					</Button>
					<Button variant='primary' className='h-13'>
						<FolderPlus size={20} /> Create folder
					</Button>
				</div>
			</section>
			<section>
				<h2 className='text-md text-neutral-900 font-medium mb-4'>
					Folders
					{folderNames.length > 10 && (
						<Link
							href='/folders'
							className='ml-3 text-xs text-neutral-500 duration-200 ease-in-out hover:text-neutral-600'
						>
							more {folderNames.length - 10}...
						</Link>
					)}
				</h2>
				<div className='flex items-center flex-wrap gap-4'>
					{foldersRender()}
				</div>
			</section>
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
						<Button variant='primary'>
							<Clock size={20} /> Recent
						</Button>
						<Button variant='primary'>
							<Star size={20} /> Starred
						</Button>
					</div>
					<div className='flex items-center gap-5'>
						<Button variant='primary'>
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
