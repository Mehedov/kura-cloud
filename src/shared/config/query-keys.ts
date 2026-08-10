export const FOLDER_KEYS = {
	all: ['home-folders'],
	root: ['root-folders'],
	suggested: ['suggested-folders'],
	storageStats: ['storage-stats'],
	shares: ['shares'],
	favorites: ['favorites'],
	files: ['FILES'],
	// homeFolders: () => [...FOLDER_KEYS.all, 'home-folders'] ,
} as const

export const PHOTOS = {
	photos: ['photos'],
} as const

export const TRASH_KEY = ['trash'] as const

export const STORAGE_QUERY_ROOTS = [
	FOLDER_KEYS.all,
	FOLDER_KEYS.root,
	FOLDER_KEYS.suggested,
	FOLDER_KEYS.storageStats,
	FOLDER_KEYS.favorites,
	FOLDER_KEYS.files,
	PHOTOS.photos,
	TRASH_KEY,
] as const
