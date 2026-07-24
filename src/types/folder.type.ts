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
