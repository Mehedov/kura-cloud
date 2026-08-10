'use client'

import { Card } from '@/shared/ui/Card/card'
import { Button } from '@/shared/ui/button/Button'
import Input from '@/shared/ui/input/input'
import { FOLDER_KEYS } from '@/shared/config/query-keys'
import ModalContainer from '@/shared/ui/modal/Modal'
import {
	moveResource,
	renameResource,
} from '@/features/manage-resource/api/resource-actions.api'
import { getMyFolders } from '@/entities/folder/api/folder.queries'
import type { IDeleteFolder } from '@/entities/folder/model/folder.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useToastStore } from '@/shared/ui/toast/model/toast.store'
import { invalidateStorageQueries } from '@/shared/lib/invalidate-storage-queries'

export type ResourceAction = 'rename' | 'move' | null

interface ResourceActionsDialogsProps extends IDeleteFolder {
	name: string
	action: ResourceAction
	onClose: () => void
	allowRoot?: boolean
}

export function ResourceActionsDialogs({
	id,
	type,
	name,
	action,
	onClose,
	allowRoot = true,
}: ResourceActionsDialogsProps) {
	const queryClient = useQueryClient()
	const showToast = useToastStore(state => state.show)
	const hasShownNoDestination = useRef(false)
	const [targetFolderId, setTargetFolderId] = useState('')
	const { data: foldersData, isPending: isFoldersPending } = useQuery({
		queryKey: FOLDER_KEYS.all,
		queryFn: () => getMyFolders(),
		enabled: action === 'move',
	})

	const refreshStorage = () => {
		void invalidateStorageQueries(queryClient)
	}

	const renameMutation = useMutation({
		mutationFn: renameResource,
		onSuccess: () => {
			refreshStorage()
			onClose()
		},
	})
	const moveMutation = useMutation({
		mutationFn: moveResource,
		onSuccess: () => {
			refreshStorage()
			onClose()
		},
	})
	useEffect(() => {
		if (action !== 'move' || isFoldersPending || allowRoot || hasShownNoDestination.current) return
		if ((foldersData?.data ?? []).length === 0) {
			hasShownNoDestination.current = true
			showToast('Нет доступных папок для перемещения', 'error')
			onClose()
		}
	}, [action, allowRoot, foldersData?.data, isFoldersPending, onClose, showToast])
	useEffect(() => { hasShownNoDestination.current = false }, [action])

	if (!action) return null

	const error = renameMutation.error ?? moveMutation.error
	const errorMessage = error instanceof Error ? error.message : null

	return (
		<ModalContainer isOpen onClose={() => onClose()}>
			<Card className='w-full max-w-md p-5'>
				{action === 'rename' ? (
					<form
						onSubmit={event => {
							event.preventDefault()
							const formData = new FormData(event.currentTarget)
							const nextName = String(formData.get('name') ?? '').trim()
							if (nextName) renameMutation.mutate({ id, type, name: nextName })
						}}
						className='space-y-4'
					>
						<div>
							<h2 className='text-lg font-semibold text-foreground'>Переименовать</h2>
							<p className='mt-1 text-sm text-muted-foreground'>
								Укажите новое название.
							</p>
						</div>
						<Input name='name' defaultValue={name} autoFocus maxLength={255} />
						<div className='flex justify-end gap-2'>
							<Button type='button' variant='secondary' onClick={onClose}>
								Отмена
							</Button>
							<Button type='submit' disabled={renameMutation.isPending}>
								Сохранить
							</Button>
						</div>
					</form>
				) : (
					<div className='space-y-4'>
						<div>
							<h2 className='text-lg font-semibold text-foreground'>Переместить</h2>
							<p className='mt-1 text-sm text-muted-foreground'>
								Выберите папку назначения.
							</p>
						</div>
						<select
							value={targetFolderId}
							onChange={event => setTargetFolderId(event.target.value)}
							disabled={isFoldersPending}
							className='w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground outline-none'
						>
							{allowRoot && <option value=''>Корень хранилища</option>}
							{(foldersData?.data ?? [])
								.filter(folder => folder.id !== id)
								.map(folder => (
									<option key={folder.id} value={folder.id}>
										{folder.name}
									</option>
								))}
						</select>
						<div className='flex justify-end gap-2'>
							<Button variant='secondary' onClick={onClose}>
								Отмена
							</Button>
							<Button
								disabled={moveMutation.isPending || isFoldersPending}
								onClick={() =>
									moveMutation.mutate({ id, type, targetFolderId: targetFolderId || null })
								}
							>
								Переместить
							</Button>
						</div>
					</div>
				)}
				{errorMessage && <p className='mt-3 text-sm text-destructive'>{errorMessage}</p>}
			</Card>
		</ModalContainer>
	)
}
