import InDev from '@/components/ui/in-dev/in-dev'
import { Bell, Plus, Search } from 'lucide-react'

interface Props {}

export function Header({}: Props) {
	return (
		<header className='mb-6'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2 border border-neutral-200 p-2 w-[45%] rounded-lg'>
					<Search className='text-neutral-400' />
					<input
						type='text'
						placeholder='Search'
						className='text-neutral-600 text-md placeholder:font-medium w-full outline-0'
					/>
				</div>
				<div className='flex items-center gap-3'>
					<button className='p-2 border border-neutral-200 rounded-lg'>
						<Bell className='text-neutral-600' />
					</button>
					<InDev>
						<button className='flex items-center gap-2 bg-neutral-700 text-white font-medium px-3 py-2 rounded-lg'>
							<Plus /> Invite member
						</button>
					</InDev>
				</div>
			</div>
		</header>
	)
}
