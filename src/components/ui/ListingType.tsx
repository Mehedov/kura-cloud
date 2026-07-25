'use client'
import { Grid2x2, Menu } from 'lucide-react'

interface Props {
	activeBtn: 'menu' | 'grid'
	setActiveBtn: (value: 'menu' | 'grid') => void
}

export function ListingType({ activeBtn, setActiveBtn }: Props) {
	return (
		<div className='flex h-full w-25 items-center overflow-hidden rounded-lg border border-border'>
			<button
				className={`flex h-full w-[50%] cursor-pointer items-center justify-center p-2 ${
					activeBtn === 'menu' ? 'bg-primary' : 'bg-transparent'
				}`}
				onClick={() => setActiveBtn('menu')}
			>
				<Menu
					size={15}
					className={
						activeBtn === 'menu'
							? 'text-primary-foreground'
							: 'text-muted-foreground'
					}
				/>
			</button>
			<button
				className={`flex h-full w-[50%] cursor-pointer items-center justify-center p-2 ${
					activeBtn === 'grid' ? 'bg-primary' : 'bg-transparent'
				}`}
				onClick={() => setActiveBtn('grid')}
			>
				<Grid2x2
					size={15}
					className={
						activeBtn === 'grid'
							? 'text-primary-foreground'
							: 'text-muted-foreground'
					}
				/>
			</button>
		</div>
	)
}
