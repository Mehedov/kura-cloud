import { create } from 'zustand'

interface IDropzoneState {
	isSidebarOpen: boolean
	isSidebarCollapsed: boolean
	setIsSidebarOpen: (value: boolean) => void
	toggleSidebar: () => void
	toggleSidebarCollapsed: () => void
}

const useDropzoneStore = create<IDropzoneState>(set => ({
	isSidebarOpen: false,
	isSidebarCollapsed: false,
	setIsSidebarOpen: value => set({ isSidebarOpen: value }),
	toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
	toggleSidebarCollapsed: () =>
		set(state => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}))

export default useDropzoneStore
