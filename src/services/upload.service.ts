import $api from '@/http/http'

interface IUploadRes {
	file: File
	folderId: string
}

export const upload = ({ file, folderId }: IUploadRes) => {
	const formData = new FormData()

	if (file && folderId) {
		formData.append('file', file)
		formData.append('folderId', folderId)
	}
	try {
		return $api.post('/storage/upload', formData)
	} catch (e) {
		console.error('Get user error:', e)
		throw e
	}
}
