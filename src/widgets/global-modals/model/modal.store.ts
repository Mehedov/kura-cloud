import { create } from 'zustand'

interface ModalState {
	isOpenDropzone: boolean
	isOpenCreateFolder: boolean
	isOpenProfile: boolean
	setIsOpenDropzone: (value: boolean) => void
	setIsOpenCreateFolder: (value: boolean) => void
	setIsOpenProfile: (value: boolean) => void
}

export const useModalStore = create<ModalState>(set => ({
	isOpenDropzone: false,
	isOpenCreateFolder: false,
	isOpenProfile: false,
	setIsOpenDropzone: value => set({ isOpenDropzone: value }),
	setIsOpenCreateFolder: value => set({ isOpenCreateFolder: value }),
	setIsOpenProfile: value => set({ isOpenProfile: value }),
}))
