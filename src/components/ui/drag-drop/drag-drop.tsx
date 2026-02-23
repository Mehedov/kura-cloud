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
	)
}
