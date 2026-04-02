export interface Profile {
  id: string
  first_name: string
  pin?: string
  avatar_index: number
  created_at: string
  updated_at: string
}

export interface StudyNote {
  id: string
  profile_id: string
  title: string
  content: string
  category?: string
  is_shared: boolean
  created_at: string
  updated_at: string
  summary?: string
  keywords?: string[]
  flashcards?: Flashcard[]
  quizzes?: Quiz[]
  images?: UploadedImage[]
}

export interface Flashcard {
  id: string
  study_note_id: string
  front: string
  back: string
  order_index: number
  created_at: string
}

export interface Quiz {
  id: string
  study_note_id: string
  question: string
  options: string[]
  correct_answer: number
  order_index: number
  created_at: string
}

export interface UploadedImage {
  id: string
  study_note_id: string
  image_url: string
  created_at: string
}

export interface Category {
  id: string
  name: string
  icon?: string
  color?: string
}

export interface AuthContextType {
  currentProfile: Profile | null
  setCurrentProfile: (profile: Profile | null) => void
  isLoading: boolean
}
