import { PAGES } from '@/shared/config/page.config'
import { FolderCollection } from '@/widgets/folder-browser/ui/FolderCollection'
import Link from 'next/link'

export default function HomeFolders() {
	return (
		<section>
			<FolderCollection
				limit={10}
				pathname={PAGES.folders}
				showPagination={false}
				gridClassName='grid grid-cols-[repeat(auto-fill,minmax(5rem,1fr))] gap-8'
				emptyTitle='Создайте первую папку'
				emptyDescription='Она появится здесь и будет доступна на главной странице.'
				header={total => (
					<h2 className='text-md text-foreground font-medium mb-4'>
						<Link
							href={PAGES.folders}
							className='text-md text-foreground font-medium mb-4 duration-200 ease-in-out hover:text-foreground'
						>
							Folders {total > 10 && `more ${total - 10}...`}
						</Link>
					</h2>
				)}
			/>
		</section>
	)
}
