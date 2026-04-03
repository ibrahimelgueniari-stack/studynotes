'use client';

import { useState, useCallback } from 'react';
import type { StudyNote } from '@/types';
import { supabaseService } from '@/services/supabase';
import { useToast } from './useToast';

export function useNotes() {
  const [userNotes, setUserNotes] = useState<StudyNote[]>([]);
  const [sharedNotes, setSharedNotes] = useState<StudyNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: toastError } = useToast();

  // Fetch user's notes
  const loadUserNotes = useCallback(async (pId: string) => {
    if (!pId) return;
    try {
      setIsLoading(true);
      const data = await supabaseService.getUserNotes(pId);
      setUserNotes(data);
    } catch (err) {
      console.error('Error loading user notes:', err);
      toastError('Failed to load your notes');
    } finally {
      setIsLoading(false);
    }
  }, [toastError]);

  // Fetch shared notes from other users
  const loadSharedNotes = useCallback(async () => {
    try {
      const data = await supabaseService.getSharedNotes();
      setSharedNotes(data);
    } catch (err) {
      console.error('Error loading shared notes:', err);
      toastError('Failed to load shared notes');
    }
  }, [toastError]);

  // Create new note
  const createNote = useCallback(
    async (noteData: {
      profileId: string;
      title: string;
      content: string;
      category: string;
      flashcards?: Array<{ front: string; back: string }>;
      quizzes?: Array<{ question: string; options: string[]; correctAnswer: number }>;
    }) => {
      try {
        setIsLoading(true);
        const newNote = await supabaseService.createNote(noteData);
        setUserNotes((prev) => [newNote, ...prev]);
        success('Note created successfully');
        return newNote;
      } catch (err) {
        console.error('Error creating note:', err);
        toastError('Failed to create note');
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [success, toastError]
  );

  // Update note
  const updateNote = useCallback(
    async (noteId: string, updates: Partial<StudyNote>) => {
      try {
        setIsLoading(true);
        const updatedNote = await supabaseService.updateNote(noteId, updates);
        setUserNotes((prev) => prev.map((note) => (note.id === noteId ? updatedNote : note)));
        success('Note updated successfully');
        return updatedNote;
      } catch (err) {
        console.error('Error updating note:', err);
        toastError('Failed to update note');
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [success, toastError]
  );

  // Delete note
  const deleteNote = useCallback(
    async (noteId: string) => {
      try {
        setIsLoading(true);
        await supabaseService.deleteNote(noteId);
        setUserNotes((prev) => prev.filter((note) => note.id !== noteId));
        success('Note deleted successfully');
      } catch (err) {
        console.error('Error deleting note:', err);
        toastError('Failed to delete note');
      } finally {
        setIsLoading(false);
      }
    },
    [success, toastError]
  );

  // Toggle note sharing
  const toggleShareNote = useCallback(
    async (noteId: string, isShared: boolean) => {
      try {
        const updatedNote = await supabaseService.toggleShareNote(noteId, isShared);
        setUserNotes((prev) => prev.map((note) => (note.id === noteId ? updatedNote : note)));
        success(isShared ? 'Note shared successfully' : 'Note is now private');
        return updatedNote;
      } catch (err) {
        console.error('Error toggling note share:', err);
        toastError('Failed to update sharing settings');
        return undefined;
      }
    },
    [success, toastError]
  );

  return {
    userNotes,
    sharedNotes,
    isLoading,
    loadUserNotes,
    loadSharedNotes,
    createNote,
    updateNote,
    deleteNote,
    toggleShareNote,
  };
}
