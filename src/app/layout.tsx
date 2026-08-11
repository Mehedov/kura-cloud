import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import './globals.css'

import { parseTheme, THEME_COOKIE } from '@/shared/theme/lib/theme'
import { LANGUAGE_COOKIE, parseLanguage } from '@/shared/language/lib/language'
import QueryProvider from '@/shared/providers/query-provider'
import { ThemeBootstrap } from '@/shared/providers/theme-bootstrap'
import { LanguageBootstrap } from '@/shared/providers/language-bootstrap'

export const metadata: Metadata = {
	title: 'Kura Drive',
	description: 'Personal cloud storage',
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const cookieStore = await cookies()
	const theme = parseTheme(cookieStore.get(THEME_COOKIE)?.value)
	const language = parseLanguage(cookieStore.get(LANGUAGE_COOKIE)?.value)

	return (
		<html lang={language} data-theme={theme} suppressHydrationWarning>
			<body className='m-0 box-border h-full antialiased'>
				<ThemeBootstrap theme={theme} />
				<LanguageBootstrap language={language} />
				<QueryProvider>{children}</QueryProvider>
			</body>
		</html>
	)
}
