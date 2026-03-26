import { create } from 'zustand'

interface IDropzoneState {
	isOpenDropzone: boolean
	isOpenCreateFolder: boolean
	isOpenProfile: boolean
	setIsOpenDropzone: (bool: boolean) => void
	setIsOpenCreateFolder: (bool: boolean) => void
	setIsOpenProfile: (bool: boolean) => void
}

const useDropzoneStore = create<IDropzoneState>(set => ({
	isOpenDropzone: false,
	isOpenCreateFolder: false,
	isOpenProfile: false,
	setIsOpenDropzone: value => set({ isOpenDropzone: value }),
	setIsOpenCreateFolder: value => set({ isOpenCreateFolder: value }),
	setIsOpenProfile: value => set({ isOpenProfile: value }),
}))

export default useDropzoneStore
