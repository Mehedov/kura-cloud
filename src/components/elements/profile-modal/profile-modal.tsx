import ModalContainer from '@/components/elements/modal-container/modal-container'
import { Button } from '@/components/ui/button/Button'
import { Card } from '@/components/ui/Card/card'
import Input from '@/components/ui/input/input'
import { logout } from '@/services/auth.service'
import useAuthStore from '@/store/auth'
import useDropzoneStore from '@/store/store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { User } from 'lucide-react'

export default function Profile() {
	const { isOpenProfile, setIsOpenProfile } = useDropzoneStore(state => state)
	const { user, setIsAuth } = useAuthStore()
	const queryClient = useQueryClient()

	const onLogout = useMutation({
		mutationFn: logout,
		onSuccess: () => {
			setIsOpenProfile(false)
			setIsAuth(false)
		},
	})

	const handleLogout = () => {
		onLogout.mutate()
		queryClient.clear()
	}
	if (!isOpenProfile) return null

	return (
		<section>
			<ModalContainer isOpen={isOpenProfile} onClose={setIsOpenProfile}>
				<Card className='w-200'>
					<div className='flex items-center gap-3 mb-10'>
						<div className='w-20 h-20 rounded-full overflow-hidden border border-border flex items-center justify-center'>
							{/* <Image src={avatar} alt='avatar' className='object-cover' /> */}
							<User size={40} />
						</div>
						<div className='flex flex-col gap-2'>
							<div className='font-medium text-sm'>Profile photo</div>
							<div className='text-foreground text-xs font-medium'>
								We support PNGs, JPEGs and GIFs under 10MB
							</div>
							<div>
								<Button
									variant='outline'
									className='text-[12px] p-1 shadow-xs font-bold'
								>
									Upload new picture
								</Button>
							</div>
						</div>
					</div>
					<form action='' className='flex flex-col gap-3 mb-10'>
						<div className='flex flex-col space-y-2'>
							<label className='font-medium'>Username</label>
							<Input
								className='shadow-xs font-medium'
								value={user?.name}
							/>
						</div>
					</form>
					<Button className='text-left' onClick={handleLogout}>
						Exit
					</Button>
				</Card>
			</ModalContainer>
		</section>
	)
}
