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
		<ModalContainer isOpen={isOpenCreateFolder} onClose={setIsOpenCreateFolder}>
			<Card className='flex flex-col w-120 gap-5'>
				<label className='text-2xl'>Новая папка</label>
				<Input placeholder='Без названия' size={50} />
				<div className='flex justify-end gap-2'>
					<Button variant='ghost' onClick={() => setIsOpenCreateFolder(false)}>
						Отмена
					</Button>
					<Button variant='primary'>Создать</Button>
				</div>
			</Card>
		</ModalContainer>
	)
}
