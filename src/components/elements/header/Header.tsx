import { Button } from '@/components/ui/button/Button'
import Input from '@/components/ui/input/input'
import { ThemeToggle } from '@/components/elements/theme-toggle/theme-toggle'
import useDropzoneStore from '@/store/store'
import { Bell, Menu, Plus, Search } from 'lucide-react'

export function Header() {
	const { toggleSidebar } = useDropzoneStore()

	return (
		<header className='mb-6'>
			<div className='flex items-center justify-between'>
				<div className='flex flex-1 items-center gap-2 lg:max-w-[45%]'>
					<Button
						variant='outline'
						className='p-2 lg:hidden'
						onClick={toggleSidebar}
						aria-label='Open navigation'
					>
						<Menu size={20} />
					</Button>
					<Input Icon={Search} placeholder='Search...' />
				</div>

				<div className='ml-3 flex items-center gap-2 sm:gap-3'>
					<ThemeToggle />
					<Button
						variant='outline'
						className='p-2'
					>
						<Bell />
					</Button>
					<Button className='hidden px-3 sm:flex'>
						<Plus /> <span>Invite member</span>
					</Button>
				</div>
			</div>
		</header>
	)
}
