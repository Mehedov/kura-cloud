import { EllipsisVertical, File, User } from 'lucide-react'

export const YourTable = () => {
	const renderTableItems = () => {
		return [...new Array(10)].map((_, index) => (
			<div
				key={index}
				className='flex border-r-2 border-b-2 border-l-2 border-neutral-200 divide-x-2 divide-neutral-200'
			>
				<div className='w-[25%] flex items-center gap-2 p-2 text-sm'>
					<File className='w-5 h-5' />
					<span>Design_Campaign.photo.JPG</span>
				</div>
				<div className='w-[25%] p-2 flex items-center gap-2'>
					<div className='w-10 h-10 rounded-full overflow-hidden'>
						{/* <Image src={avatar} alt='av' /> */}
						<User />
					</div>
					<span>Nikolay Mekhedov</span>
				</div>
				<div className='w-[20%] p-2 flex items-center justify-center'>
					<span>3,1 GB</span>
				</div>
				<div className='w-[20%] p-2 flex items-center justify-center'>
					<span>11 June 2020</span>
				</div>
				<div className='w-[10%] p-2 flex items-center justify-center text-center'>
					<EllipsisVertical size={25} className='text-neutral-400' />
				</div>
			</div>
		))
	}
	return (
		<div className='rounded-lg overflow-hidden'>
			<div className='flex w-full bg-neutral-50 border-2 border-neutral-200 divide-x-2 divide-neutral-200'>
				<div className='w-[25%] bg-neutral-50 not-last:border-r-2 border-neutral-200 px-2 py-1 rounded-l-lg'>
					Name
				</div>
				<div className='w-[25%] bg-neutral-50 px-2 py-1'>Shared By</div>
				<div className='w-[20%] bg-neutral-50 px-2 py-1 text-center'>
					File Size
				</div>
				<div className='w-[20%] bg-neutral-50 px-2 py-1 text-center'>
					Modified
				</div>
				<div className='w-[10%] bg-neutral-50 px-2 py-1 text-center'>
					Action
				</div>
			</div>
			<div className='flex flex-col'>{renderTableItems()}</div>
		</div>
	)
}
