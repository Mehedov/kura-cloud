import { create } from 'zustand'

interface IDropzoneState {
	isOpenDropzone: boolean
	setIsOpenDropzone: (bool: boolean) => void
}

const useDropzoneStore = create<IDropzoneState>(set => ({
	isOpenDropzone: false,
	setIsOpenDropzone: value => set({ isOpenDropzone: value }),
}))

export default useDropzoneStore
