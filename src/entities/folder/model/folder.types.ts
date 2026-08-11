export interface ICreateFolder {
	name: string
	parentId?: string
}

export interface IFolderSummary {
	id: string
	name: string
	parentId: string | null
	isFavorite?: boolean
	createdAt?: string
	updatedAt?: string
	deletedBy?: { id: string; name: string; avatarUrl: string | null; avatarColor: string | null } | null
	collaborators?: {
		owner: { id: string; name: string; avatarUrl?: string | null } | null
		editors: Array<{ id: string; name: string; avatarUrl?: string | null }>
	}
}

export interface ISuggestedFolder extends IFolderSummary {
	lastActivityAt: string
	reason: string
}

export interface ISuggestedFoldersResponse {
	items: ISuggestedFolder[]
	generatedAt: string
}

export interface IDeleteFolder {
	id: string
	type: 'folder' | 'file'
}

export interface IRenameResource extends IDeleteFolder {
	name: string
}

export interface IMoveResource extends IDeleteFolder {
	targetFolderId: string | null
}

export interface IStorageFile {
	createdAt: string
	deletedAt: string | null
	folderId: string
	id: string
	isDeleted: boolean
	isFavorite?: boolean
	name: string
	s3Key: string
	size: string
	thumbnailKey: string
	thumbnailUrl: string
	type: FolderItemsType
	updatedAt: string
	userId: string
	deletedBy?: { id: string; name: string; avatarUrl: string | null; avatarColor: string | null } | null
	user?: {
		id: string
		name: string
		avatarUrl: string | null
		avatarColor: 'sky' | 'violet' | 'emerald' | 'rose' | 'amber' | null
	}
	editors?: Array<{ id: string; name: string; avatarUrl: string | null; avatarColor: 'sky' | 'violet' | 'emerald' | 'rose' | 'amber' | null }>
}

export interface IFolderContent {
	files: IStorageFile[]
	folders: IFolderSummary[]
}

export type FolderItemsSort = 'name' | 'updatedAt' | 'size'
export type FolderItemsOrder = 'asc' | 'desc'
export type FolderItemsType = 'photo' | 'video' | 'document' | 'other'

export interface IFolderItemsParams {
	kind?: 'folders' | 'files'
	sort?: FolderItemsSort
	order?: FolderItemsOrder
	type?: FolderItemsType
	q?: string
	page?: number
	limit?: number
}

export type IFolderItem =
	| (IFolderSummary & { kind: 'folder' })
	| (IStorageFile & { kind: 'file' })

export interface IFolderItemsResponse {
	folder: (Pick<IFolderSummary, 'id' | 'name' | 'parentId'> & {
		permission?: 'owner' | 'viewer' | 'editor'
	}) | null
	items: IFolderItem[]
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
	}
}

export interface ITrashResponse {
	folders: IFolderSummary[]
	files: IStorageFile[]
}
