import { Breadcrumbs } from '@/components/ui/breadcrumbs/breadcrumbs'

interface Props {
	params: {
		catchAll: string[]
	}
}

async function BreadcrumbsSlot({ params }: Props) {
	const { catchAll } = await params
	return <Breadcrumbs routes={catchAll} />
}

export default BreadcrumbsSlot
