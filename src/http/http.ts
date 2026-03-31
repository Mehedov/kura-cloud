import axios from 'axios'
import Cookies from 'js-cookie'
import createAuthRefreshInterceptor from 'axios-auth-refresh'

const $api = axios.create({
	withCredentials: true,
	baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
})

$api.interceptors.request.use(config => {
	const token = Cookies.get('token')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

const refreshAuthLogic = failedRequest =>
	axios
		.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/refresh`, {
			withCredentials: true,
		})
		.then(tokenRefreshResponse => {
			const newToken = tokenRefreshResponse.data.accessToken
			Cookies.set('token', newToken)
			failedRequest.response.config.headers['Authorization'] =
				'Bearer ' + newToken
			return Promise.resolve()
		})

createAuthRefreshInterceptor($api, refreshAuthLogic)

export default $api
