import { FolderIcon } from '@/shared/assets/icons/FolderIcon'
import {
	Popover,
	PopoverContext,
	PopoverContextProps,
} from '@/shared/ui/popover/popover'
import { PopoverContent } from '@/shared/ui/popover/popover-content'
import {
	ResourceActionsDialogs,
	type ResourceAction,
} from '@/features/manage-resource/ui/ResourceActionsDialogs'
import { ShareResourceDialog } from '@/features/share-resource/ui/ShareResourceDialog'
import { moveToTrash, restoreFromTrash } from '@/entities/folder/api/folder.queries'
import { cn } from '@/shared/lib/cn'
import { Avatar } from '@/shared/ui/avatar/Avatar'
import { useToastStore } from '@/shared/ui/toast/model/toast.store'
import { invalidateStorageQueries } from '@/shared/lib/invalidate-storage-queries'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EllipsisVertical, FolderInput, Share2, SquarePen, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React, { forwardRef, memo, useState } from 'react'

export type FolderProps = React.HTMLAttributes<HTMLAnchorElement> & {
	pathname?: string
	slug?: string
	name: string
	size?: number
	id: string
	updatedAt?: string
	canEdit?: boolean
	canMove?: boolean
	canManageAccess?: boolean
	canUndoDelete?: boolean
	context?: PopoverContextProps | undefined
	collaborators?: {
		owner: { id: string; name: string; avatarUrl?: string | null } | null
		editors: Array<{ id: string; name: string; avatarUrl?: string | null }>
	}
}

export function FolderAvatarStack({ collaborators }: Pick<FolderProps, 'collaborators'>) {
	if (!collaborators) return null
	const users = [collaborators.owner, ...collaborators.editors].filter(
		(user): user is NonNullable<typeof user> => Boolean(user),
	)
	if (!users.length) return null
	const visibleUsers = users.slice(0, 3)
	const hiddenCount = users.length - visibleUsers.length
	return (
		<div className='absolute right-0 top-0 z-10 flex -space-x-2'>
			{visibleUsers.map(user => (
				<Avatar
					key={user.id}
					name={user.name}
					avatarUrl={user.avatarUrl}
					id={user.id}
					className='size-6 border-2 border-background text-[10px] text-white'
				/>
			))}
			{hiddenCount > 0 && <span className='grid size-6 place-items-center rounded-full border-2 border-background bg-muted text-[10px] font-semibold text-foreground'>+{hiddenCount}</span>}
		</div>
	)
}

export const ContextMenuContent: React.FC<{
	onDelete?: (itemId: string) => void
	itemId?: string
	onRename?: () => void
	onMove?: () => void
	onShare?: () => void
	canEdit?: boolean
	canMove?: boolean
	canManageAccess?: boolean
}> = memo(({ onDelete, itemId, onRename, onMove, onShare, canEdit = true, canMove = true, canManageAccess = true }) => (
	<div className='flex flex-col text-sm'>
		{canEdit && <button
			className='cursor-pointer flex items-center gap-2 rounded px-3 py-1.5 text-left text-md hover:bg-muted'
			onClick={onRename}
		>
			<SquarePen size={20} />
			Переименовать
		</button>}
		{canEdit && canMove && <button
			className='cursor-pointer flex items-center gap-2 rounded px-3 py-1.5 text-left text-md hover:bg-muted'
			onClick={onMove}
		>
			<FolderInput size={20} /> Переместить
		</button>}
		{canManageAccess && onShare && (
			<button
				className='cursor-pointer flex items-center gap-2 rounded px-3 py-1.5 text-left text-md hover:bg-muted'
				onClick={onShare}
			>
				<Share2 size={20} /> Поделиться
			</button>
		)}
		{canEdit && onDelete && itemId ? (
			<button
				className='cursor-pointer flex items-center gap-2 rounded px-3 py-1.5 text-left text-md hover:bg-muted'
				onClick={() => onDelete(itemId)}
			>
				<Trash2 size={20} /> Удалить
			</button>
		) : null}
	</div>
))

ContextMenuContent.displayName = 'ContextMenuContent'

