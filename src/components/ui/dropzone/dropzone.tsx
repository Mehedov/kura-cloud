'use client'

import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

const DragAndDropModal = () => {
	const [isOpen, setIsOpen] = useState(false)

	// Обработчик для файлов, которые уже попали в dropzone
	const onDrop = acceptedFiles => {
		console.log('Файлы приняты:', acceptedFiles)
		setIsOpen(false) // Закрываем модалку после загрузки
	}

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		noClick: false, // Разрешаем клик, если модалка уже открыта
	})

	// Эффект для отслеживания перетаскивания на все окно браузера
	useEffect(() => {
		const handleWindowDragEnter = e => {
			// Проверяем, что перетаскиваются именно файлы
			if (e.dataTransfer.types.includes('Files')) {
				setIsOpen(true)
			}
		}

		window.addEventListener('dragenter', handleWindowDragEnter)
		return () => window.removeEventListener('dragenter', handleWindowDragEnter)
	}, [])

	if (!isOpen) return null

	return (
		<div style={modalOverlayStyle}>
			<div {...getRootProps()} style={dropzoneStyle}>
				<input {...getInputProps()} />
				{isDragActive ? (
					<p>Отпустите файл здесь...</p>
				) : (
					<p>Перетащите файлы сюда или кликните для выбора</p>
				)}
				<button onClick={() => setIsOpen(false)}>Отмена</button>
			</div>
		</div>
	)
}

// Стили для наглядности
const modalOverlayStyle = {
	position: 'fixed',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	backgroundColor: 'rgba(0,0,0,0.5)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	zIndex: 1000,
}

const dropzoneStyle = {
	width: '400px',
	height: '200px',
	border: '2px dashed #fff',
	borderRadius: '10px',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	color: '#fff',
}

export default DragAndDropModal
