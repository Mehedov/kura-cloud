'use client'
import { Grid2x2, Menu } from 'lucide-react'

interface Props {
	activeBtn: 'menu' | 'grid'
	setActiveBtn: (value: 'menu' | 'grid') => void
}

export function ListingType({ activeBtn, setActiveBtn }: Props) {
	return (
		<div className='w-25 flex items-center border-2 border-neutral-200 rounded-lg h-full overflow-hidden'>
			<button
				className={`w-[50%] h-full flex items-center justify-center p-2 cursor-pointer ${
					activeBtn === 'menu' ? 'bg-neutral-600' : 'bg-transparent'
				}`}
				onClick={() => setActiveBtn('menu')}
			>
				<Menu
					size={15}
					className={activeBtn === 'menu' ? 'text-white' : 'text-neutral-600'}
				/>
			</button>
			<button
				className={`w-[50%] h-full flex items-center justify-center p-2 cursor-pointer ${
					activeBtn === 'grid' ? 'bg-neutral-600' : 'bg-transparent'
				}`}
				onClick={() => setActiveBtn('grid')}
			>
				<Grid2x2
					size={15}
					className={activeBtn === 'grid' ? 'text-white' : 'text-neutral-600'}
				/>
			</button>
		</div>
	)
}
