// src/features/store/useStoreContext.ts
import { create } from 'zustand'
import { StoreResponse } from '../Store.type.ts'

interface StoreState {
  activeStore: StoreResponse | null
  setActiveStore: (store: StoreResponse) => void
}

export const useStoreContext = create<StoreState>((set) => ({
  activeStore: null,
  setActiveStore: (store) => set({ activeStore: store }),
}))
