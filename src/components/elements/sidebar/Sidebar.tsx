'use client'
import { FolderIcon } from '@/assets/icons/FolderIcon'
import { PAGES } from '@/config/page.config'
import useAuthStore from '@/store/auth'
import useDropzoneStore from '@/store/store'
import { cn } from '@/utils/cn'
import {
	ChevronLeft,
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
	X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Sidebar() {
	const { user } = useAuthStore()
	const {
		isSidebarOpen,
		isSidebarCollapsed,
		setIsSidebarOpen,
		toggleSidebarCollapsed,
	} = useDropzoneStore()
	const NAV_ITEMS = [
		{
			href: '/',
			label: 'All files',
			icon: LayoutGrid,
		},
		{
			href: '/photos',
			label: 'Photo',
			icon: ImageIcon,
		},
		{ href: '/favorite', label: 'Favorite', icon: Star },
		{
			href: '/shared',
			label: 'Shared Files',
			icon: Share,
		},
		{
			href: '/basket',
			label: 'Delete files',
			icon: Trash2Icon,
		},
		{
			href: '/settings',
			label: 'Settings',
			icon: Settings,
		},
	] as const
	const pathname = usePathname()
	const { setIsOpenProfile } = useDropzoneStore(state => state)
	const closeSidebar = () => setIsSidebarOpen(false)

	return (
		<>
			{isSidebarOpen && (
				<button
					className='fixed inset-0 z-30 bg-black/40 lg:hidden'
					onClick={closeSidebar}
					aria-label='Close navigation'
				/>
			)}
			<aside
				className={cn(
					'fixed inset-y-0 left-0 z-40 flex h-full shrink-0 flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar p-layout shadow-xl transition-all duration-200 lg:static lg:z-auto lg:translate-x-0 lg:shadow-none',
					isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
					isSidebarCollapsed ? 'w-18' : 'w-72',
				)}
			>
				<div className='mb-3 flex items-center justify-between border-b border-sidebar-border pb-4'>
					<Link href={PAGES.home} onClick={closeSidebar}>
						<div className='flex items-center gap-1.5'>
							<CloudyIcon size={25} className='shrink-0 text-[#F0A84B]' />
							{!isSidebarCollapsed && (
								<span className='whitespace-nowrap text-xl font-medium text-sidebar-foreground'>
									Kura Drive
								</span>
							)}
						</div>
					</Link>
					<button
						className='rounded p-1 text-muted-foreground hover:bg-sidebar-accent lg:hidden'
						onClick={closeSidebar}
						aria-label='Close navigation'
					>
						<X size={20} />
					</button>
					<button
						className='hidden rounded p-1 text-muted-foreground hover:bg-sidebar-accent lg:block'
						onClick={toggleSidebarCollapsed}
						aria-label={isSidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
					>
						{isSidebarCollapsed ? <ChevronRightIcon size={20} /> : <ChevronLeft size={20} />}
					</button>
				</div>

			<button
				className='mb-5 flex items-center justify-between border-b border-sidebar-border pb-4 text-left'
				onClick={() => setIsOpenProfile(true)}
			>
				<div className='flex items-center gap-2'>
					<div className='flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-sidebar-border'>
						{/* <Image src={avatar} alt='avatar' className='object-cover' /> */}
						<User />
					</div>
					{!isSidebarCollapsed && <div>
						<div className='font-medium text-sm'>{user?.name}</div>
						<div className='text-neutral-600 text-xs font-medium'>
							{user?.email}
						</div>
					</div>}
				</div>
				{!isSidebarCollapsed && (
					<ChevronRightIcon className='text-neutral-500' size={20} />
				)}
			</button>

			<nav className='border-b border-sidebar-border pb-2'>
				<ul className='flex flex-col gap-1'>
					{NAV_ITEMS.map(item => (
						<li key={item.label}>
							<Link
								className={cn(
									'flex items-center gap-2.5 rounded-md p-3 text-md font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
									pathname === item.href && 'bg-sidebar-primary text-sidebar-primary-foreground',
								)}
								href={item.href}
								onClick={closeSidebar}
								title={isSidebarCollapsed ? item.label : undefined}
							>
								<item.icon
									className={pathname === item.href ? 'text-white' : ''}
									size={20}
								/>
								{!isSidebarCollapsed && item.label}
							</Link>
						</li>
					))}
				</ul>
			</nav>
			{!isSidebarCollapsed && <div className='mb-2 p-3 text-md font-normal text-muted-foreground'>
				<div className='mb-4 font-medium'>Folders</div>
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
			</div>}
			{!isSidebarCollapsed && <div className='mt-auto rounded-md border border-sidebar-border bg-card p-2'>
				<div className='mb-1 border-b border-sidebar-border pb-2'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2 text-[13px]'>
							<Square size={15} className='text-red-600' /> Photo
						</div>
						<span className='text-[14px] font-medium text-muted-foreground'>
							11 GB
						</span>
					</div>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2 text-[13px]'>
							<Square size={15} className='text-green-600' /> Video
						</div>
						<span className='text-[14px] font-medium text-muted-foreground'>
							19 GB
						</span>
					</div>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2 text-[13px]'>
							<Square size={15} className='text-blue-600' /> Document
						</div>
						<span className='text-[14px] font-medium text-muted-foreground'>
							25 GB
						</span>
					</div>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2 text-[13px]'>
							<Square size={15} className='text-neutral-600' /> Free Storage
						</div>
						<span className='text-[14px] font-medium text-muted-foreground'>
							45 GB
						</span>
					</div>
				</div>

				<div className='text-[13px] mb-1'>
					<span className='font-medium text-muted-foreground'>
						<span className='text-foreground'>56GB used </span>
						of 100GB
					</span>
				</div>
				<div className='w-full h-2 bg-linear-to-r from-neutral-500 to-neutral-800 rounded-4xl'></div>
			</div>}
			</aside>
		</>
	)
}
