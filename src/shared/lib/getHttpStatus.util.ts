import axios from 'axios'

export const getHttpStatus = (error: unknown) =>
	axios.isAxiosError(error) ? error.response?.status : undefined
