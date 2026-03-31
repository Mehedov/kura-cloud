export interface ICreateFolder {
	name: string
	parentId?: string
}

export interface IDeleteFolder {
	id: string
	type: string
}

export interface IFolder {
	createdAt: string
	deletedAt: string | null
	folderId: string
	id: string
	isDeleted: boolean
	isFavorite: boolean
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
	files: IFolder[]
	folders: []
}
