import { create } from 'zustand'
import {
	IAuthResponse,
	ILogin,
	IRegister,
	IUser,
} from '@/entities/session/model/session.types'
import $api, { authApi } from '@/shared/api/http'

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
	setIsAuth: value =>
		set(state => ({ isAuth: value, user: value ? state.user : null })),

	checkAuth: async () => {
		set({ isLoading: true })
		try {
			const response = await authApi.get<IAuthResponse>('/auth/refresh')
			set({ isAuth: true, user: response.data.user })
		} catch {
			set({ isAuth: false, user: null })
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
			set({ isAuth: true, user: response.data.user })
		} catch (e) {
			console.error('Registration error:', e)
			throw e
		}
	},

	login: async (userData: ILogin) => {
		try {
			const response = await $api.post<IAuthResponse>('/auth/login', userData)
			set({ isAuth: true, user: response.data.user })
		} finally {
			set({ isLoading: false })
		}
	},

	logout: async () => {
		try {
			await $api.post('/auth/logout')
		} finally {
			set({ isAuth: false, user: null, isLoading: false })
		}
	},
}))

export default useAuthStore
