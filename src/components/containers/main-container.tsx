'use client'

import React, { PropsWithChildren } from 'react'
import { Sidebar } from '../elements/sidebar/Sidebar'
import { Header } from '../elements/header/Header'
import Upload from '../elements/upload/upload'
import CreateFolder from '../elements/create-folder/create-folder'
import useAuthStore from '@/store/auth'

export default function MainContainer({ children }: PropsWithChildren) {
	const { isAuth } = useAuthStore()
	return (
		<main className='h-screen flex'>
			{isAuth ? (
				<>
					<Sidebar />
					<section className='flex-1 overflow-auto p-layout'>
						<Header />

						<div className='flex  flex-col'>{children}</div>
						<Upload />
						<CreateFolder />
					</section>
				</>
			) : (
				<section className='flex-1 overflow-auto p-layout'>
					<div className='flex  flex-col'>{children}</div>
				</section>
			)}
		</main>
	)
}
