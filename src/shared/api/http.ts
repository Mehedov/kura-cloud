import axios, { type AxiosError } from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'

const axiosConfig = {
	withCredentials: true,
	baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
}

const $api = axios.create(axiosConfig)
export const authApi = axios.create(axiosConfig)

const refreshAuthLogic = () => authApi.get('/auth/refresh')

createAuthRefreshInterceptor($api, refreshAuthLogic, {
	shouldRefresh: (error: AxiosError) =>
		error.response?.status === 401 &&
		!error.config?.url?.includes('/auth/refresh'),
})

export default $api
