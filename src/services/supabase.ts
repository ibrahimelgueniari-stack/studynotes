import { createClient } from '@supabase/supabase-js';
import type { Profile, StudyNote, Flashcard, Quiz } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseService = {
  // ====== PROFILES ======
  async getAllProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getProfile(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  },

  async createProfile(
    firstName: string,
    pin?: string
  ): Promise<Profile> {
    const avatarIndex = Math.floor(Math.random() * 10); // 0-9

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        first_name: firstName,
        pin: pin || null,
        avatar_index: avatarIndex,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(
    id: string,
    updates: Partial<Profile>
  ): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProfile(id: string): Promise<void> {
    // Delete all notes and related data for this profile
    const { data: notes } = await supabase
      .from('study_notes')
      .select('id')
      .eq('profile_id', id);

    if (notes) {
      for (const note of notes) {
        await supabase.from('flashcards').delete().eq('study_note_id', note.id);
        await supabase.from('quizzes').delete().eq('study_note_id', note.id);
        await supabase.from('uploaded_images').delete().eq('study_note_id', note.id);
      }
      await supabase.from('study_notes').delete().eq('profile_id', id);
    }

    // Delete the profile
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ====== STUDY NOTES ======
  async getUserNotes(profileId: string): Promise<StudyNote[]> {
    const { data, error } = await supabase
      .from('study_notes')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getSharedNotes(): Promise<StudyNote[]> {
    const { data, error } = await supabase
      .from('study_notes')
      .select('*')
      .eq('is_shared', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getNoteWithRelations(noteId: string): Promise<any> {
    const { data: note, error: noteError } = await supabase
      .from('study_notes')
      .select('*')
      .eq('id', noteId)
      .single();

    if (noteError) throw noteError;

    const { data: flashcards, error: flashError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('study_note_id', noteId)
      .order('order_index', { ascending: true });

    if (flashError) throw flashError;

    const { data: quizzes, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('study_note_id', noteId);

    if (quizError) throw quizError;

    return {
      ...note,
      flashcards: flashcards || [],
      quizzes: quizzes || [],
    };
  },

  async createNote(noteData: {
    profileId: string;
    title: string;
    content: string;
    category: string;
    flashcards?: Array<{ front: string; back: string }>;
    quizzes?: Array<{ question: string; options: string[]; correctAnswer: number }>;
  }): Promise<StudyNote> {
    const { data, error } = await supabase
      .from('study_notes')
      .insert({
        profile_id: noteData.profileId,
        title: noteData.title,
        content: noteData.content,
        category: noteData.category,
        is_shared: false,
      })
      .select()
      .single();

    if (error) throw error;

    // Add flashcards if provided
    if (noteData.flashcards && noteData.flashcards.length > 0) {
      const flashcardData = noteData.flashcards.map((fc, index) => ({
        study_note_id: data.id,
        front: fc.front,
        back: fc.back,
        order_index: index,
      }));

      const { error: fcError } = await supabase
        .from('flashcards')
        .insert(flashcardData);

      if (fcError) throw fcError;
    }

    // Add quizzes if provided
    if (noteData.quizzes && noteData.quizzes.length > 0) {
      const quizData = noteData.quizzes.map((q) => ({
        study_note_id: data.id,
        question: q.question,
        options: q.options,
        correct_answer: q.correctAnswer,
      }));

      const { error: qError } = await supabase
        .from('quizzes')
        .insert(quizData);

      if (qError) throw qError;
    }

    return data;
  },

  async updateNote(
    noteId: string,
    updates: Partial<StudyNote>
  ): Promise<StudyNote> {
    const { data, error } = await supabase
      .from('study_notes')
      .update(updates)
      .eq('id', noteId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteNote(noteId: string): Promise<void> {
    // Delete related flashcards and quizzes first
    await supabase.from('flashcards').delete().eq('study_note_id', noteId);
    await supabase.from('quizzes').delete().eq('study_note_id', noteId);
    await supabase.from('uploaded_images').delete().eq('study_note_id', noteId);

    const { error } = await supabase
      .from('study_notes')
      .delete()
      .eq('id', noteId);

    if (error) throw error;
  },

  async toggleShareNote(noteId: string, isShared: boolean): Promise<StudyNote> {
    const { data, error } = await supabase
      .from('study_notes')
      .update({ is_shared: isShared })
      .eq('id', noteId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ====== FLASHCARDS ======
  async createFlashcard(flashcardData: {
    studyNoteId: string;
    front: string;
    back: string;
    orderIndex: number;
  }): Promise<Flashcard> {
    const { data, error } = await supabase
      .from('flashcards')
      .insert({
        study_note_id: flashcardData.studyNoteId,
        front: flashcardData.front,
        back: flashcardData.back,
        order_index: flashcardData.orderIndex,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateFlashcard(flashcardId: string, front: string, back: string): Promise<Flashcard> {
    const { data, error } = await supabase
      .from('flashcards')
      .update({ front, back })
      .eq('id', flashcardId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteFlashcard(flashcardId: string): Promise<void> {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', flashcardId);

    if (error) throw error;
  },

  // ====== QUIZZES ======
  async createQuiz(quizData: {
    studyNoteId: string;
    question: string;
    options: string[];
    correctAnswer: number;
  }): Promise<Quiz> {
    const { data, error } = await supabase
      .from('quizzes')
      .insert({
        study_note_id: quizData.studyNoteId,
        question: quizData.question,
        options: quizData.options,
        correct_answer: quizData.correctAnswer,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateQuiz(
    quizId: string,
    question: string,
    options: string[],
    correctAnswer: number
  ): Promise<Quiz> {
    const { data, error } = await supabase
      .from('quizzes')
      .update({
        question,
        options,
        correct_answer: correctAnswer,
      })
      .eq('id', quizId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteQuiz(quizId: string): Promise<void> {
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', quizId);

    if (error) throw error;
  },

  // ====== IMAGES ======
  async uploadImage(noteId: string, file: File): Promise<string> {
    const fileName = `${noteId}/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from('study-notes-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from('study-notes-images')
      .getPublicUrl(fileName);

    // Save image record in database
    await supabase.from('uploaded_images').insert({
      study_note_id: noteId,
      image_url: publicUrl.publicUrl,
    });

    return publicUrl.publicUrl;
  },

  async getImageUrl(fileName: string): Promise<string> {
    const { data } = supabase.storage
      .from('study-notes-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  async deleteImage(imageUrl: string): Promise<void> {
    // Extract file path from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts.slice(-2).join('/');

    await supabase.storage
      .from('study-notes-images')
      .remove([fileName]);

    // Delete record from database
    await supabase.from('uploaded_images').delete().eq('image_url', imageUrl);
  },
};

// Export named services for backward compatibility
export const profileService = {
  getAll: supabaseService.getAllProfiles,
  get: supabaseService.getProfile,
  create: supabaseService.createProfile,
  update: supabaseService.updateProfile,
  delete: supabaseService.deleteProfile,
};

export const studyNoteService = {
  getByProfileId: supabaseService.getUserNotes,
  getAll: supabaseService.getSharedNotes,
  getById: supabaseService.getNoteWithRelations,
  create: supabaseService.createNote,
  update: supabaseService.updateNote,
  delete: supabaseService.deleteNote,
  changeShareStatus: supabaseService.toggleShareNote,
};

export const flashcardService = {
  create: supabaseService.createFlashcard,
  update: supabaseService.updateFlashcard,
  delete: supabaseService.deleteFlashcard,
};

export const quizService = {
  create: supabaseService.createQuiz,
  update: supabaseService.updateQuiz,
  delete: supabaseService.deleteQuiz,
};
