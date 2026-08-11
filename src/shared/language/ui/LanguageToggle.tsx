'use client'

import { LANGUAGES, type Language } from '@/shared/language/lib/language'
import useLanguage from '@/shared/language/model'
import { cn } from '@/shared/lib/cn'
import { useRouter } from 'next/navigation'

export function LanguageToggle() {
	const { language, isSaving, setLanguage } = useLanguage(state => state)
	const { languageSelection, russianLanguage, englishLanguage } = useLanguage(state => state.t)
	const router = useRouter()

	const handleLanguageChange = async (nextLanguage: Language) => {
		const wasSaved = await setLanguage(nextLanguage)
		if (wasSaved) router.refresh()
	}

	return (
		<div className='flex items-center rounded-lg border border-border bg-card p-1' role='group' aria-label={languageSelection}>
			{LANGUAGES.map(value => (
				<button
					key={value}
					type='button'
					aria-label={value === 'ru' ? russianLanguage : englishLanguage}
					aria-pressed={language === value}
					disabled={isSaving}
					onClick={() => void handleLanguageChange(value)}
					className={cn(
						'flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
						language === value && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
					)}
				>
					{value.toUpperCase()}
				</button>
			))}
		</div>
	)
}
