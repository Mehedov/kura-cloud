'use client'

import { useDebouncedValue } from '@/shared/hooks/use-debounced-value'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'

interface FolderBrowserSearchProps {
	initialValue: string
	onSearch: (value: string) => void
}

export function FolderBrowserSearch({
	initialValue,
	onSearch,
}: FolderBrowserSearchProps) {
	const [value, setValue] = useState(initialValue)
	const debouncedValue = useDebouncedValue(value)

	useEffect(() => {
		onSearch(debouncedValue)
	}, [debouncedValue, onSearch])

	return (
		<label className='flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground'>
			<Search size={16} />
			<input
				value={value}
				onChange={event => setValue(event.target.value)}
				placeholder='Поиск в папке'
				className='w-36 bg-transparent text-foreground outline-none placeholder:text-muted-foreground sm:w-52'
			/>
		</label>
	)
}
