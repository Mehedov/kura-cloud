import { create } from 'zustand'
import Cookies from 'js-cookie'
import { redirect } from 'next/navigation'
import { getUserInfo } from '@/services/user.service'
import { IAuthResponse, ILogin, IRegister } from '@/types/auth.type'
import { AxiosResponse } from 'axios'
import $api from '@/http/http'

export interface IUser {
	id: string
	email: string
	name: string
	avatarUrl: string | null
	usedCapacity: string
	diskCapacity: string
}

interface IAuth {
	isAuth: boolean
	user: IUser | null
	isLoading: boolean
	checkAuth: () => Promise<void>
	login: (userData: ILogin) => Promise<void>
	register: (userData: IRegister) => Promise<void>
	logout: () => Promise<void>
}

const useAuthStore = create<IAuth>(set => ({
	isAuth: false,
	user: null,
	isLoading: true,
	checkAuth: async () => {
		try {
			const response = await $api.get(
				`${process.env.NEXT_PUBLIC_SERVER_URL + '/auth/refresh'}`,
			)
			Cookies.set('token', response.data.accessToken)
			set({ isAuth: true, user: response.data.user })
		} catch (e) {}
	},
	login: async (userData: ILogin) => {
		try {
			const response = await $api.post<IAuthResponse>('/auth/login', userData)
			Cookies.set('token', response.data.accessToken)
			set({ isAuth: true, user: response.data.user })
		} catch (e) {
			console.error('Login error:', e)
			throw e
		}
	},

	register: async (userData: IRegister) => {
		try {
			const response = await $api.post<IAuthResponse>(
				'/auth/register',
				userData,
			)
			Cookies.set('token', response.data.accessToken)
			set({ isAuth: true, user: response.data.user })
		} catch (e) {
			console.error('Registration error:', e)
			throw e
		}
	},

	logout: async () => {
		try {
			const response = await $api.post('/auth/logout')
			Cookies.remove('token')
			set({ isAuth: false, user: {} as IUser })
		} catch (e) {
			console.log(e)
		}
	},
}))

export default useAuthStore
