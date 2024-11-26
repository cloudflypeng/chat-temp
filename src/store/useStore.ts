import { create } from 'zustand'

interface BearState {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void

}

const useStore = create<BearState>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
}))

export default useStore
