import { FoldersTemplate } from '@/components/containers/FoldersTemplate'

interface Props {}

export default function page({}: Props) {
	return <FoldersTemplate breadcrumbsRoutes={['folders']} />
}
