'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { CheckCircle2, FileText, LoaderCircle, TriangleAlert, X } from 'lucide-react'
import useDropzoneStore from '@/store/store'
import DragAndDrop from '@/components/ui/drag-drop/drag-drop'
import { Card } from '@/components/ui/Card/card'
import ModalContainer from '../modal-container/modal-container'
import UploadFolderSelect from '../upload-folder-select/upload-folder-select'
import { upload } from '@/services/upload.service'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button/Button'
import { FOLDER_KEYS } from '@/constants/queryKeys'
import { useParams } from 'next/navigation'
import { formatBytes } from '@/utils/formatBytes.util'

type UploadStatus = 'pending' | 'uploading' | 'success' | 'error'

interface UploadItem {
	file: File
	progress: number
	status: UploadStatus
}

const Upload = () => {
	const [selectFolderId, setSelectFolderId] = useState('')
	const { isOpenDropzone, setIsOpenDropzone } = useDropzoneStore(state => state)
	const [uploadFiles, setUploadFiles] = useState<File[]>([])
	const [uploadItems, setUploadItems] = useState<UploadItem[]>([])
	const [isUploading, setIsUploading] = useState(false)
	const queryClient = useQueryClient()
	const params = useParams<{ folderId?: string }>()
	const targetFolderId = selectFolderId || params.folderId || ''
	const isUploadFinished =
		uploadItems.length > 0 &&
		uploadItems.every(item => item.status === 'success' || item.status === 'error')

	const dragCounter = useRef(0)

	const addFiles = useCallback((acceptedFiles: File[]) => {
		if (acceptedFiles.length === 0) return

		setUploadFiles(prev => [...prev, ...acceptedFiles])
		setUploadItems(prev => [
			...prev,
			...acceptedFiles.map(file => ({ file, progress: 0, status: 'pending' as const })),
		])

		dragCounter.current = 0
	}, [])
	const onDrop = useCallback(
		(acceptedFiles: File[]) => addFiles(acceptedFiles),
		[addFiles],
	)
	const handleUpload = async () => {
		if (!targetFolderId || uploadFiles.length === 0 || isUploading) return

		setIsUploading(true)
		setUploadItems(items =>
			items.map(item => ({ ...item, status: 'uploading', progress: 0 })),
		)
		try {
			const results = await upload(uploadFiles, targetFolderId, (fileIndex, progress) => {
				setUploadItems(items =>
					items.map((item, index) =>
						index === fileIndex ? { ...item, progress } : item,
					),
				)
			})
			setUploadItems(items =>
				items.map((item, index) => {
					const result = results.find(entry => entry.fileIndex === index)
					return {
						...item,
						progress: result?.status === 'success' ? 100 : item.progress,
						status: result?.status ?? 'error',
					}
				}),
			)

			queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.root })
			queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.files })
			queryClient.invalidateQueries({ queryKey: FOLDER_KEYS.suggested })
		} catch (error) {
			console.error('Ошибка при массовой загрузке:', error)
		} finally {
			setIsUploading(false)
		}
	}
	const closeUpload = () => {
		setIsOpenDropzone(false)
		setSelectFolderId('')
		setUploadFiles([])
		setUploadItems([])
	}
	const removeFile = (fileIndex: number) => {
		if (isUploading) return

		setUploadFiles(files => files.filter((_, index) => index !== fileIndex))
		setUploadItems(items => items.filter((_, index) => index !== fileIndex))
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

		const handleWindowDrop = (event: DragEvent) => {
			if (!event.defaultPrevented) {
				event.preventDefault()
				addFiles(Array.from(event.dataTransfer?.files ?? []))
			}
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
	}, [addFiles, uploadFiles.length, setIsOpenDropzone])

	if (!isOpenDropzone) return null

	return (
		<ModalContainer isOpen={isOpenDropzone} onClose={setIsOpenDropzone}>
			<div className='pointer-events-auto w-full max-w-md'>
				<Card className='w-100'>
					<div className='flex justify-end mb-2'>
						<button
							onClick={() => !isUploading && closeUpload()}
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
								{uploadItems.map((item, index) => (
									<div
										key={index}
										className='rounded-md border border-border p-2'
									>
										<div className='flex items-center gap-2'>
											<FileText size={16} className='shrink-0 text-blue-500' />
											<span className='flex-1 truncate text-sm text-foreground'>
												{item.file.name}
											</span>
											<span className='text-[10px] text-muted-foreground'>
												{formatBytes(item.file.size)}
											</span>
											{item.status === 'uploading' && (
												<LoaderCircle size={16} className='animate-spin text-muted-foreground' />
											)}
											{item.status === 'success' && (
												<CheckCircle2 size={16} className='text-green-600' />
											)}
											{item.status === 'error' && (
												<TriangleAlert size={16} className='text-destructive' />
											)}
											{item.status === 'pending' && (
												<button
													type='button'
													onClick={() => removeFile(index)}
													className='rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground'
													aria-label={`Удалить ${item.file.name} из очереди`}
													title='Удалить из очереди'
												>
													<X size={16} />
												</button>
											)}
										</div>
										{item.status !== 'pending' && (
											<div className='mt-2 h-1.5 overflow-hidden rounded-full bg-muted'>
												<div
													className={
														item.status === 'error' ? 'h-full bg-destructive' : 'h-full bg-primary'
													}
													style={{ width: `${item.progress}%` }}
												/>
											</div>
										)}
									</div>
								))}
							</div>

							{params.folderId ? (
								<p className='rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground'>
									Файлы будут загружены в текущую папку.
								</p>
							) : (
								<UploadFolderSelect
									selectFolderId={targetFolderId}
									setSelectFolderId={setSelectFolderId}
								/>
							)}
						</div>
					)}
					{isUploadFinished ? (
						<div className='space-y-3'>
							<p className='rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-700'>
								Загрузка завершена: {uploadItems.filter(item => item.status === 'success').length} из {uploadItems.length} файлов.
							</p>
							<Button onClick={closeUpload} className='w-full'>
								Готово
							</Button>
						</div>
					) : uploadFiles.length > 0 && targetFolderId !== '' ? (
						<Button onClick={handleUpload} disabled={isUploading} className='w-full mt-5'>
							{isUploading ? 'Загружаем…' : 'Загрузить'}
						</Button>
					) : null}
				</Card>
			</div>
		</ModalContainer>
	)
}

export default Upload
