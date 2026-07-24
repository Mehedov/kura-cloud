import { create } from 'zustand'

interface IDropzoneState {
	isOpenDropzone: boolean
	isOpenCreateFolder: boolean
	isOpenProfile: boolean
	isSidebarOpen: boolean
	isSidebarCollapsed: boolean
	setIsOpenDropzone: (bool: boolean) => void
	setIsOpenCreateFolder: (bool: boolean) => void
	setIsOpenProfile: (bool: boolean) => void
	setIsSidebarOpen: (value: boolean) => void
	toggleSidebar: () => void
	toggleSidebarCollapsed: () => void
}

const useDropzoneStore = create<IDropzoneState>(set => ({
	isOpenDropzone: false,
	isOpenCreateFolder: false,
	isOpenProfile: false,
	isSidebarOpen: false,
	isSidebarCollapsed: false,
	setIsOpenDropzone: value => set({ isOpenDropzone: value }),
	setIsOpenCreateFolder: value => set({ isOpenCreateFolder: value }),
	setIsOpenProfile: value => set({ isOpenProfile: value }),
	setIsSidebarOpen: value => set({ isSidebarOpen: value }),
	toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
	toggleSidebarCollapsed: () =>
		set(state => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}))

export default useDropzoneStore
