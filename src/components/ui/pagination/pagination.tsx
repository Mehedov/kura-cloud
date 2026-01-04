import { cn } from '@/utils/cn'

interface Props {
	className?: string
	totalPages: number
	currentPage: number
	setCurrentPage: (page: number) => void
}

export function Pagination({
	className,
	totalPages,
	currentPage,
	setCurrentPage,
}: Props) {
	const getPaginationRange = (currentPage: number, totalPages: number) => {
		console.log(currentPage)
		const delta = 1
		const range = []

		for (let i = 1; i <= totalPages; i++) {
			if (
				i === 1 ||
				i === totalPages ||
				(i >= currentPage - delta && i <= currentPage + delta)
			) {
				range.push(i)
			} else if (range[range.length - 1] !== '...') {
				range.push('...')
			}
		}

		return range
	}

	return (
		<div className={cn(className, 'w-full flex justify-center mt-5')}>
			<div className='flex gap-2'>
				{getPaginationRange(currentPage, totalPages).map((_, index) => {
					if (typeof index !== 'string') {
						console.log('page')
						return (
							<span
								className={cn(
									currentPage === _ && 'bg-neutral-100 font-bold',
									'w-7 h-7  flex items-center justify-center rounded-sm duration-200 ease-in-out hover:bg-neutral-100 cursor-pointer'
								)}
								key={index}
								onClick={() =>
									typeof _ === 'number' ? setCurrentPage(_) : null
								}
							>
								{_}
							</span>
						)
					}
					return (
						<span
							className={cn(
								'bg-neutral-100 font-bold',
								'w-7 h-7  flex items-center justify-center rounded-sm duration-200 ease-in-out'
							)}
							key={index}
						>
							{_}
						</span>
					)
				})}
			</div>
		</div>
	)
}
