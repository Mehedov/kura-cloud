import $api from '@/http/http'
import { ILogin, IRegister, IAuthResponse } from '@/types/auth.type'
import { AxiosResponse } from 'axios'
import Cookies from 'js-cookie'

export const login = async (
	userData: ILogin,
): Promise<AxiosResponse<IAuthResponse>> => {
	try {
		return $api.post<IAuthResponse>('/auth/login', userData)
	} catch (e) {
		console.error('Login error:', e)
		throw e
	}
}

export const register = async (
	userData: IRegister,
): Promise<AxiosResponse<IAuthResponse>> => {
	try {
		return $api.post<IAuthResponse>('/auth/register', userData)
	} catch (e) {
		console.error('Registration error:', e)
		throw e
	}
}

export const logout = () => {
	try {
		return $api.post('/auth/logout')
	} catch (e) {
		console.error('Get user error:', e)
		throw e
	}
}
