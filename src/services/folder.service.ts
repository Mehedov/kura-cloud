import $api from '@/http/http'
import { ICreateFolder, IDeleteFolder } from '@/types/folder.type'

export const getMyFolders = () => {
	try {
		return $api.get('/storage/folders')
	} catch (e) {
		console.error('Get user error:', e)
		throw e
	}
}

export const createFolder = (data: ICreateFolder) => {
	try {
		return $api.post('/storage/folder', data)
	} catch (e) {
		console.error('Get user error:', e)
		throw e
	}
}
export const hardDeleteFolder = (payload: IDeleteFolder) => {
	try {
		return $api.delete('/storage/hard-delete', { data: payload })
	} catch (e) {
		console.error('Get user error:', e)
		throw e
	}
}
