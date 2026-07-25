export interface ICreateFolder {
	name: string
	parentId?: string
}

export interface IFolderSummary {
	id: string
	name: string
	parentId: string | null
	createdAt?: string
	updatedAt?: string
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
	type: string
}

export interface IStorageFile {
	createdAt: string
	deletedAt: string | null
	folderId: string
	id: string
	isDeleted: boolean
	name: string
	s3Key: string
	size: string
	thumbnailKey: string
	thumbnailUrl: string
	type: string
	updatedAt: string
	userId: string
}

export interface IFolderContent {
	files: IStorageFile[]
	folders: IFolderSummary[]
}

export type FolderItemsSort = 'name' | 'updatedAt' | 'size'
export type FolderItemsOrder = 'asc' | 'desc'
export type FolderItemsType = 'photo' | 'video' | 'document' | 'other'

export interface IFolderItemsParams {
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
	folder: Pick<IFolderSummary, 'id' | 'name' | 'parentId'> | null
	items: IFolderItem[]
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
	}
}
