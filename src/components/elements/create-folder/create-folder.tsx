'use client'

import { Card } from '@/components/ui/Card/card'
import ModalContainer from '../modal-container/modal-container'
import useDropzoneStore from '@/store/store'
import Input from '@/components/ui/input/input'
import { Button } from '@/components/ui/button/Button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFolder } from '@/services/folder.service'
import { FOLDER_KEYS } from '@/constants/queryKeys'
import {  useState } from 'react'
export default function CreateFolder() {
	const queryClient = useQueryClient()

	const { isOpenCreateFolder, setIsOpenCreateFolder } = useDropzoneStore(
		state => state,
	)
	const [name, setName] = useState('')
	const onCreateFolder = useMutation({
		mutationFn: createFolder,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.all })
			setIsOpenCreateFolder(false)
			setName('')
		},
	})

	const handleCreate = () => {
		if (name.trim()) {
			onCreateFolder.mutate({ name })
		}
	}
	if (!isOpenCreateFolder) return null
	return (
		<ModalContainer isOpen={isOpenCreateFolder} onClose={setIsOpenCreateFolder}>
			<Card className='flex flex-col w-120 gap-5'>
				<label className='text-2xl'>Новая папка</label>
				<Input
					placeholder='Без названия'
					size={50}
					value={name}
					onChange={e => setName(e.target.value)}
				/>
				<div className='flex justify-end gap-2'>
					<Button variant='ghost' onClick={() => setIsOpenCreateFolder(false)}>
						Отмена
					</Button>
					<Button variant='primary' onClick={handleCreate}>
						{onCreateFolder.isPending ? 'Создание' : 'Создать'}
					</Button>
				</div>
			</Card>
		</ModalContainer>
	)
}
