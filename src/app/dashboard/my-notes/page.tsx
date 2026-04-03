'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/app'
import { studyNoteService } from '@/services/supabase'
import { Button, Spinner, Card } from '@/components/ui'
import StudyNoteCard from '@/components/sections/StudyNoteCard'
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'
import type { StudyNote } from '@/types'

export default function MyNotes() {
  const router = useRouter()
  const { currentProfile } = useAppStore()
  const [notes, setNotes] = useState<StudyNote[]>([])
  const [filteredNotes, setFilteredNotes] = useState<StudyNote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'shared' | 'private'>('all')

  useEffect(() => {
    if (!currentProfile) {
      router.push('/')
      return
    }

    loadNotes()
  }, [currentProfile])

  useEffect(() => {
    filterAndSearchNotes()
  }, [notes, searchQuery, filterType])

  const loadNotes = async () => {
    if (!currentProfile) return

    try {
      setIsLoading(true)
      const data = await studyNoteService.getByProfileId(currentProfile.id)
      setNotes(data || [])
    } catch (error) {
      console.error('Error loading notes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSearchNotes = () => {
    let filtered = notes

    // Apply type filter
    if (filterType === 'shared') {
      filtered = filtered.filter((n) => n.is_shared)
    } else if (filterType === 'private') {
      filtered = filtered.filter((n) => !n.is_shared)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.content.toLowerCase().includes(query) ||
          (n.category && n.category.toLowerCase().includes(query))
      )
    }

    setFilteredNotes(filtered)
  }

  return (
    <div className='p-6 md:p-8 max-w-6xl mx-auto'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl md:text-4xl font-bold mb-2'>Mes fiches d\'étude</h1>
          <p className='text-muted-foreground'>Gérez toutes vos fiches créées</p>
        </div>

        <Link href='/dashboard/create'>
          <Button variant='primary' size='lg' className='gap-2'>
            <Plus size={20} />
            <span className='hidden sm:inline'>Nouvelle fiche</span>
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className='p-6 mb-8'>
        <div className='space-y-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' size={20} />
            <input
              type='text'
              placeholder='Rechercher vos fiches...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary'
            />
          </div>

          <div className='flex gap-2'>
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterType === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-surface-hover text-foreground hover:bg-surface-alt'
              }`}
            >
              Tous ({notes.length})
            </button>
            <button
              onClick={() => setFilterType('shared')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterType === 'shared'
                  ? 'bg-primary text-white'
                  : 'bg-surface-hover text-foreground hover:bg-surface-alt'
              }`}
            >
              Partagées ({notes.filter((n) => n.is_shared).length})
            </button>
            <button
              onClick={() => setFilterType('private')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterType === 'private'
                  ? 'bg-primary text-white'
                  : 'bg-surface-hover text-foreground hover:bg-surface-alt'
              }`}
            >
              Privées ({notes.filter((n) => !n.is_shared).length})
            </button>
          </div>
        </div>
      </Card>

      {/* Notes Grid */}
      {isLoading ? (
        <div className='flex items-center justify-center py-24'>
          <div className='flex flex-col items-center gap-4'>
            <Spinner size='lg' />
            <p className='text-muted-foreground'>Chargement...</p>
          </div>
        </div>
      ) : filteredNotes.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredNotes.map((note) => (
            <StudyNoteCard
              key={note.id}
              note={note}
              onUpdate={loadNotes}
            />
          ))}
        </div>
      ) : (
        <div className='text-center py-16 border border-dashed border-border rounded-lg'>
          <div className='text-5xl mb-4'>📭</div>
          <h3 className='text-xl font-semibold mb-2'>Aucune fiche trouvée</h3>
          <p className='text-muted-foreground mb-6'>
            {searchQuery ? 'Essayez une autre recherche' : 'Créez votre première fiche'}
          </p>
          {!searchQuery && (
            <Link href='/dashboard/create'>
              <Button variant='primary'>Créer une fiche</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
