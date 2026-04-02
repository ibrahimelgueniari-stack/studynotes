import { create } from 'zustand'
import type { Profile, StudyNote } from '@/types'

interface AppStore {
  currentProfile: Profile | null
  currentNote: StudyNote | null
  isLoading: boolean
  profiles: Profile[]
  notes: StudyNote[]
  sharedNotes: StudyNote[]
  
  // Profile actions
  setCurrentProfile: (profile: Profile | null) => void
  setProfiles: (profiles: Profile[]) => void
  
  // Note actions
  setCurrentNote: (note: StudyNote | null) => void
  setNotes: (notes: StudyNote[]) => void
  setSharedNotes: (notes: StudyNote[]) => void
  
  // UI actions
  setIsLoading: (loading: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
  currentProfile: null,
  currentNote: null,
  isLoading: false,
  profiles: [],
  notes: [],
  sharedNotes: [],

  setCurrentProfile: (profile) => set({ currentProfile: profile }),
  setProfiles: (profiles) => set({ profiles }),
  setCurrentNote: (note) => set({ currentNote: note }),
  setNotes: (notes) => set({ notes }),
  setSharedNotes: (notes) => set({ sharedNotes: notes }),
  setIsLoading: (isLoading) => set({ isLoading }),
}))
