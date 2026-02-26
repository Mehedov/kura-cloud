'use client'
import { Card } from '@/components/ui/Card/card'
import ModalContainer from '../modal-container/modal-container'
import useDropzoneStore from '@/store/store'
import Input from '@/components/ui/input/input'
import { Button } from '@/components/ui/button/Button'

export default function CreateFolder() {
	const { isOpenCreateFolder, setIsOpenCreateFolder } = useDropzoneStore(
		state => state,
	)
	if (!isOpenCreateFolder) return null
	return (
		<ModalContainer>
			<Card>
				<Button onClick={() => setIsOpenCreateFolder(false)} variant='outline'>
					-
				</Button>
				<label htmlFor=''>Создайте хуйню</label>
				<Input />
			</Card>
		</ModalContainer>
	)
}
