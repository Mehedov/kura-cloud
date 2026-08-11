export type ShareResourceType = 'folder' | 'file'
export type SharePermission = 'viewer' | 'editor'

export interface IShareResource {
	id: string
	name: string
	type: ShareResourceType
	fileType?: 'photo' | 'video' | 'document' | 'other'
	size?: string
	folderId?: string | null
	parentId?: string | null
}

export interface IResourceShare {
	id: string
	resource: IShareResource
	permission: SharePermission
	owner?: { id: string; name: string; email: string; avatarUrl?: string | null }
	recipient?: { id: string; name: string; email: string }
	editors: Array<{ id: string; name: string; avatarUrl?: string | null }>
	createdAt: string
	updatedAt: string
}

export interface ICreateShare {
	resourceId: string
	resourceType: ShareResourceType
	recipientEmail: string
	permission: SharePermission
}

export interface IShareUser {
	id: string
	name: string
	email: string
	avatarUrl: string | null
	avatarColor: 'sky' | 'violet' | 'emerald' | 'rose' | 'amber' | null
}
