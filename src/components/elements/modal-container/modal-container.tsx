import React, { PropsWithChildren } from 'react'

export default function ModalContainer({
	children,
}: PropsWithChildren<unknown>) {
	return (
		<div className='fixed inset-0 z-1000 bg-black/10 flex items-center justify-center p-4 overflow-y-auto'>
			{children}
		</div>
	)
}
