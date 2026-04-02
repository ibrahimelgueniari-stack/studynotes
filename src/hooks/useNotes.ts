'use client';

import { useState, useCallback } from 'react';
import type { StudyNote } from '@/types';
import { supabaseService } from '@/services/supabase';
import { useToast } from './useToast';

export function useNotes(profileId?: string) {
  const [userNotes, setUserNotes] = useState<StudyNote[]>([]);
  const [sharedNotes, setSharedNotes] = useState<StudyNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch user's notes
  const loadUserNotes = useCallback(async (pId: string) => {
    if (!pId) return;
    try {
      setIsLoading(true);
      const data = await supabaseService.getUserNotes(pId);
      setUserNotes(data);
    } catch (error) {
      console.error('Error loading user notes:', error);
      toast({
        type: 'error',
        message: 'Failed to load your notes',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch shared notes from other users
  const loadSharedNotes = useCallback(async () => {
    try {
      const data = await supabaseService.getSharedNotes();
      setSharedNotes(data);
    } catch (error) {
      console.error('Error loading shared notes:', error);
      toast({
        type: 'error',
        message: 'Failed to load shared notes',
      });
    }
  }, [toast]);

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
        toast({
          type: 'success',
          message: 'Note created successfully',
        });
        return newNote;
      } catch (error) {
        console.error('Error creating note:', error);
        toast({
          type: 'error',
          message: 'Failed to create note',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  // Update note
  const updateNote = useCallback(
    async (noteId: string, updates: Partial<StudyNote>) => {
      try {
        setIsLoading(true);
        const updatedNote = await supabaseService.updateNote(noteId, updates);
        setUserNotes((prev) => prev.map((note) => (note.id === noteId ? updatedNote : note)));
        toast({
          type: 'success',
          message: 'Note updated successfully',
        });
        return updatedNote;
      } catch (error) {
        console.error('Error updating note:', error);
        toast({
          type: 'error',
          message: 'Failed to update note',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  // Delete note
  const deleteNote = useCallback(
    async (noteId: string) => {
      try {
        setIsLoading(true);
        await supabaseService.deleteNote(noteId);
        setUserNotes((prev) => prev.filter((note) => note.id !== noteId));
        toast({
          type: 'success',
          message: 'Note deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting note:', error);
        toast({
          type: 'error',
          message: 'Failed to delete note',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  // Toggle note sharing
  const toggleShareNote = useCallback(
    async (noteId: string, isShared: boolean) => {
      try {
        const updatedNote = await supabaseService.toggleShareNote(noteId, isShared);
        setUserNotes((prev) => prev.map((note) => (note.id === noteId ? updatedNote : note)));
        toast({
          type: 'success',
          message: isShared ? 'Note shared successfully' : 'Note is now private',
        });
        return updatedNote;
      } catch (error) {
        console.error('Error toggling note share:', error);
        toast({
          type: 'error',
          message: 'Failed to update sharing settings',
        });
      }
    },
    [toast]
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
