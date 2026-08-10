'use client'

import ModalContainer from '@/shared/ui/modal/Modal'
import { Button } from '@/shared/ui/button/Button'
import { Card } from '@/shared/ui/Card/card'
import Input from '@/shared/ui/input/input'
import { logout } from '@/features/profile-logout/api/logout.api'
import useAuthStore from '@/entities/session/model/session.store'
import { useModalStore } from '@/widgets/global-modals/model/modal.store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Avatar } from '@/shared/ui/avatar/Avatar'

export default function Profile() {
	const { isOpenProfile, setIsOpenProfile } = useModalStore(state => state)
	const { user, setIsAuth } = useAuthStore()
	const queryClient = useQueryClient()

	const onLogout = useMutation({
		mutationFn: logout,
		onSuccess: async () => {
			setIsAuth(false)
			setIsOpenProfile(false)
			await queryClient.cancelQueries()
			queryClient.clear()
		},
	})

	const handleLogout = () => {
		onLogout.mutate()
	}
	const errorMessage = onLogout.error instanceof Error ? onLogout.error.message : null
	if (!isOpenProfile) return null

	return (
		<section>
			<ModalContainer isOpen={isOpenProfile} onClose={setIsOpenProfile} ariaLabel='Профиль'>
				<Card className='w-[min(calc(100vw-2rem),32rem)]'>
					<div className='mb-8 flex flex-col items-center gap-3 sm:flex-row sm:items-start'>
						<Avatar
							name={user?.name}
							avatarUrl={user?.avatarUrl}
							avatarColor={user?.avatarColor}
							id={user?.id}
							className='size-20 border border-border text-3xl'
						/>
						<div className='flex min-w-0 flex-col gap-1 text-center sm:text-left'>
							<div className='text-sm font-medium'>Профиль</div>
							<div className='truncate text-xs text-muted-foreground'>{user?.email}</div>
						</div>
					</div>
					<div className='mb-8 flex flex-col gap-3'>
						<div className='flex flex-col space-y-2'>
							<label htmlFor='profile-name' className='font-medium'>Имя</label>
							<Input
								id='profile-name'
								className='shadow-xs font-medium'
								value={user?.name ?? ''}
								readOnly
							/>
						</div>
					</div>
					{errorMessage && <p className='mb-3 text-sm text-destructive'>{errorMessage}</p>}
					<Button className='w-full' onClick={handleLogout} disabled={onLogout.isPending}>
						{onLogout.isPending ? 'Выходим…' : 'Выйти'}
					</Button>
				</Card>
			</ModalContainer>
		</section>
	)
}
