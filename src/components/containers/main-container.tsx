'use client'

import React, { PropsWithChildren, useEffect, useRef } from 'react'
import { Sidebar } from '../elements/sidebar/Sidebar'
import { Header } from '../elements/header/Header'
import Upload from '../elements/upload/upload'
import CreateFolder from '../elements/create-folder/create-folder'
import useAuthStore from '@/store/auth'
import Profile from '../elements/profile-modal/profile-modal'
import { Breadcrumb } from '../ui/breadcrumb'
import { useRouter } from 'next/navigation'

export default function MainContainer({ children }: PropsWithChildren) {
	const { checkAuth, isLoading, isAuth } = useAuthStore()
	const router = useRouter()
	const hasCheckedAuth = useRef(false)

	useEffect(() => {
		if (hasCheckedAuth.current) return
		hasCheckedAuth.current = true
		checkAuth()
	}, [checkAuth])

	useEffect(() => {
		if (!isLoading && !isAuth) {
			router.replace('/auth')
		}
	}, [isAuth, isLoading, router])

	if (isLoading) {
		return (
			<main className='flex h-screen bg-background text-foreground'>
				<aside className='hidden w-2xs shrink-0 border-r border-sidebar-border bg-sidebar p-layout lg:block'>
					<div className='h-8 w-32 animate-pulse rounded bg-muted' />
					<div className='mt-8 space-y-3'>
						{Array.from({ length: 6 }, (_, index) => (
							<div key={index} className='h-11 animate-pulse rounded bg-muted' />
						))}
					</div>
				</aside>
				<section className='flex-1 overflow-auto p-layout'>
					<div className='h-11 w-full max-w-xl animate-pulse rounded-lg bg-muted' />
					<div className='mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
						{Array.from({ length: 4 }, (_, index) => (
							<div key={index} className='h-40 animate-pulse rounded-xl bg-muted' />
						))}
					</div>
				</section>
			</main>
		)
	}

	if (!isAuth) return null

	return (
		<main className='flex h-screen overflow-hidden bg-background text-foreground'>
			<Sidebar />
			<section className='min-w-0 flex-1 overflow-auto p-4 sm:p-layout'>
				<Header />

				<div className='flex flex-col'>
					<Breadcrumb />
					{children}
				</div>
				<Upload />
				<CreateFolder />
				<Profile />
			</section>
		</main>
	)
}
