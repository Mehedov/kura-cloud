
import { FolderOneTemplate } from '@/components/containers/folder-one-template'

interface Props {
	params: {
		slug: string
	}
}

export default async function page({ params }: Props) {
	const { slug } = await params
	return <FolderOneTemplate breadcrumbsRoutes={['folders', slug]} />
}
