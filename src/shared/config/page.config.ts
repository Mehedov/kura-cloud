export const PAGES = {
	home: '/',
	folders: '/folders',
	photos: '/photos',
	settings: '/settings',
} as const

export type PAGES = typeof PAGES[keyof typeof PAGES]
