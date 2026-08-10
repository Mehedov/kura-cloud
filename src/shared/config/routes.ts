export const PUBLIC_ROUTES = ['/auth'] as const

export const isPublicRoute = (pathname: string) =>
	PUBLIC_ROUTES.includes(pathname as (typeof PUBLIC_ROUTES)[number])
