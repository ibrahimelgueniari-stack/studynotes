'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/app'
import { profileService } from '@/services/supabase'
import { Button, Input, Modal, Spinner } from '@/components/ui'
import ProfileCard from '@/components/sections/ProfileCard'
import { Plus } from 'lucide-react'
import type { Profile } from '@/types'

export default function Home() {
  const router = useRouter()
  const { setCurrentProfile, setProfiles } = useAppStore()
  const [profiles, setLocalProfiles] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newProfileName, setNewProfileName] = useState('')
  const [newProfilePin, setNewProfilePin] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    loadProfiles()
  }, [])

  const loadProfiles = async () => {
    try {
      setIsLoading(true)
      const data = await profileService.getAll()
      setLocalProfiles(data || [])
      setProfiles(data || [])
    } catch (error) {
      console.error('Error loading profiles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectProfile = (profile: Profile) => {
    setCurrentProfile(profile)
    router.push('/dashboard')
  }

  const handleCreateProfile = async () => {
    if (!newProfileName.trim()) return

    try {
      setIsCreating(true)
      const profile = await profileService.create(
        newProfileName,
        newProfilePin || undefined
      )
      setLocalProfiles([profile, ...profiles])
      setProfiles([profile, ...profiles])
      setNewProfileName('')
      setNewProfilePin('')
      setIsModalOpen(false)
      setCurrentProfile(profile)
      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating profile:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <main className='min-h-screen bg-gradient-to-br from-background via-surface to-background overflow-hidden'>
      {/* Background decoration */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl' />
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl' />
      </div>

      <div className='relative z-10'>
        {/* Header */}
        <div className='pt-12 pb-16 md:pt-20 md:pb-24'>
          <div className='container'>
            <div className='flex items-center justify-center mb-8'>
              <div className='w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-3xl font-bold shadow-premium'>
                S
              </div>
            </div>
            
            <div className='text-center'>
              <h1 className='text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary-light bg-clip-text text-transparent'>
                StudyNotes
              </h1>
              <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
                Créez, organisez et partagez vos fiches d'étude générées par l'IA avec vos amis
              </p>
            </div>
          </div>
        </div>

        {/* Profiles Section */}
        <div className='container pb-24'>
          {isLoading ? (
            <div className='flex items-center justify-center py-24'>
              <div className='flex flex-col items-center gap-4'>
                <Spinner size='lg' />
                <p className='text-muted-foreground'>Chargement des profils...</p>
              </div>
            </div>
          ) : (
            <div>
              {profiles.length > 0 && (
                <div>
                  <h2 className='text-2xl md:text-3xl font-bold mb-8 text-center'>
                    Sélectionnez votre profil
                  </h2>
                  <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12'>
                    {profiles.map((profile) => (
                      <ProfileCard
                        key={profile.id}
                        profile={profile}
                        onClick={handleSelectProfile}
                      />
                    ))}
                  </div>
                </div>
              )}

              {profiles.length === 0 && (
                <div className='text-center py-24'>
                  <h2 className='text-2xl font-bold mb-4'>Aucun profil créé</h2>
                  <p className='text-muted-foreground mb-8'>Créez votre premier profil pour commencer</p>
                </div>
              )}

              {/* Create Button */}
              <div className='flex justify-center mt-12'>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  variant='primary'
                  size='lg'
                  className='gap-2'
                >
                  <Plus size={20} />
                  Créer un nouveau profil
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Profile Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title='Créer un nouveau profil'
        size='md'
      >
        <div className='space-y-4'>
          <Input
            label='Prénom'
            placeholder='Entrez votre prénom'
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isCreating) {
                handleCreateProfile()
              }
            }}
            autoFocus
          />
          
          <Input
            label='PIN (optionnel)'
            placeholder='Entrez un PIN à 4 chiffres'
            type='password'
            maxLength={4}
            value={newProfilePin}
            onChange={(e) => setNewProfilePin(e.target.value.replace(/\D/g, ''))}
          />

          <div className='flex gap-3 pt-4'>
            <Button
              variant='secondary'
              onClick={() => setIsModalOpen(false)}
              className='flex-1'
              disabled={isCreating}
            >
              Annuler
            </Button>
            <Button
              variant='primary'
              onClick={handleCreateProfile}
              className='flex-1'
              isLoading={isCreating}
              disabled={!newProfileName.trim() || isCreating}
            >
              Créer le profil
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  )
}
