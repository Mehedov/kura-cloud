'use client'

import React, { PropsWithChildren, useEffect } from 'react'
import { Sidebar } from '../elements/sidebar/Sidebar'
import { Header } from '../elements/header/Header'
import Upload from '../elements/upload/upload'
import CreateFolder from '../elements/create-folder/create-folder'
import useAuthStore from '@/store/auth'
import Profile from '../elements/profile-modal/profile-modal'
import { Breadcrumb } from '../ui/breadcrumb'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function MainContainer({ children }: PropsWithChildren) {
	const { checkAuth, user, isLoading, isAuth } = useAuthStore()
	const router = useRouter()

	useEffect(() => {
		const token = Cookies.get('token')
		if (token) {
			checkAuth()
		} else {
			useAuthStore.setState({ isLoading: false })
			router.push('/auth')
		}
	}, [checkAuth, router])

	useEffect(() => {
		if (!isLoading && !isAuth) {
			router.push('/auth')
		}
	}, [isAuth, isLoading, router])
	return (
		<main className='h-screen flex'>
			{isAuth ? (
				<>
					<Sidebar />
					<section className='flex-1 overflow-auto p-layout'>
						<Header />

						<div className='flex  flex-col'>
							<Breadcrumb />
							{children}
						</div>
						<Upload />
						<CreateFolder />
						<Profile />
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
