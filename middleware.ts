import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Список путей, которые требуют авторизации
const protectedRoutes = ['/']
// Список путей только для неавторизованных (логин/регистрация)
const authRoutes = ['/auth']

export function middleware(request: NextRequest) {
	const token = request.cookies.get('token')?.value
	const { pathname } = request.nextUrl

	// 1. Если пользователь не авторизован и идет на защищенный роут
	if (!token && protectedRoutes.includes(pathname)) {
		return NextResponse.redirect(new URL('/auth', request.url))
	}

	// 2. Если пользователь авторизован и пытается зайти на страницу логина
	if (token && authRoutes.includes(pathname)) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	return NextResponse.next()
}

// Указываем, на какие пути должен срабатывать middleware
export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
