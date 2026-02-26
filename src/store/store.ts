import { create } from 'zustand'

interface IDropzoneState {
	isOpenDropzone: boolean
	isOpenCreateFolder: boolean
	setIsOpenDropzone: (bool: boolean) => void
	setIsOpenCreateFolder: (bool: boolean) => void
}

const useDropzoneStore = create<IDropzoneState>(set => ({
	isOpenDropzone: false,
	isOpenCreateFolder: false,
	setIsOpenDropzone: value => set({ isOpenDropzone: value }),
	setIsOpenCreateFolder: value => set({ isOpenCreateFolder: value }),
}))

export default useDropzoneStore
