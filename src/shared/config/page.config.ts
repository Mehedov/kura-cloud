export const PAGES = {
	home: '/',
	folders: '/folders',
	photos: '/photos',
} as const

export type PAGES = typeof PAGES[keyof typeof PAGES]