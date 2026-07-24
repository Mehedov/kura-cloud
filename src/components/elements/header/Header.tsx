import { Button } from '@/components/ui/button/Button'
import Input from '@/components/ui/input/input'
import { ThemeToggle } from '@/components/elements/theme-toggle/theme-toggle'
import { Bell, Plus, Search } from 'lucide-react'

export function Header() {
	return (
		<header className='mb-6'>
			<div className='flex items-center justify-between'>
				<Input Icon={Search} className='w-[45%]' placeholder='Search...' />

				<div className='flex items-center gap-3'>
					<ThemeToggle />
					<Button
						variant='outline'
						className='p-2'
					>
						<Bell />
					</Button>
					<Button className='px-3'>
						<Plus /> Invite member
					</Button>
				</div>
			</div>
		</header>
	)
}
