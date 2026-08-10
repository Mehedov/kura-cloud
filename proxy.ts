import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isPublicRoute } from './src/shared/config/routes'

export function proxy(request: NextRequest) {
	const hasSession = Boolean(
		request.cookies.get('accessToken')?.value ||
			request.cookies.get('refreshToken')?.value,
	)
	const { pathname } = request.nextUrl

	if (!hasSession && !isPublicRoute(pathname)) {
		return NextResponse.redirect(new URL('/auth', request.url))
	}

	if (hasSession && isPublicRoute(pathname)) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
