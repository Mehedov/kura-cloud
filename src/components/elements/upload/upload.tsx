'use client'

import { useEffect, useState, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import {  FileText, X } from 'lucide-react'
import useDropzoneStore from '@/store/store'
import { Card } from '@/components/ui/card/card'
import DragAndDrop from '@/components/ui/drag-drop/drag-drop'

const Upload = () => {
	const { isOpenDropzone, setIsOpenDropzone } = useDropzoneStore(state => state)
	const [uploadFiles, setUploadFiles] = useState<File[]>([])

	const dragCounter = useRef(0)

	const onDrop = (acceptedFiles: File[]) => {
		setUploadFiles(prev => [...prev, ...acceptedFiles])
		dragCounter.current = 0
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

		const handleWindowDrop = (e: DragEvent) => {
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
		<div className='fixed inset-0 z-1000 bg-black/10 flex items-center justify-center p-4 overflow-y-auto'>
			<div className='pointer-events-auto w-full max-w-md'>
				<Card>
					<div className='flex justify-end mb-2'>
						<button
							onClick={() => {
								setIsOpenDropzone(false)
								setUploadFiles([])
							}}
							className='text-neutral-400 hover:text-neutral-600'
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
										className='flex items-center p-2  border border-neutral-200 rounded-md'
									>
										<FileText size={16} className='text-blue-500 mr-2' />
										<span className='text-sm text-neutral-700 truncate flex-1'>
											{file.name}
										</span>
										<span className='text-[10px] text-neutral-400'>
											{(file.size / 1024).toFixed(1)} KB
										</span>
									</div>
								))}
							</div>
						</div>
					)}
				</Card>
			</div>
		</div>
	)
}

export default Upload
