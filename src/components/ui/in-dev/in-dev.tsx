import React from 'react'

interface UnderDevelopmentProps {
	children: React.ReactNode
	isActive?: boolean
	className?: string
}

const InDev: React.FC<UnderDevelopmentProps> = ({
	children,
	isActive = true,
	className = 'rounded-xl',
}) => {
	return (
		<div className={`relative w-fit h-fit ${className} overflow-hidden`}>
			<div
				className={
					isActive ? 'filter blur-sm opacity-50 pointer-events-none' : ''
				}
			>
				{children}
			</div>

			{isActive && (
				<div className='absolute inset-0 z-50 flex items-center justify-center pointer-events-none'>
					<div className='absolute inset-0 bg-neutral-100 backdrop-blur-[2px]' />

					<div
						className='absolute inset-0 opacity-30'
						style={{
							backgroundImage: `
                linear-gradient(to right, #737373 1px, transparent 1px),
                linear-gradient(to bottom, #737373 1px, transparent 1px)
              `,
							backgroundSize: '15px 15px',
						}}
					/>

					<div className='absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,white_100%)] opacity-60' />

					<div className='relative group'>in dev</div>
				</div>
			)}
		</div>
	)
}

export default InDev
