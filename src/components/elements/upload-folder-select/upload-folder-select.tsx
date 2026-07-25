'use client'

import { getMyFolders } from '@/services/folder.service'
import { useQuery } from '@tanstack/react-query'
import { FOLDER_KEYS } from '@/constants/queryKeys'
import { cn } from '@/utils/cn'
import { FolderIcon } from '@/assets/icons/FolderIcon'

interface Props {
	selectFolderId: string
	setSelectFolderId: (value: string) => void
}

export default function UploadFolderSelect({
	selectFolderId,
	setSelectFolderId,
}: Props) {
	const { data, isPending, isError, error } = useQuery({
		queryKey: FOLDER_KEYS.all,
		queryFn: getMyFolders,
	})

	const foldersRender = (data?.data ?? []).slice(0, 10).map(folder => (
				<div
					onClick={() => setSelectFolderId(folder.id)}
					key={folder.id}
					className={cn(
						`flex flex-col items-center gap-2 p-1 rounded-xl duration-200 hover:-translate-y-1`,
						selectFolderId === folder.id && 'border-2 border-border',
					)}
					style={{ width: '100px' }}
				>
					<FolderIcon size={50} />
					<p
						className={`text-center text-sm font-medium leading-tight line-clamp-2 wrap-break-word w-full`}
					>
						{folder.name}
					</p>
				</div>
			))

	if (isPending) return <div>Загрузка...</div>
	if (isError) return <div>Ошибка: {error.message}</div>

	return (
		<section>
			<h2 className='text-md text-foreground font-medium mb-4'>
				Select folders
			</h2>
			<div className='flex items-center flex-wrap gap-1'>{foldersRender}</div>
		</section>
	)
}
