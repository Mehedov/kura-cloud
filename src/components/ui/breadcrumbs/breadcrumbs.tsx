import React, { ReactElement } from 'react'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from './breadcrumb'

interface Props {
	routes: string[]
}

export function Breadcrumbs({ routes }: Props) {
	const fullHref: string | undefined = undefined
	const breadcrumbItems: ReactElement[] = []
	let breadcrumbPage: ReactElement = <></>

	routes.forEach((route, index) => {
		const href = fullHref ? `${fullHref}/${route}` : `/${route}`
		const isLast = index === routes.length - 1
		if (isLast) {
			breadcrumbPage = (
				<BreadcrumbItem>
					<BreadcrumbPage>{route}</BreadcrumbPage>
				</BreadcrumbItem>
			)
		} else {
			breadcrumbItems.push(
				<React.Fragment key={href}>
					<BreadcrumbItem>
						<BreadcrumbLink href={href}>{route}</BreadcrumbLink>
					</BreadcrumbItem>
				</React.Fragment>
			)
		}
	})
	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem className='text-neutral-500'>
					<BreadcrumbLink href='/'>Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />

				{breadcrumbItems}
				{breadcrumbItems.length > 0 && <BreadcrumbSeparator />}
				{breadcrumbPage}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
