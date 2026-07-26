export const FOLDER_KEYS = {
	all: ['home-folders'],
	root: ['root-folders'],
	suggested: ['suggested-folders'],
	storageStats: ['storage-stats'],
	files: ['FILES'],
	// homeFolders: () => [...FOLDER_KEYS.all, 'home-folders'] ,
} as const

export const PHOTOS = {
	photos: ['photos'],
} as const
