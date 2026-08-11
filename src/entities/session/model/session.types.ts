export interface IUser {
	id: string
	email: string
	name: string
	avatarUrl: string | null
	avatarColor: 'sky' | 'violet' | 'emerald' | 'rose' | 'amber' | null
	usedCapacity: string
	diskCapacity: string
}

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
