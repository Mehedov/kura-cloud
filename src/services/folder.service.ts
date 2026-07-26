import $api from '@/http/http'
import {
	ICreateFolder,
	IDeleteFolder,
	IFolderContent,
	IFolderItemsParams,
	IFolderItemsResponse,
	IFolderSummary,
	IMoveResource,
	IRenameResource,
	ISuggestedFoldersResponse,
	ITrashResponse,
} from '@/types/folder.type'
import type { AxiosResponse } from 'axios'

export const getMyFolders = (params?: {
	q?: string
	limit?: number
}): Promise<AxiosResponse<IFolderSummary[]>> => {
	try {
		return $api.get('/storage/folders', { params })
	} catch (e) {
		console.error('Get user error:', e)
		throw e
	}
}

export const getSuggestedFolders = () => {
	return $api.get<ISuggestedFoldersResponse>('/storage/suggested-folders', {
		params: { limit: 5 },
	})
}

export const createFolder = (data: ICreateFolder) => {
	try {
		return $api.post('/storage/folder', data)
	} catch (e) {
		console.error('Get user error:', e)
		throw e
	}
}

export const getFolderContent = (
	folderId: string,
): Promise<AxiosResponse<IFolderContent>> => {
	try {
		return $api.get<IFolderContent>('/storage/content', {
			params: { folderId },
		})
	} catch (e) {
		console.error('Get user error:', e)
		throw e
	}
}

export const getFolderItems = (
	folderId: string,
	params: IFolderItemsParams,
): Promise<AxiosResponse<IFolderItemsResponse>> =>
	$api.get(`/storage/folders/${folderId}/items`, { params })

export const getAllFiles = (params: IFolderItemsParams) =>
	$api.get<Omit<IFolderItemsResponse, 'folder'>>('/storage/files', { params })

export const hardDeleteFolder = (payload: IDeleteFolder) => {
	try {
		return $api.post('/storage/hard-delete', payload)
	} catch (e) {
		console.error('Get user error:', e)
		throw e
	}
}

export const moveToTrash = (payload: IDeleteFolder) =>
	$api.delete('/storage/delete', { data: payload })

export const getTrash = () => $api.get<ITrashResponse>('/storage/trash')

export const restoreFromTrash = (payload: IDeleteFolder) =>
	$api.post('/storage/restore', payload)

export const renameResource = (payload: IRenameResource) =>
	$api.patch('/storage/rename', payload)

export const moveResource = (payload: IMoveResource) =>
	$api.patch('/storage/move', payload)
