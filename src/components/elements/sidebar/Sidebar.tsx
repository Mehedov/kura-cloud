import { FolderIcon } from '@/assets/icons/FolderIcon'
import { PAGES } from '@/config/page.config'
import {
	ChevronRightIcon,
	CloudyIcon,
	ImageIcon,
	LayoutGrid,
	Settings,
	Share,
	Square,
	Star,
	Trash2Icon,
	User,
} from 'lucide-react'
import Link from 'next/link'

export function Sidebar() {
	return (
		<aside className='p-layout bg-neutral-50 w-2xs h-full flex flex-col overflow-auto'>
			<Link href={PAGES.home}>
				<div className='flex items-center gap-1.5 border-b border-neutral-200 pb-4 mb-3'>
					<CloudyIcon size={30} />
					<span className='font-medium text-black text-xl'>Kura Drive</span>
				</div>
			</Link>

			<div className='flex items-center justify-between mb-5 border-b border-neutral-200 pb-4'>
				<div className='flex items-center gap-2'>
					<div className='w-10 h-10 rounded-full overflow-hidden border border-neutral-400 flex items-center justify-center'>
						{/* <Image src={avatar} alt='avatar' className='object-cover' /> */}
						<User />
					</div>
					<div>
						<div className='font-medium text-sm'>Mehedov Nikolay</div>
						<div className='text-neutral-600 text-xs font-medium'>
							mehedov.dev@yandex.ru
						</div>
					</div>
				</div>
				<button className='cursor-pointer'>
					<ChevronRightIcon className='text-neutral-500' size={20} />
				</button>
			</div>
			<nav className='border-b border-neutral-200 pb-2'>
				<ul className='flex flex-col gap-1'>
					<li>
						<Link
							className='flex gap-2.5 items-center bg-neutral-700 text-white p-3 text-sm rounded-md font-normal'
							href='/'
						>
							<LayoutGrid className='text-white' size={20} /> All Files
						</Link>
					</li>
					<li>
						<Link
							className='flex gap-2.5 items-center text-neutral-400 p-3 text-md font-normal'
							href='/'
						>
							<ImageIcon size={20} /> Photo
						</Link>
					</li>
					<li>
						<Link
							className='flex gap-2.5 items-center text-neutral-400 p-3 text-md font-normal'
							href='/'
						>
							<Star size={20} /> Favorite
						</Link>
					</li>
					<li>
						<Link
							className='flex gap-2.5 items-center text-neutral-400 p-3 text-md font-normal'
							href='/'
						>
							<Share size={20} /> Shared Files
						</Link>
					</li>
					<li>
						<Link
							className='flex gap-2.5 items-center text-neutral-400 p-3 text-md font-normal'
							href='/'
						>
							<Trash2Icon size={20} /> Delete Files
						</Link>
					</li>
					<li>
						<Link
							className='flex gap-2.5 items-center text-neutral-400 p-3 text-md font-normal'
							href='/'
						>
							<Settings size={20} /> Settings
						</Link>
					</li>
				</ul>
			</nav>
			<div className='p-3 text-md text-neutral-400 font-normal mb-2'>
				<div className='mb-4'>Folders</div>
				<ul className='flex flex-col gap-2.5'>
					<li>
						<Link className='flex items-center gap-2.5' href='/'>
							<FolderIcon size={25} />
							Landing Page
						</Link>
					</li>
					<li>
						<Link className='flex items-center gap-2.5' href='/'>
							<FolderIcon size={25} />
							Mobile
						</Link>
					</li>
					<li>
						<Link className='flex items-center gap-2.5' href='/'>
							<FolderIcon size={25} />
							Dashboard
						</Link>
					</li>
					<li>
						<Link className='flex items-center gap-2.5' href='/'>
							<FolderIcon size={25} />
							Footer
						</Link>
					</li>
				</ul>
			</div>
			<div className='bg-white p-2 rounded-md mt-auto border border-neutral-200'>
				<div className='border-b border-neutral-200 pb-2 mb-1'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2 text-[13px]'>
							<Square size={15} className='text-red-600' /> Photo
						</div>
						<span className='text-[14px] font-medium text-neutral-500'>
							11 GB
						</span>
					</div>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2 text-[13px]'>
							<Square size={15} className='text-green-600' /> Video
						</div>
						<span className='text-[14px] font-medium text-neutral-500'>
							19 GB
						</span>
					</div>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2 text-[13px]'>
							<Square size={15} className='text-blue-600' /> Document
						</div>
						<span className='text-[14px] font-medium text-neutral-500'>
							25 GB
						</span>
					</div>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2 text-[13px]'>
							<Square size={15} className='text-neutral-600' /> Free Storage
						</div>
						<span className='text-[14px] font-medium text-neutral-500'>
							45 GB
						</span>
					</div>
				</div>

				<div className='text-[13px] mb-1'>
					<span className='text-neutral-900 font-medium'>
						<span>56GB</span> used
					</span>{' '}
					<span className='text-neutral-400'>
						of <span>100GB</span>
					</span>
				</div>
				<div className='w-full h-2 bg-linear-to-r from-neutral-500 to-neutral-800 rounded-4xl'></div>
			</div>
		</aside>
	)
}
