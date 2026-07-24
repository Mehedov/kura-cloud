import $api from '@/http/http'
import { PhotoFileDto } from '@/types/file.type'

export const getDownloadUrl = async (fileId: string) => {
	const response = await $api.get<{ downloadUrl: string }>(
		`/storage/download/${fileId}`,
	)
	return response.data
}

export const getPhotos = async () => {
	const response = await $api.get<PhotoFileDto[]>(`/storage/photos`)
	return response.data
}
