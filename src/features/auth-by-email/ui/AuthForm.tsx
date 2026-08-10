'use client'

import { Button } from '@/shared/ui/button/Button'
import Input from '@/shared/ui/input/input'
import useAuthStore from '@/entities/session/model/session.store'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Auth() {
	const router = useRouter()
	const { login, register } = useAuthStore()
	const queryClient = useQueryClient()

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
			await queryClient.cancelQueries()
			queryClient.clear()

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
			setError(
				axios.isAxiosError(e)
					? (e.response?.data?.error ?? 'Произошла ошибка при входе')
					: 'Произошла ошибка при входе',
			)
		}
	}

	return (
		<div className='flex min-h-screen items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8'>
			<div className='w-full max-w-md space-y-8'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-foreground'>
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
								className='block text-sm font-medium text-foreground'
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

					<div className='space-y-1.5'>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-foreground'
						>
							Электронная почта
						</label>
						<Input
							id='email'
							type='email'
							required
							value={formData.email}
							onChange={e =>
								setFormData({ ...formData, email: e.target.value })
							}
						/>
					</div>

					<div className='space-y-1.5'>
						<label
							htmlFor='password'
							className='block text-sm font-medium text-foreground'
						>
							Пароль
						</label>
						<Input
							id='password'
							type='password'
							required
							value={formData.password}
							onChange={e =>
								setFormData({ ...formData, password: e.target.value })
							}
						/>
					</div>

					<Button className='w-full'>
						{isLogin ? 'Войти' : 'Зарегистрироваться'}
					</Button>
				</form>

				<div className='text-center mt-4'>
					<Button variant='ghost' onClick={toggleForm} className='m-auto'>
						{isLogin
							? 'Нет аккаунта? Зарегистрируйтесь'
							: 'Уже есть аккаунт? Войдите'}
					</Button>
				</div>
			</div>
		</div>
	)
}
