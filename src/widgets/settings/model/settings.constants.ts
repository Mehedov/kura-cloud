import type { StorageCategory } from '@/entities/storage/model/storage.types'

export const SELECT_CLASS =
	'rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'

export const AVATAR_COLORS = [
	{ value: 'sky', className: 'bg-sky-500', label: 'Голубой' },
	{ value: 'violet', className: 'bg-violet-500', label: 'Фиолетовый' },
	{ value: 'emerald', className: 'bg-emerald-500', label: 'Изумрудный' },
	{ value: 'rose', className: 'bg-rose-500', label: 'Розовый' },
	{ value: 'amber', className: 'bg-amber-500', label: 'Янтарный' },
] as const

export type AvatarColor = (typeof AVATAR_COLORS)[number]['value']
export type ConfirmAction = 'logout' | 'empty-trash' | 'delete-account' | null

export const CATEGORY_COLORS: Record<StorageCategory, string> = {
	Photo: 'bg-rose-500',
	Video: 'bg-emerald-500',
	Document: 'bg-blue-500',
	'Other files': 'bg-amber-500',
	'Free Storage': 'bg-muted-foreground/35',
}
