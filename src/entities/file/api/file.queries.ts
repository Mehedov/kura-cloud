import $api from '@/shared/api/http'
import { PhotosResponse } from '@/entities/file/model/file.types'
import type { IFolderItemsParams } from '@/entities/folder/model/folder.types'

export const getDownloadUrl = async (fileId: string) => {
	const response = await $api.get<{ downloadUrl: string }>(
		`/storage/download/${fileId}`,
	)
	return response.data
}

export const getPreviewUrl = async (fileId: string) => {
	const response = await $api.get<{ previewUrl: string }>(
		`/storage/preview/${fileId}`,
	)
	return response.data
}

export const getPhotos = async (params: IFolderItemsParams) => {
	const response = await $api.get<PhotosResponse>(`/storage/photos`, { params })
	return response.data
}
