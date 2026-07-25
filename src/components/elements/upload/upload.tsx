'use client'

import { useEffect, useState, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileText, X } from 'lucide-react'
import useDropzoneStore from '@/store/store'
import DragAndDrop from '@/components/ui/drag-drop/drag-drop'
import { Card } from '@/components/ui/Card/card'
import ModalContainer from '../modal-container/modal-container'
import UploadFolderSelect from '../upload-folder-select/upload-folder-select'
import { upload } from '@/services/upload.service'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button/Button'
import { FOLDER_KEYS } from '@/constants/queryKeys'

const Upload = () => {
	const [selectFolderId, setSelectFolderId] = useState('')
	const { isOpenDropzone, setIsOpenDropzone } = useDropzoneStore(state => state)
	const [uploadFiles, setUploadFiles] = useState<File[]>([])
	const queryClient = useQueryClient()

	const dragCounter = useRef(0)

	const onDrop = (acceptedFiles: File[]) => {
		setUploadFiles(prev => [...prev, ...acceptedFiles])

		dragCounter.current = 0
	}
	const handleUpload = async () => {
		if (!selectFolderId || uploadFiles.length === 0) return

		try {
			await upload(uploadFiles, selectFolderId)

			setSelectFolderId('')
			setUploadFiles([])
			setIsOpenDropzone(false)
			queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.files })
			queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.suggested })
		} catch (error) {
			console.error('Ошибка при массовой загрузке:', error)
		}
	}
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		noClick: false,
	})

	useEffect(() => {
		const handleWindowDragEnter = (e: DragEvent) => {
			e.preventDefault()
			if (e.dataTransfer?.types.includes('Files')) {
				dragCounter.current++
				setIsOpenDropzone(true)
			}
		}

		const handleWindowDragLeave = (e: DragEvent) => {
			e.preventDefault()
			dragCounter.current--

			if (dragCounter.current === 0 && uploadFiles.length === 0) {
				setIsOpenDropzone(false)
			}
		}

		const handleWindowDrop = () => {
			dragCounter.current = 0
		}

		window.addEventListener('dragenter', handleWindowDragEnter)
		window.addEventListener('dragleave', handleWindowDragLeave)
		window.addEventListener('drop', handleWindowDrop)

		return () => {
			window.removeEventListener('dragenter', handleWindowDragEnter)
			window.removeEventListener('dragleave', handleWindowDragLeave)
			window.removeEventListener('drop', handleWindowDrop)
		}
	}, [uploadFiles.length, setIsOpenDropzone])

	if (!isOpenDropzone) return null

	return (
		<ModalContainer isOpen={isOpenDropzone} onClose={setIsOpenDropzone}>
			<div className='pointer-events-auto w-full max-w-md'>
				<Card className='w-100'>
					<div className='flex justify-end mb-2'>
						<button
							onClick={() => {
								setIsOpenDropzone(false)
								setUploadFiles([])
							}}
							className='text-muted-foreground hover:text-foreground'
						>
							<X size={20} />
						</button>
					</div>

					<DragAndDrop
						getInputProps={getInputProps}
						getRootProps={getRootProps}
						isDragActive={isDragActive}
					/>

					{uploadFiles.length > 0 && (
						<div className='mt-4 space-y-2'>
							<div className='max-h-40 overflow-y-auto space-y-2 pr-2'>
								{uploadFiles.map((file, index) => (
									<div
										key={index}
										className='flex items-center p-2  border border-border rounded-md'
									>
										<FileText size={16} className='text-blue-500 mr-2' />
										<span className='text-sm text-foreground truncate flex-1'>
											{file.name}
										</span>
										<span className='text-[10px] text-muted-foreground'>
											{(file.size / 1024).toFixed(1)} KB
										</span>
									</div>
								))}
							</div>

							<UploadFolderSelect
								selectFolderId={selectFolderId}
								setSelectFolderId={setSelectFolderId}
							/>
						</div>
					)}
					{uploadFiles && selectFolderId !== '' && (
						<Button onClick={handleUpload} className='w-full mt-5'>
							Загрузить
						</Button>
					)}
				</Card>
			</div>
		</ModalContainer>
	)
}

export default Upload
