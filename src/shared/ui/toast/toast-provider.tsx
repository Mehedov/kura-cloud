'use client'

import { useToastStore } from '@/shared/ui/toast/model/toast.store'
import { X } from 'lucide-react'
import useLanguage from '@/shared/language/model'

export function ToastProvider() {
	const { toasts, remove } = useToastStore()
	const { closeNotification } = useLanguage(state => state.t)
	return <div aria-live='polite' aria-atomic='false' className='fixed right-4 top-4 z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2'>
		{toasts.map(toast => <div key={toast.id} role={toast.variant === 'error' ? 'alert' : 'status'} className={`animate-overlay-in flex items-center justify-between gap-3 rounded-lg border p-3 text-sm shadow-lg ${toast.variant === 'error' ? 'border-destructive/30 bg-destructive text-white' : 'border-border bg-popover text-popover-foreground'}`}><span className='flex-1'>{toast.message}</span>{toast.action && <button onClick={() => { toast.action?.onClick(); remove(toast.id) }} className='font-semibold underline underline-offset-2'>{toast.action.label}</button>}<button type='button' aria-label={closeNotification} onClick={() => remove(toast.id)} className='rounded p-0.5 opacity-70 hover:opacity-100'><X size={15} /></button></div>)}
	</div>
}
