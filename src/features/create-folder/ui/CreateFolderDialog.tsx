'use client'

import { Card } from '@/shared/ui/Card/card'
import ModalContainer from '@/shared/ui/modal/Modal'
import { useModalStore } from '@/widgets/global-modals/model/modal.store'
import Input from '@/shared/ui/input/input'
import { Button } from '@/shared/ui/button/Button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFolder } from '@/features/create-folder/api/create-folder.api'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { invalidateStorageQueries } from '@/shared/lib/invalidate-storage-queries'
import useLanguage from '@/shared/language/model'
import { translate } from '@/shared/language/translations'
export default function CreateFolder() {
	const queryClient = useQueryClient()
	const language = useLanguage(state => state.language)

	const { isOpenCreateFolder, setIsOpenCreateFolder } = useModalStore(
		state => state,
	)
	const [name, setName] = useState('')
	const params = useParams<{ folderId?: string }>()
	const onCreateFolder = useMutation({
		mutationFn: createFolder,
		onSuccess: () => {
			void invalidateStorageQueries(queryClient)
			setIsOpenCreateFolder(false)
			setName('')
		},
	})

	const handleCreate = () => {
		if (name.trim() && !onCreateFolder.isPending) {
			onCreateFolder.mutate({ name: name.trim(), parentId: params.folderId })
		}
	}
	const errorMessage =
		onCreateFolder.error instanceof Error ? onCreateFolder.error.message : null
	if (!isOpenCreateFolder) return null
	return (
		<ModalContainer
			isOpen={isOpenCreateFolder}
			onClose={setIsOpenCreateFolder}
			ariaLabel={translate(language, 'createFolderDialog')}
		>
			<form
				onSubmit={event => {
					event.preventDefault()
					handleCreate()
				}}
			>
				<Card className='flex w-[min(calc(100vw-2rem),30rem)] flex-col gap-5'>
						<label htmlFor='create-folder-name' className='text-2xl'>{translate(language, 'newFolder')}</label>
					<Input
						id='create-folder-name'
							placeholder={translate(language, 'unnamed')}
						value={name}
						onChange={e => setName(e.target.value)}
						autoFocus
						maxLength={255}
					/>
					{errorMessage && <p className='text-sm text-destructive'>{errorMessage}</p>}
					<div className='flex justify-end gap-2'>
						<Button type='button' variant='ghost' onClick={() => setIsOpenCreateFolder(false)}>
							{translate(language, 'cancel')}
						</Button>
						<Button type='submit' variant='primary' disabled={!name.trim() || onCreateFolder.isPending}>
							{translate(language, onCreateFolder.isPending ? 'creating' : 'create')}
						</Button>
					</div>
				</Card>
			</form>
		</ModalContainer>
	)
}
