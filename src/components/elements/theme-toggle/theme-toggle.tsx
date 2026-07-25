'use client'

import { type Theme } from '@/lib/theme'
import useThemeStore from '@/store/theme'
import { cn } from '@/utils/cn'
import { Moon, Sun } from 'lucide-react'
import { useRouter } from 'next/navigation'

const options: { value: Theme; label: string; Icon: typeof Sun }[] = [
	{ value: 'light', label: 'Светлая тема', Icon: Sun },
	{ value: 'dark', label: 'Тёмная тема', Icon: Moon },
]

export function ThemeToggle() {
	const { theme, isSaving, setTheme } = useThemeStore(state => state)
	const router = useRouter()

	const handleThemeChange = async (nextTheme: Theme) => {
		const wasSaved = await setTheme(nextTheme)
		if (wasSaved) router.refresh()
	}

	return (
		<div
			className='flex items-center rounded-lg border border-border bg-card p-1'
			role='group'
			aria-label='Выбор темы'
		>
			{options.map(({ value, label, Icon }) => (
				<button
					key={value}
					type='button'
					aria-label={label}
					aria-pressed={theme === value}
					disabled={isSaving}
					onClick={() => void handleThemeChange(value)}
					className={cn(
						'flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
						theme === value &&
							'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
					)}
				>
					<Icon size={17} />
				</button>
			))}
		</div>
	)
}
