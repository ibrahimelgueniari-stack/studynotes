'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/app'
import { studyNoteService, profileService } from '@/services/supabase'
import { Button, Spinner, Card } from '@/components/ui'
import StudyNoteCard from '@/components/sections/StudyNoteCard'
import { Plus, TrendingUp, Share2 } from 'lucide-react'
import type { StudyNote } from '@/types'

export default function Dashboard() {
  const router = useRouter()
  const { currentProfile, setCurrentProfile } = useAppStore()
  const [notes, setNotes] = useState<StudyNote[]>([])
  const [sharedNotes, setSharedNotes] = useState<StudyNote[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!currentProfile) {
      router.push('/')
      return
    }

    loadData()
  }, [currentProfile])

  const loadData = async () => {
    if (!currentProfile) return

    try {
      setIsLoading(true)
      const userNotes = await studyNoteService.getByProfileId(currentProfile.id)
      const allShared = await studyNoteService.getAll()

      setNotes(userNotes || [])
      setSharedNotes(allShared || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentProfile) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Spinner size='lg' />
      </div>
    )
  }

  const mySharedNotes = notes.filter((n) => n.is_shared)
  const myPrivateNotes = notes.filter((n) => !n.is_shared)

  return (
    <div className='p-6 md:p-8'>
      {/* Header */}
      <div className='mb-12'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-3xl md:text-4xl font-bold mb-2'>Bienvenue, {currentProfile.name}!</h1>
            <p className='text-muted-foreground'>
              Gérez vos fiches d'étude et découvrez le contenu partagé par vos amis
            </p>
          </div>
          
          <Link href='/create'>
            <Button variant='primary' size='lg' className='gap-2'>
              <Plus size={20} />
              <span className='hidden sm:inline'>Nouvelle fiche</span>
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center py-24'>
          <div className='flex flex-col items-center gap-4'>
            <Spinner size='lg' />
            <p className='text-muted-foreground'>Chargement...</p>
          </div>
        </div>
      ) : (
        <div className='space-y-12'>
          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>Fiches créées</p>
                  <p className='text-3xl font-bold mt-2'>{notes.length}</p>
                </div>
                <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center'>
                  <span className='text-2xl'>📚</span>
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>Fiches partagées</p>
                  <p className='text-3xl font-bold mt-2'>{mySharedNotes.length}</p>
                </div>
                <div className='w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center'>
                  <Share2 size={24} className='text-accent' />
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>Fiches visibles</p>
                  <p className='text-3xl font-bold mt-2'>{sharedNotes.length}</p>
                </div>
                <div className='w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center'>
                  <TrendingUp size={24} className='text-success' />
                </div>
              </div>
            </Card>
          </div>

          {/* My Notes Section */}
          {notes.length > 0 ? (
            <div>
              <h2 className='text-2xl font-bold mb-6'>Mes fiches d'étude</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {notes.map((note) => (
                  <StudyNoteCard
                    key={note.id}
                    note={note}
                    onView={(n) => router.push(`/note/${n.id}`)}
                    onShare={async (n) => {
                      await studyNoteService.changeShareStatus(n.id, !n.is_shared)
                      await loadData()
                    }}
                    onDelete={async (n) => {
                      if (confirm('Êtes-vous sûr?')) {
                        await studyNoteService.delete(n.id)
                        await loadData()
                      }
                    }}
                    isShared={note.is_shared}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className='text-center py-16 border border-dashed border-border rounded-lg'>
              <div className='text-5xl mb-4'>📝</div>
              <h3 className='text-xl font-semibold mb-2'>Aucune fiche créée</h3>
              <p className='text-muted-foreground mb-6'>Créez votre première fiche d'étude dès maintenant</p>
              <Link href='/create'>
                <Button variant='primary'>Créer une fiche</Button>
              </Link>
            </div>
          )}

          {/* Shared Notes Section */}
          {sharedNotes.length > 0 && (
            <div>
              <h2 className='text-2xl font-bold mb-6'>Fiches partagées par les amis</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {sharedNotes.slice(0, 6).map((note) => (
                  <StudyNoteCard
                    key={note.id}
                    note={note}
                    onView={(n) => router.push(`/note/${n.id}`)}
                    isShared={true}
                  />
                ))}
              </div>
              {sharedNotes.length > 6 && (
                <div className='text-center mt-8'>
                  <Link href='/shared'>
                    <Button variant='secondary'>Voir toutes les fiches partagées</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
