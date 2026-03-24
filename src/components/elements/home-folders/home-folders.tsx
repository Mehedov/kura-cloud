import { PAGES } from '@/config/page.config'
import { Link } from 'lucide-react'
import React, { useEffect, useMemo } from 'react'
import { FolderGrid } from '../folder/folder'
import { createFolder, getMyFolders } from '@/services/folder.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FOLDER_KEYS } from '@/constants/queryKeys'

export default function HomeFolders() {
	const { data, isPending, isError, error } = useQuery({
		queryKey: FOLDER_KEYS.all, // Уникальный ключ для кэширования
		queryFn: getMyFolders, // Функция запроса
	})

	const folders = data?.data || []

	const foldersRender = () => {
		return folders.slice(0, 10).map((folder, index) => {
			return (
				<FolderGrid
					id={folder.id}
					name={folder.name}
					key={index}
					size={90}
					pathname={PAGES.folders}
				/>
			)
		})
	}

	if (isPending) return <div>Загрузка...</div>
	if (isError) return <div>Ошибка: {error.message}</div>

	return (
		<section>
			<h2 className='text-md text-neutral-900 font-medium mb-4'>
				Folders
				{folders.length > 10 && (
					<Link
						href='/folders'
						className='ml-3 text-xs text-neutral-500 duration-200 ease-in-out hover:text-neutral-600'
					>
						more {folders.length - 10}...
					</Link>
				)}
			</h2>
			<div className='flex items-center flex-wrap gap-4'>{foldersRender()}</div>
		</section>
	)
}
