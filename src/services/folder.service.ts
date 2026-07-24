import $api from '@/http/http'
import {
	ICreateFolder,
	IDeleteFolder,
	IFolderContent,
	IFolderSummary,
	ISuggestedFoldersResponse,
} from '@/types/folder.type'
import type { AxiosResponse } from 'axios'

export const getMyFolders = (): Promise<AxiosResponse<IFolderSummary[]>> => {
	try {
		return $api.get('/storage/folders')
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

export const hardDeleteFolder = (payload: IDeleteFolder) => {
	try {
		return $api.post('/storage/hard-delete', payload)
	} catch (e) {
		console.error('Get user error:', e)
		throw e
	}
}
