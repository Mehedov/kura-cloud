import { Plus } from 'lucide-react'
import React from 'react'
import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone'

interface Props {
	isDragActive: boolean
	getRootProps: <T extends DropzoneRootProps>(props?: T) => T
	getInputProps: <T extends DropzoneInputProps>(props?: T) => T
}

export default function DragAndDrop({
	getRootProps,
	getInputProps,
	isDragActive,
}: Props) {
	return (
		<div
			{...getRootProps()}
			className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center duration-200 ease-in-out transition-colors ${isDragActive ? 'border-border' : 'border-border bg-muted cursor-pointer hover:border-border'}`}
		>
			<input {...getInputProps()} />

			<div className='w-12 h-12 flex items-center justify-center bg-muted rounded-full mb-3'>
				<Plus size={24} className='text-foreground' />
			</div>

			<p className='text-md text-center font-medium'>
				Выберите или перетащите файлы
			</p>
			<p className='text-sm text-muted-foreground'>До 2 GiB на файл</p>
		</div>
	)
}
