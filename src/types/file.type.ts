export interface PhotoFileDto {
	id: string
	name: string
	type: 'photo'
	size: string | number
	s3Key: string
	thumbnailKey: string | null
	thumbnailUrl?: string
	isDeleted: boolean
	deletedAt: string | null
	userId?: string
	folderId?: string | null
	createdAt?: string
	updatedAt?: string
}
