import $api from '@/shared/api/http'
import type { ICreateShare, IResourceShare, IShareUser, SharePermission } from '@/entities/share/model/share.types'

export const createShare = (payload: ICreateShare) =>
	$api.post<IResourceShare>('/shares', payload)

export const getReceivedShares = () => $api.get<IResourceShare[]>('/shares/received')

export const getSentShares = () => $api.get<IResourceShare[]>('/shares/sent')

export const searchShareUsers = (q: string) =>
	$api.get<IShareUser[]>('/shares/users', { params: { q } })

export const updateSharePermission = (shareId: string, permission: SharePermission) =>
	$api.patch<IResourceShare>(`/shares/${shareId}`, { permission })

export const revokeShare = (shareId: string) => $api.delete(`/shares/${shareId}`)
