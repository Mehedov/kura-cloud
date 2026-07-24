import $api from '@/http/http'

export const upload = async (
	files: File[],
	folderId: string | null,
	onProgress: (fileName: string, percent: number) => void = () => {},
) => {
	const activityBatchId = crypto.randomUUID()
	const uploadPromises = Array.from(files).map(async file => {
		const formData = new FormData()
		formData.append('file', file)
		if (folderId) formData.append('folderId', folderId)
		formData.append('activityBatchId', activityBatchId)

		try {
			const response = await $api.post('/storage/upload', formData, {
				onUploadProgress: progressEvent => {
					const total = progressEvent.total || file.size
					const percentCompleted = Math.round(
						(progressEvent.loaded * 100) / total,
					)

					onProgress(file.name, percentCompleted)
				},
			})
			return response.data
		} catch (error) {
			console.error(`Ошибка при загрузке ${file.name}`, error)
			throw error
		}
	})

	return Promise.all(uploadPromises)
}
