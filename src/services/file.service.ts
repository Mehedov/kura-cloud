import $api from '@/http/http'

export const getDownloadUrl = async (fileId: string) => {
	const response = await $api.get<{ downloadUrl: string }>(
		`/storage/download/${fileId}`,
	)
	return response.data
}