export const FolderGrid = forwardRef<HTMLAnchorElement, FolderProps>(
	(
		{
			className,
			name,
			pathname,
			id,
			size,
			collaborators,
			canEdit = true,
			canMove = true,
			canManageAccess = true,
			canUndoDelete = true,
			...props
		},
		ref,
	) => {
		const queryClient = useQueryClient()
		const showToast = useToastStore(state => state.show)
		const [action, setAction] = useState<ResourceAction>(null)
		const [isShareOpen, setIsShareOpen] = useState(false)
		const itemSize = size || 100
		const itemHref = `${pathname}/${id}`

		const deleteFolder = useMutation({
			mutationFn: moveToTrash,
			onSuccess: () => {
				void invalidateStorageQueries(queryClient)
				showToast(
					`Папка «${name}» перемещена в корзину`,
					'success',
					canUndoDelete ? {
						label: 'Отменить',
						onClick: () => void restoreFromTrash({ id, type: 'folder' })
							.then(() => invalidateStorageQueries(queryClient))
							.catch(() => showToast('Не удалось восстановить папку', 'error')),
					} : undefined,
				)
			},
			onError: () => showToast('Не удалось переместить папку в корзину', 'error'),
		})

		const onDeleteFolder = (folderId: string) => {
			if (folderId) {
				deleteFolder.mutate({ id: folderId, type: 'folder' })
			}
		}

		return (
			<Popover >
				<PopoverContext.Consumer>
					{context => (
						<>
							<Link
								ref={ref}
								href={itemHref}
								className={cn(
									'relative flex flex-col items-center rounded-xl duration-200 hover:-translate-y-1',
									className,
								)}
								style={{ width: `${itemSize}px` }}
								{...props}
								onContextMenu={e => {
									e.preventDefault()
									context?.setCoords({ x: e.clientX, y: e.clientY })
									context?.setOpen(true)
								}}
							>
								<FolderAvatarStack collaborators={collaborators} />
								<FolderIcon size={itemSize} />
								<p className='mt-1 w-full text-center text-sm font-medium leading-tight line-clamp-2 wrap-break-word'>
									{name}
								</p>
								</Link>
								<button
									type='button'
									aria-label={`Действия с папкой ${name}`}
									aria-haspopup='menu'
									aria-expanded={context?.open ?? false}
									className='absolute left-1 top-1 z-20 rounded-md bg-card/90 p-1 text-muted-foreground shadow-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
									onClick={event => {
										const rect = event.currentTarget.getBoundingClientRect()
										context?.setCoords({ x: rect.left, y: rect.bottom + 4 })
										context?.setOpen(open => !open)
									}}
								>
									<EllipsisVertical size={18} />
								</button>
								<PopoverContent isContextMenu>
								<ContextMenuContent
									itemId={id}
									onDelete={onDeleteFolder}
									onRename={() => { context?.setOpen(false); setAction('rename') }}
									onMove={() => { context?.setOpen(false); setAction('move') }}
									onShare={() => { context?.setOpen(false); setIsShareOpen(true) }}
									canEdit={canEdit}
									canMove={canMove}
									canManageAccess={canManageAccess}
								/>
							</PopoverContent>
							<ResourceActionsDialogs
								id={id}
								type='folder'
								name={name}
								action={action}
								onClose={() => setAction(null)}
							/>
							{isShareOpen && (
								<ShareResourceDialog
									resourceId={id}
									resourceType='folder'
									resourceName={name}
									onClose={() => setIsShareOpen(false)}
								/>
							)}
						</>
					)}
				</PopoverContext.Consumer>
			</Popover>
		)
	},
)

FolderGrid.displayName = 'FolderGrid'

export const FolderLine = forwardRef<HTMLAnchorElement, FolderProps>(
	(
		{
			className,
			pathname,
			name,
			id,
			updatedAt,
			...props
		},
		ref,
	) => {
		const itemHref = `${pathname}/${id}`
		const [action, setAction] = useState<ResourceAction>(null)

		return (
			<Popover className='w-full'>
				<PopoverContext.Consumer>
					{context => (
						<>
							<Link
								ref={ref}
								href={itemHref}
								onContextMenu={e => {
									e.preventDefault()
									context?.setCoords({ x: e.clientX, y: e.clientY })
									context?.setOpen(true)
								}}
								className={cn(
									'w-full flex items-center rounded-lg p-2 hover:bg-muted',
									className,
								)}
								{...props}
							>
								<div className='flex w-[60%] items-center gap-3'>
									<FolderIcon size={30} />
									<span className='line-clamp-1 text-sm'>{name}</span>
								</div>
								<span className='w-[20%] text-sm text-muted-foreground'>
									{updatedAt
										? new Intl.DateTimeFormat('ru-RU', {
												day: '2-digit',
												month: 'short',
												year: 'numeric',
											}).format(new Date(updatedAt))
										: '—'}
								</span>
								<span className='w-[20%] text-sm text-muted-foreground'>Папка</span>
							</Link>
							<PopoverContent isContextMenu>
								<ContextMenuContent
									onRename={() => setAction('rename')}
									onMove={() => setAction('move')}
								/>
							</PopoverContent>
							<ResourceActionsDialogs
								id={id}
								type='folder'
								name={name}
								action={action}
								onClose={() => setAction(null)}
							/>
						</>
					)}
				</PopoverContext.Consumer>
			</Popover>
		)
	},
)

FolderLine.displayName = 'FolderLine'
