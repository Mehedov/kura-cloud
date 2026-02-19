import { HomeTemplates } from '@/components/containers/HomeTemplates'
import MyDropzone from '@/components/ui/dropzone/dropzone'

export default function Home() {
	return (
		<>
			<HomeTemplates breadcrumbsRoutes={[]} />
			<MyDropzone/>
		</>
	)
}
