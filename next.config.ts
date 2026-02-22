import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	// Указываем только префикс продукта
	basePath: '/drive',

	async redirects() {
		return [
			{
				// Когда заходим на localhost:3000
				source: '/',
				destination: '/drive/home',
				basePath: false,
				permanent: false,
			},
			{
				// Когда заходим на localhost:3000/drive (корень продукта)
				source: '/',
				destination: '/home',
				permanent: false,
			},
		]
	},
}

export default nextConfig
