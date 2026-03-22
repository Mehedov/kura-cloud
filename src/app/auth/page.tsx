'use client'

import useAuthStore from '@/store/auth'
import { useRouter } from 'next/navigation' // Важно: для App Router используем это
import { useState } from 'react'

export default function Auth() {
	const router = useRouter()
	const { login, register } = useAuthStore()

	const [isLogin, setIsLogin] = useState(true)
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
	})
	const [error, setError] = useState<string | null>(null)

	const toggleForm = () => {
		setIsLogin(prev => !prev)
		setError(null)
	}

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		setError(null)

		try {
			if (isLogin) {
				await login({ email: formData.email, password: formData.password })
			} else {
				await register({
					email: formData.email,
					name: formData.name,
					password: formData.password,
				})
			}

			router.push('/')
			router.refresh()
		} catch (e) {
			console.error('Auth error:', e)
			setError(e.response?.data?.message || 'Произошла ошибка при входе')
		}
	}

	return (
		<div className='flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='w-full max-w-md space-y-8'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
						{isLogin ? 'Вход' : 'Регистрация'}
					</h2>
					{error && (
						<p className='text-red-500 text-center text-sm mt-2'>{error}</p>
					)}
				</div>

				<form className='mt-8 space-y-6' onSubmit={handleSubmit}>
					{!isLogin && (
						<div>
							<label
								htmlFor='name'
								className='block text-sm font-medium text-gray-700'
							>
								Имя
							</label>
							<input
								id='name'
								type='text'
								required
								value={formData.name}
								onChange={e =>
									setFormData({ ...formData, name: e.target.value })
								}
								className='mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2'
							/>
						</div>
					)}

					<div>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-gray-700'
						>
							Электронная почта
						</label>
						<input
							id='email'
							type='email'
							required
							value={formData.email}
							onChange={e =>
								setFormData({ ...formData, email: e.target.value })
							}
							className='mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2'
						/>
					</div>

					<div>
						<label
							htmlFor='password'
							className='block text-sm font-medium text-gray-700'
						>
							Пароль
						</label>
						<input
							id='password'
							type='password'
							required
							value={formData.password}
							onChange={e =>
								setFormData({ ...formData, password: e.target.value })
							}
							className='mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2'
						/>
					</div>

					<button
						type='submit'
						className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 transition-colors'
					>
						{isLogin ? 'Войти' : 'Зарегистрироваться'}
					</button>
				</form>

				<div className='text-center mt-4'>
					<button
						type='button'
						onClick={toggleForm}
						className='text-indigo-600 hover:text-indigo-500 text-sm font-medium'
					>
						{isLogin
							? 'Нет аккаунта? Зарегистрируйтесь'
							: 'Уже есть аккаунт? Войдите'}
					</button>
				</div>
			</div>
		</div>
	)
}
