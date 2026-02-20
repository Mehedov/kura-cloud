'use client'

import { useEffect, useState, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card } from '../Card/card'
import { Plus, FileText, X } from 'lucide-react'

const DragAndDropModal = () => {
	const [isOpen, setIsOpen] = useState(false)
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
				setIsOpen(true)
			}
		}

		const handleWindowDragLeave = (e: DragEvent) => {
			e.preventDefault()
			dragCounter.current--

			if (dragCounter.current === 0 && uploadFiles.length === 0) {
				setIsOpen(false)
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
	}, [uploadFiles.length]) 

	if (!isOpen) return null

	return (
		<div className='fixed inset-0 z-1000 bg-black/10 flex items-center justify-center p-4 overflow-y-auto'>
			<div className='pointer-events-auto w-full max-w-md'>
				<Card>
					<div className='flex justify-end mb-2'>
						<button
							onClick={() => {
								setIsOpen(false)
								setUploadFiles([])
							}}
							className='text-neutral-400 hover:text-neutral-600'
						>
							<X size={20} />
						</button>
					</div>

					<div
						{...getRootProps()}
						className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center duration-200 ease-in-out transition-colors ${isDragActive ? 'border-neutral-500' : 'border-neutral-300 bg-neutral-50 cursor-pointer hover:border-neutral-500'}`}
					>
						<input {...getInputProps()} />

						<div className='w-12 h-12 flex items-center justify-center bg-neutral-200 rounded-full mb-3'>
							<Plus size={24} className='text-neutral-700' />
						</div>

						<p className='font-medium text-md text-center'>
							Click or drag files to upload
						</p>
						<p className='text-sm text-neutral-400'>.csv or .xls (Max 20MB)</p>
					</div>

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

export default DragAndDropModal
