import { create } from 'zustand'
import Cookies from 'js-cookie'
import { IAuthResponse, ILogin, IRegister } from '@/types/auth.type'
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
	setIsAuth: (bool: boolean) => void
	checkAuth: () => Promise<void>
	login: (userData: ILogin) => Promise<void>
	register: (userData: IRegister) => Promise<void>
	logout: () => Promise<void>
}

const useAuthStore = create<IAuth>(set => ({
	isAuth: false,
	user: null,
	isLoading: true,
	setIsAuth: value => set({ isAuth: value }),

	checkAuth: async () => {
		set({ isLoading: true })
		try {
			const response = await $api.get(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/refresh`,
			)
			Cookies.set('token', response.data.accessToken)
			set({ isAuth: true, user: response.data.user })
		} catch {
			set({ isAuth: false, user: null })
			Cookies.remove('token')
		} finally {
			set({ isLoading: false })
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

	login: async (userData: ILogin) => {
		try {
			const response = await $api.post<IAuthResponse>('/auth/login', userData)
			Cookies.set('token', response.data.accessToken)
			set({ isAuth: true, user: response.data.user })
		} finally {
			set({ isLoading: false })
		}
	},

	logout: async () => {
		try {
			await $api.post('/auth/logout')
		} finally {
			Cookies.remove('token')
			
			set({ isAuth: false, user: null, isLoading: false })
		}
	},
}))

export default useAuthStore
