import $api from '@/http/http'
import { IUser } from '@/store/auth'
import { AxiosResponse } from 'axios'

export const getUserInfo = async (): Promise<AxiosResponse<IUser>> => {
	try {
		return $api.get<IUser>('/auth/me')
	} catch (e) {
		console.error('Get user error:', e)
		throw e
	}
}
