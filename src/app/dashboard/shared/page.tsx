'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/app'
import { studyNoteService } from '@/services/supabase'
import { Button, Spinner, Card } from '@/components/ui'
import StudyNoteCard from '@/components/sections/StudyNoteCard'
import { Search, Filter } from 'lucide-react'
import type { StudyNote } from '@/types'

export default function SharedNotes() {
  const router = useRouter()
  const { currentProfile } = useAppStore()
  const [notes, setNotes] = useState<StudyNote[]>([])
  const [filteredNotes, setFilteredNotes] = useState<StudyNote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    if (!currentProfile) {
      router.push('/')
      return
    }

    loadNotes()
  }, [currentProfile])

  useEffect(() => {
    filterAndSearchNotes()
  }, [notes, searchQuery, selectedCategory])

  const loadNotes = async () => {
    try {
      setIsLoading(true)
      const data = await studyNoteService.getAll()
      setNotes(data || [])

      // Extract unique categories
      const cats = Array.from(new Set(data?.filter((n) => n.subject).map((n) => n.subject) || []))
      setCategories(cats as string[])
    } catch (error) {
      console.error('Error loading notes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSearchNotes = () => {
    let filtered = notes

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter((n) => n.subject === selectedCategory)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.content.toLowerCase().includes(query) ||
          (n.subject && n.subject.toLowerCase().includes(query))
      )
    }

    setFilteredNotes(filtered)
  }

  return (
    <div className='p-6 md:p-8 max-w-6xl mx-auto'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl md:text-4xl font-bold mb-2'>Fiches partagées</h1>
        <p className='text-muted-foreground'>Découvrez le contenu partagé par vos amis</p>
      </div>

      {/* Search and Filters */}
      <Card className='p-6 mb-8'>
        <div className='space-y-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' size={20} />
            <input
              type='text'
              placeholder='Rechercher des fiches...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary'
            />
          </div>

          {categories.length > 0 && (
            <div className='space-y-2'>
              <p className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
                <Filter size={16} />
                Filtrer par matière
              </p>
              <div className='flex flex-wrap gap-2'>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedCategory === null
                      ? 'bg-primary text-white'
                      : 'bg-surface-hover text-foreground hover:bg-surface-alt'
                  }`}
                >
                  Tous
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-surface-hover text-foreground hover:bg-surface-alt'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Notes Grid */}
      {isLoading ? (
        <div className='flex items-center justify-center py-24'>
          <div className='flex flex-col items-center gap-4'>
            <Spinner size='lg' />
            <p className='text-muted-foreground'>Chargement des fiches partagées...</p>
          </div>
        </div>
      ) : filteredNotes.length > 0 ? (
        <div>
          <p className='text-muted-foreground mb-6'>
            {filteredNotes.length} résultat{filteredNotes.length > 1 ? 's' : ''}
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredNotes.map((note) => (
              <StudyNoteCard
                key={note.id}
                note={note}
                onView={(n) => router.push(`/dashboard/note/${n.id}`)}
                isShared={true}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className='text-center py-16 border border-dashed border-border rounded-lg'>
          <div className='text-5xl mb-4'>🔍</div>
          <h3 className='text-xl font-semibold mb-2'>Aucune fiche trouvée</h3>
          <p className='text-muted-foreground'>
            {searchQuery
              ? 'Essayez une autre recherche'
              : 'Aucune fiche n\'a encore été partagée'}
          </p>
        </div>
      )}
    </div>
  )
}
