import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/shared/ui/breadcrumb'
import { usePathname } from 'next/navigation'
import React from 'react'
import useLanguage from '@/shared/language/model'

interface BreadcrumbBasicProps {
	currentPageTitle?: string
}

export function BreadcrumbBasic({ currentPageTitle }: BreadcrumbBasicProps) {
	const pathname = usePathname()
	const { home } = useLanguage(state => state.t)
	const pathSegments = pathname.split('/').filter(segment => segment !== '')

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href='/'>{home}</BreadcrumbLink>
				</BreadcrumbItem>
				{pathSegments.length > 0 && <BreadcrumbSeparator />}
				{pathSegments.map((segment, index) => {
					const href = `/${pathSegments.slice(0, index + 1).join('/')}`
					const isLast = index === pathSegments.length - 1

					const decodedSegment = decodeURIComponent(segment)

					const title = isLast && currentPageTitle
						? currentPageTitle
						: decodedSegment.charAt(0) +
							decodedSegment.slice(1).replace(/-/g, ' ')

					return (
						<React.Fragment key={href}>
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage>{title}</BreadcrumbPage>
								) : (
									<BreadcrumbLink href={href}>{title}</BreadcrumbLink>
								)}
							</BreadcrumbItem>
							{!isLast && <BreadcrumbSeparator />}
						</React.Fragment>
					)
				})}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
