import { Button } from '@/shared/ui/button/Button'
import Input from '@/shared/ui/input/input'
import { ThemeToggle } from '@/shared/theme/ui/ThemeToggle'
import { LanguageToggle } from '@/shared/language/ui/LanguageToggle'
import useLanguage from '@/shared/language/model'
import useDropzoneStore from '@/widgets/app-shell/model/sidebar.store'
import { Bell, Menu, Plus, Search } from 'lucide-react'

export function Header() {
	const { toggleSidebar } = useDropzoneStore()
	const { openNavigation, search, inviteMember, notifications } = useLanguage(state => state.t)

	return (
		<header className='mb-6'>
			<div className='flex items-center justify-between'>
				<div className='flex flex-1 items-center gap-2 lg:max-w-[45%]'>
					<Button
						variant='outline'
						className='p-2 lg:hidden'
						onClick={toggleSidebar}
						aria-label={openNavigation}
					>
						<Menu size={20} />
					</Button>
					<Input Icon={Search} placeholder={search} />
				</div>

				<div className='ml-3 flex items-center gap-2 sm:gap-3'>
					<LanguageToggle />
					<ThemeToggle />
					<Button
						variant='outline'
						className='p-2'
						aria-label={notifications}
					>
						<Bell />
					</Button>
					<Button className='hidden px-3 sm:flex'>
						<Plus /> <span>{inviteMember}</span>
					</Button>
				</div>
			</div>
		</header>
	)
}
