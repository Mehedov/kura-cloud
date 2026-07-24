import { IUser } from '@/store/auth'

export interface IAuthResponse {
	user: IUser
}

export interface ILogin {
	email: string
	password: string
}

export interface IRegister {
	email: string
	name: string
	password: string
}
