'use client'

import { Card } from '@/shared/ui/Card/card'
import { Button } from '@/shared/ui/button/Button'
import Input from '@/shared/ui/input/input'
import ModalContainer from '@/shared/ui/modal/Modal'
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value'
import { createShare, searchShareUsers } from '@/features/share-resource/api/share-resource.api'
import type { IShareUser, SharePermission, ShareResourceType } from '@/entities/share/model/share.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { invalidateStorageQueries } from '@/shared/lib/invalidate-storage-queries'
import { FOLDER_KEYS } from '@/shared/config/query-keys'
import { Avatar } from '@/shared/ui/avatar/Avatar'

interface ShareResourceDialogProps {
	resourceId: string
	resourceType: ShareResourceType
	resourceName: string
	onClose: () => void
}

export function ShareResourceDialog({
	resourceId,
	resourceType,
	resourceName,
	onClose,
}: ShareResourceDialogProps) {
	const queryClient = useQueryClient()
	const [email, setEmail] = useState('')
	const [selectedUser, setSelectedUser] = useState<IShareUser | null>(null)
	const debouncedEmail = useDebouncedValue(email.trim())
	const [permission, setPermission] = useState<SharePermission>('viewer')
	const shareMutation = useMutation({
		mutationFn: createShare,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.shares })
			void invalidateStorageQueries(queryClient)
			onClose()
		},
	})
	const errorMessage =
		shareMutation.error instanceof Error ? shareMutation.error.message : null
	const usersQuery = useQuery({
		queryKey: ['share-users', debouncedEmail],
		queryFn: () => searchShareUsers(debouncedEmail),
		enabled: debouncedEmail.length >= 2,
	})
	const users = usersQuery.data?.data ?? []

	return (
		<ModalContainer isOpen onClose={() => onClose()}>
			<Card className='w-[min(100vw-2rem,28rem)] p-5'>
				<form
					className='space-y-4'
					onSubmit={event => {
						event.preventDefault()
						const recipientEmail = email.trim()
						if (!recipientEmail) return
						shareMutation.mutate({
							resourceId,
							resourceType,
							recipientEmail,
							permission,
						})
					}}
				>
					<div>
						<h2 className='text-lg font-semibold text-foreground'>Поделиться</h2>
						<p className='mt-1 truncate text-sm text-muted-foreground'>{resourceName}</p>
					</div>
					{selectedUser ? (
						<button
							type='button'
							onClick={() => {
								setSelectedUser(null)
								setEmail('')
							}}
							className='flex w-full items-center gap-3 rounded-lg border border-border bg-muted px-3 py-2 text-left transition-colors hover:bg-accent'
						>
							<Avatar name={selectedUser.name} avatarUrl={selectedUser.avatarUrl} avatarColor={selectedUser.avatarColor} id={selectedUser.id} alt='' className='size-8 text-sm' />
							<span className='min-w-0'><span className='block truncate text-sm font-medium text-foreground'>{selectedUser.name}</span><span className='block truncate text-xs text-muted-foreground'>{selectedUser.email}</span></span>
						</button>
					) : <div className='relative'>
						<Input
							type='email'
							value={email}
							onChange={event => {
								setEmail(event.target.value)
								setSelectedUser(null)
							}}
							placeholder='email пользователя'
							autoFocus
						/>
						{debouncedEmail.length >= 2 && users.length > 0 && (
						<div className='animate-overlay-in absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-lg border border-border bg-popover shadow-lg'>
							{users.map(user => (
								<button key={user.id} type='button' onClick={() => { setEmail(user.email); setSelectedUser(user) }} className='flex w-full items-center gap-3 border-l-2 border-transparent px-3 py-2 text-left transition-colors hover:border-primary hover:bg-accent focus-visible:border-primary focus-visible:bg-accent focus-visible:outline-none'>
									<Avatar name={user.name} avatarUrl={user.avatarUrl} avatarColor={user.avatarColor} id={user.id} alt='' className='size-8 text-sm' />
									<span className='min-w-0'><span className='block truncate text-sm font-medium text-foreground'>{user.name}</span><span className='block truncate text-xs text-muted-foreground'>{user.email}</span></span>
								</button>
							))}
						</div>
					)}
					</div>}
					<label className='block text-sm text-foreground'>
						Уровень доступа
						<select
							value={permission}
							onChange={event => setPermission(event.target.value as SharePermission)}
							className='mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 outline-none'
						>
							<option value='viewer'>Просмотр</option>
							<option value='editor'>Редактирование</option>
						</select>
					</label>
					{errorMessage && <p className='text-sm text-destructive'>{errorMessage}</p>}
					<div className='flex justify-end gap-2'>
						<Button type='button' variant='secondary' onClick={onClose}>
							Отмена
						</Button>
						<Button type='submit' disabled={shareMutation.isPending}>
							Отправить доступ
						</Button>
					</div>
				</form>
			</Card>
		</ModalContainer>
	)
}
