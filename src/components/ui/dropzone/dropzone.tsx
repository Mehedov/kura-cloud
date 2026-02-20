'use client'

import { useEffect, useState, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card } from '../Card/card'
import { Plus } from 'lucide-react'

const DragAndDropModal = () => {
	const [isOpen, setIsOpen] = useState(false)
	// Используем useRef для счетчика, чтобы избежать лишних ререндеров
	const dragCounter = useRef(0)

	const onDrop = acceptedFiles => {
		console.log('Файлы приняты:', acceptedFiles)
		dragCounter.current = 0 // Сбрасываем счетчик
		setIsOpen(false)
	}

	const onDragLeave = e => {
		e.preventDefault()
		dragCounter.current--

		// Если счетчик равен 0, значит мы реально вышли за пределы окна браузера
		if (dragCounter.current === 0) {
			setIsOpen(false)
		}
	}

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		noClick: false,
		onDragLeave,
	})

	useEffect(() => {
		const handleDragEnter = e => {
			e.preventDefault()
			if (e.dataTransfer.types.includes('Files')) {
				dragCounter.current++
				setIsOpen(true)
			}
		}

		const handleDrop = e => {
			e.preventDefault()
			dragCounter.current = 0
			setIsOpen(false)
		}

		// Слушаем события на уровне всего окна
		window.addEventListener('dragenter', handleDragEnter)
		window.addEventListener('dragleave', onDragLeave)
		window.addEventListener('drop', handleDrop) // Важно сбросить, если файл бросили мимо

		return () => {
			window.removeEventListener('dragenter', handleDragEnter)
			window.removeEventListener('dragleave', onDragLeave)
			window.removeEventListener('drop', handleDrop)
		}
	}, [])

	if (!isOpen) return null

	return (
		<div className='fixed inset-0 z-1000 bg-black/30 flex items-center justify-center pointer-events-none'>
			{/* Добавляем pointer-events-auto только к самой карточке, чтобы она ловила drop */}
			<div className='pointer-events-auto'>
				<Card {...getRootProps()}>
					<div className='w-100 h-50 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center bg-white'>
						<input {...getInputProps()} />
						{isDragActive ? (
							<p className='animate-pulse text-neutral-600 font-bold'>
								Отпустите файл здесь...
							</p>
						) : (
							<div className='flex flex-col items-center justify-center p-6'>
								<div className='w-16 h-16 flex items-center justify-center bg-neutral-100 rounded-full mb-3'>
									<Plus size={32} className='text-neutral-600' />
								</div>
								<p className='font-medium text-md text-center'>
									Click or drag files to upload
								</p>
								<p className='text-sm text-neutral-400 mt-1'>
									.csv or .xls (Max 20MB)
								</p>
							</div>
						)}
					</div>
				</Card>
			</div>
		</div>
	)
}

export default DragAndDropModal
