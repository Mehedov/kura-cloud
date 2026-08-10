import $api from '@/shared/api/http'

export const upload = async (
	files: File[],
	folderId: string | null,
	onProgress: (fileIndex: number, percent: number) => void = () => {},
) => {
	const activityBatchId = crypto.randomUUID()
	const uploadPromises = Array.from(files).map(async (file, fileIndex) => {
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

						onProgress(fileIndex, percentCompleted)
					},
				})
			return { fileIndex, status: 'success' as const, data: response.data }
		} catch (error) {
			console.error(`Ошибка при загрузке ${file.name}`, error)
			return { fileIndex, status: 'error' as const, error }
		}
	})

	return Promise.all(uploadPromises)
}
