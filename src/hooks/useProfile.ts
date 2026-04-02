'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Profile } from '@/types';
import { supabaseService } from '@/services/supabase';
import { useLocalStorage } from './useLocalStorage';
import { useToast } from './useToast';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedProfileId, setSavedProfileId] = useLocalStorage<string | null>('currentProfileId', null);
  const { toast } = useToast();

  // Fetch profile from localStorage or database
  const loadProfile = useCallback(async (profileId: string) => {
    try {
      setIsLoading(true);
      const data = await supabaseService.getProfile(profileId);
      if (data) {
        setProfile(data);
        setSavedProfileId(profileId);
      } else {
        toast({
          type: 'error',
          message: 'Profil not found',
        });
        setProfile(null);
        setSavedProfileId(null);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        type: 'error',
        message: 'Failed to load profile',
      });
    } finally {
      setIsLoading(false);
    }
  }, [setSavedProfileId, toast]);

  // Auto-load profile on mount if saved
  useEffect(() => {
    if (savedProfileId) {
      loadProfile(savedProfileId);
    } else {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setProfile(null);
    setSavedProfileId(null);
  }, [setSavedProfileId]);

  return {
    profile,
    isLoading,
    loadProfile,
    logout,
    isAuthenticated: !!profile,
  };
}
