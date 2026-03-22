import axios from 'axios'
import Cookies from 'js-cookie'

const $api = axios.create({
	withCredentials: true,
	baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
})

$api.interceptors.request.use(config => {
	config.headers.Authorization = `Bearer ${Cookies.get('token')}`
	return config
})

export default $api
