import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const authRoutes = ['/auth']

export function middleware(request: NextRequest) {
	const token = request.cookies.get('token')?.value
	const { pathname } = request.nextUrl

	const isAuthRoute = authRoutes.includes(pathname)

	if (!token && !isAuthRoute) {
		return NextResponse.redirect(new URL('/auth', request.url))
	}

	if (token && isAuthRoute) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	return NextResponse.next()
}

// Указываем, на какие пути должен срабатывать middleware
export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
