
import type { Metadata } from 'next'
import './globals.css'

import MainContainer from '@/components/containers/main-container'

import QueryProvider from '@/providers/query-provider'
import { ThemeBootstrap } from '@/providers/theme-bootstrap'

const themeBootstrapScript = `(() => {
  try {
    const savedTheme = localStorage.getItem('kura-theme');
    const theme = ['light', 'dark'].includes(savedTheme) ? savedTheme : 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  } catch {}
})()`

export const metadata: Metadata = {
	title: 'Kura Drive',
	description: 'Personal cloud storage',
}
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
			</head>
			<body className='antialiased box-border h-full m-0'>
				<ThemeBootstrap />
				<QueryProvider>
					<MainContainer>{children}</MainContainer>
				</QueryProvider>
			</body>
		</html>
	)
}
