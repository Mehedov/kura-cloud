import { Button } from '@/components/ui/button/Button'
import Input from '@/components/ui/input/input'
import { Bell, Plus, Search } from 'lucide-react'

export function Header() {
	return (
		<header className='mb-6'>
			<div className='flex items-center justify-between'>
				<Input Icon={Search} className='w-[45%]' placeholder='Search...' />

				<div className='flex items-center gap-3'>
					<Button
						variant='outline'
						className='p-2 border border-neutral-200 rounded-lg'
					>
						<Bell className='text-neutral-600' />
					</Button>
					<Button className='flex items-center gap-2 bg-neutral-700 text-white font-medium px-3 py-2 rounded-lg'>
						<Plus /> Добавить участника
					</Button>
				</div>
			</div>
		</header>
	)
}
