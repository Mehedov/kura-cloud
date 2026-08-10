'use client'
import { FolderIcon } from '@/shared/assets/icons/FolderIcon'
import { FolderAvatarStack } from '@/entities/folder/ui/FolderGrid'
import { PAGES } from '@/shared/config/page.config'
import { FOLDER_KEYS } from '@/shared/config/query-keys'
import { getSuggestedFolders } from '@/entities/folder/api/folder.queries'
import { getStorageStats } from '@/entities/storage/api/storage.queries'
import useAuthStore from '@/entities/session/model/session.store'
import useDropzoneStore from '@/widgets/app-shell/model/sidebar.store'
import { useModalStore } from '@/widgets/global-modals/model/modal.store'
import { cn } from '@/shared/lib/cn'
import { Avatar } from '@/shared/ui/avatar/Avatar'
import { useQuery } from '@tanstack/react-query'
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
	X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
		label: 'Корзина',
		icon: Trash2Icon,
	},
	{
		href: PAGES.settings,
		label: 'Settings',
		icon: Settings,
	},
] as const

const CATEGORY_COLORS = {
	Photo: 'text-red-600',
	Video: 'text-green-600',
	Document: 'text-blue-600',
	'Other files': 'text-amber-600',
	'Free Storage': 'text-muted-foreground',
} as const

export function Sidebar() {
	const { user } = useAuthStore()
	const {
		isSidebarOpen,
		isSidebarCollapsed,
		setIsSidebarOpen,
		toggleSidebarCollapsed,
	} = useDropzoneStore()

	const pathname = usePathname()
	const { setIsOpenProfile } = useModalStore(state => state)
	const closeSidebar = () => setIsSidebarOpen(false)
	const { data: suggestedFoldersData } = useQuery({
		queryKey: FOLDER_KEYS.suggestedForUser(user?.id ?? ''),
		queryFn: getSuggestedFolders,
		enabled: Boolean(user?.id),
	})
	const { data: storageStatsData } = useQuery({
		queryKey: FOLDER_KEYS.storageStats,
		queryFn: getStorageStats,
	})
	const suggestedFolders = suggestedFoldersData?.data.items ?? []
	const storageStats = storageStatsData

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
					'fixed inset-y-0 left-0 z-40 flex h-full shrink-0 flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar p-layout shadow-xl transition-[transform,width] duration-200 lg:static lg:z-auto lg:translate-x-0 lg:shadow-none',
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
						aria-label={
							isSidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'
						}
					>
						{isSidebarCollapsed ? (
							<ChevronRightIcon size={20} />
						) : (
							<ChevronLeft size={20} />
						)}
					</button>
				</div>

				<button
					className='mb-5 flex items-center justify-between border-b border-sidebar-border pb-4 text-left'
					onClick={() => setIsOpenProfile(true)}
				>
					<div className='flex items-center gap-2'>
						<Avatar
							name={user?.name}
							avatarUrl={user?.avatarUrl}
							avatarColor={user?.avatarColor}
							id={user?.id}
							className='size-10 border border-sidebar-border text-sm text-white'
						/>
						{!isSidebarCollapsed && (
							<div>
								<div className='font-medium text-sm'>{user?.name}</div>
								<div className='text-foreground text-xs font-medium'>
									{user?.email}
								</div>
							</div>
						)}
					</div>
					{!isSidebarCollapsed && (
						<ChevronRightIcon className='text-muted-foreground' size={20} />
					)}
				</button>

				<nav className='border-b border-sidebar-border pb-2'>
					<ul className='flex flex-col gap-1'>
						{NAV_ITEMS.map(item => (
							<li key={item.label}>
								<Link
									className={cn(
										'flex items-center gap-2.5 rounded-md p-3 text-md font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
										pathname === item.href &&
											'bg-sidebar-primary text-sidebar-primary-foreground',
									)}
									href={item.href}
									onClick={closeSidebar}
									title={isSidebarCollapsed ? item.label : undefined}
								>
									<item.icon
										className={
											pathname === item.href
												? 'text-sidebar-primary-foreground'
												: ''
										}
										size={20}
									/>
									{!isSidebarCollapsed && item.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
				{!isSidebarCollapsed && (
					<div className='mb-2 p-3 text-md font-normal text-muted-foreground'>
						<div className='mb-4 font-medium'>Недавние папки</div>
						{suggestedFolders.length > 0 ? (
							<ul className='flex flex-col gap-2.5'>
								{suggestedFolders.map(folder => (
									<li key={folder.id}>
										<Link
											className='relative flex min-w-0 items-center gap-2.5 hover:text-foreground'
											href={`${PAGES.folders}/${folder.id}`}
											onClick={closeSidebar}
										>
											<FolderAvatarStack collaborators={folder.collaborators} />
											<FolderIcon size={25} />
											<span className='truncate'>{folder.name}</span>
										</Link>
									</li>
								))}
							</ul>
						) : (
							<p className='text-sm'>Папок пока нет</p>
						)}
					</div>
				)}
				{!isSidebarCollapsed && (
					<div className='mt-auto rounded-md border border-sidebar-border bg-card p-2'>
						<div className='mb-1 border-b border-sidebar-border pb-2'>
							{storageStats?.categories.map(category => (
								<div
									key={category.label}
									className='flex items-center justify-between'
								>
									<div className='flex items-center gap-2 text-[13px]'>
										<Square
											size={15}
											className={CATEGORY_COLORS[category.label]}
										/>
										{category.label}
									</div>
									<span className='text-[14px] font-medium text-muted-foreground'>
										{category.formattedValue}
									</span>
								</div>
							))}
						</div>

						<div className='mb-1 text-[13px]'>
							<span className='font-medium text-muted-foreground'>
								<span className='text-foreground'>
									{storageStats
										? `${storageStats.total.usedFormatted} занято `
										: 'Загрузка…'}
								</span>
								{storageStats && `из ${storageStats.total.limitFormatted}`}
							</span>
						</div>
						<div className='h-2 w-full overflow-hidden rounded-4xl bg-muted'>
							<div
								className='h-full rounded-4xl bg-primary transition-[width]'
								style={{
									width: `${storageStats?.total.percent ?? 0}%`,
								}}
							/>
						</div>
					</div>
				)}
			</aside>
		</>
	)
}
