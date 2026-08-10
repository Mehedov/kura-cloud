import { create } from 'zustand'

export type Toast = { id: string; message: string; variant?: 'success' | 'error'; action?: { label: string; onClick: () => void } }

export const useToastStore = create<{
	toasts: Toast[]
	show: (message: string, variant?: Toast['variant'], action?: Toast['action']) => void
	remove: (id: string) => void
}>(set => ({
	toasts: [],
	show: (message, variant = 'success', action) => {
		const id = crypto.randomUUID()
		set(state => ({ toasts: [...state.toasts, { id, message, variant, action }] }))
		setTimeout(() => set(state => ({ toasts: state.toasts.filter(toast => toast.id !== id) })), action ? 8000 : 4000)
	},
	remove: id => set(state => ({ toasts: state.toasts.filter(toast => toast.id !== id) })),
}))
