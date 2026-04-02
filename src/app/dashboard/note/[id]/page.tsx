'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppStore } from '@/store/app'
import { studyNoteService, flashcardService, quizService } from '@/services/supabase'
import { Button, Card, Spinner } from '@/components/ui'
import { ArrowLeft, Share2, Lock, Trash2, Copy } from 'lucide-react'
import type { StudyNote, Flashcard, Quiz } from '@/types'

export default function NoteDetail() {
  const params = useParams()
  const router = useRouter()
  const { currentProfile } = useAppStore()
  const noteId = params.id as string

  const [note, setNote] = useState<StudyNote | null>(null)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFlipped, setIsFlipped] = useState<Record<number, boolean>>({})
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [showQuizResults, setShowQuizResults] = useState(false)

  useEffect(() => {
    loadNote()
  }, [noteId])

  const loadNote = async () => {
    try {
      setIsLoading(true)
      const noteData = await studyNoteService.getById(noteId)
      setNote(noteData)

      if (noteData) {
        const [cards, quizData] = await Promise.all([
          flashcardService.getByNoteId(noteData.id),
          quizService.getByNoteId(noteData.id),
        ])

        setFlashcards(cards || [])
        setQuizzes(quizData || [])
      }
    } catch (error) {
      console.error('Error loading note:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShareStatus = async () => {
    if (!note) return
    try {
      await studyNoteService.changeShareStatus(note.id, !note.is_shared)
      setNote({ ...note, is_shared: !note.is_shared })
    } catch (error) {
      console.error('Error updating share status:', error)
    }
  }

  const handleDelete = async () => {
    if (!note || !confirm('Êtes-vous sûr de vouloir supprimer cette fiche?')) return
    try {
      await studyNoteService.delete(note.id)
      router.push('/dashboard')
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const handleCopyContent = () => {
    if (note) {
      navigator.clipboard.writeText(note.content)
      alert('Contenu copié!')
    }
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Spinner size='lg' />
      </div>
    )
  }

  if (!note) {
    return (
      <div className='p-6 text-center'>
        <p>Fiche non trouvée</p>
        <Button onClick={() => router.back()} variant='secondary' className='mt-4'>
          Retour
        </Button>
      </div>
    )
  }

  const isOwner = currentProfile?.id === note.profile_id

  return (
    <div className='max-w-4xl mx-auto p-6 md:p-8'>
      {/* Header */}
      <div className='flex items-start justify-between mb-8'>
        <button
          onClick={() => router.back()}
          className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4'
        >
          <ArrowLeft size={20} />
          Retour
        </button>

        {isOwner && (
          <div className='flex gap-2'>
            <Button
              onClick={handleShareStatus}
              variant='secondary'
              size='sm'
              className='gap-2'
            >
              {note.is_shared ? (
                <>
                  <Share2 size={16} />
                  Rendre privée
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Partager
                </>
              )}
            </Button>
            <Button
              onClick={handleDelete}
              variant='danger'
              size='sm'
              className='gap-2'
            >
              <Trash2 size={16} />
              Supprimer
            </Button>
          </div>
        )}
      </div>

      {/* Title and Metadata */}
      <div className='mb-8'>
        <h1 className='text-3xl md:text-4xl font-bold mb-4'>{note.title}</h1>
        <div className='flex flex-wrap gap-4'>
          {note.subject && (
            <div className='badge'>
              📚 {note.subject}
            </div>
          )}
          <div className='badge'>
            {note.is_shared ? '🌍 Partagée' : '🔒 Privée'}
          </div>
          <div className='badge'>
            📅 {new Date(note.created_at).toLocaleDateString('fr-FR')}
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className='space-y-8'>
        {/* Main Content */}
        <Card className='p-8'>
          <div className='flex items-start justify-between mb-4'>
            <h2 className='text-2xl font-bold'>Contenu</h2>
            <Button
              onClick={handleCopyContent}
              variant='secondary'
              size='sm'
              className='gap-2'
            >
              <Copy size={16} />
              Copier
            </Button>
          </div>
          <div className='prose prose-invert max-w-none'>
            <p className='text-foreground whitespace-pre-wrap leading-relaxed'>
              {note.content}
            </p>
          </div>

          {note.summary && (
            <div className='mt-8 p-4 bg-surface rounded-lg border border-border'>
              <h3 className='font-semibold mb-2'>Résumé généré par l\'IA</h3>
              <p className='text-foreground'>{note.summary}</p>
            </div>
          )}
        </Card>

        {/* Flashcards */}
        {flashcards.length > 0 && (
          <Card className='p-8'>
            <h2 className='text-2xl font-bold mb-6'>Flashcards ({flashcards.length})</h2>

            <div className='mb-6'>
              <div
                onClick={() => setIsFlipped({ ...isFlipped, [currentFlashcardIndex]: !isFlipped[currentFlashcardIndex] })}
                className='min-h-64 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl p-8 flex items-center justify-center cursor-pointer hover:shadow-lg transition-all transform hover:scale-105'
              >
                <div className='text-center'>
                  <p className='text-sm text-muted-foreground mb-2'>
                    {isFlipped[currentFlashcardIndex] ? 'Réponse' : 'Question'}
                  </p>
                  <p className='text-2xl font-semibold text-foreground'>
                    {isFlipped[currentFlashcardIndex]
                      ? flashcards[currentFlashcardIndex].answer
                      : flashcards[currentFlashcardIndex].question}
                  </p>
                  <p className='text-xs text-muted-foreground mt-4'>Cliquez pour retourner</p>
                </div>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <p className='text-sm text-muted-foreground'>
                {currentFlashcardIndex + 1} / {flashcards.length}
              </p>
              <div className='flex gap-2'>
                <Button
                  onClick={() => setCurrentFlashcardIndex(Math.max(0, currentFlashcardIndex - 1))}
                  variant='secondary'
                  disabled={currentFlashcardIndex === 0}
                >
                  Précédent
                </Button>
                <Button
                  onClick={() => setCurrentFlashcardIndex(Math.min(flashcards.length - 1, currentFlashcardIndex + 1))}
                  variant='secondary'
                  disabled={currentFlashcardIndex === flashcards.length - 1}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Quiz */}
        {quizzes.length > 0 && (
          <Card className='p-8'>
            <h2 className='text-2xl font-bold mb-6'>Quiz ({quizzes.length} questions)</h2>

            {!showQuizResults ? (
              <div className='space-y-6'>
                {quizzes.map((quiz, index) => (
                  <div key={quiz.id} className='p-6 bg-surface rounded-lg'>
                    <p className='font-semibold mb-4'>
                      {index + 1}. {quiz.question}
                    </p>
                    <div className='space-y-2'>
                      {quiz.options.map((option, optIndex) => (
                        <button
                          key={optIndex}
                          onClick={() => setQuizAnswers({ ...quizAnswers, [index]: optIndex })}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                            quizAnswers[index] === optIndex
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <Button
                  onClick={() => setShowQuizResults(true)}
                  variant='primary'
                  size='lg'
                  className='w-full'
                >
                  Voir les résultats
                </Button>
              </div>
            ) : (
              <div className='space-y-4'>
                {quizzes.map((quiz, index) => {
                  const isCorrect = quizAnswers[index] === quiz.correct_answer
                  return (
                    <div key={quiz.id} className={`p-6 rounded-lg border-2 ${isCorrect ? 'border-success bg-success/10' : 'border-error bg-error/10'}`}>
                      <p className='font-semibold mb-2'>
                        {index + 1}. {quiz.question} {isCorrect ? '✓' : '✗'}
                      </p>
                      <p className='text-sm mb-2'>
                        <span className='font-medium'>Votre réponse:</span>{' '}
                        {quiz.options[quizAnswers[index]] || 'Non répondu'}
                      </p>
                      {!isCorrect && (
                        <p className='text-sm'>
                          <span className='font-medium'>Bonne réponse:</span> {quiz.options[quiz.correct_answer]}
                        </p>
                      )}
                    </div>
                  )
                })}

                <div className='mt-6 p-4 bg-surface rounded-lg'>
                  <p className='text-center font-semibold'>
                    Score: {Object.values(quizAnswers).filter((answer, index) => answer === quizzes[index]?.correct_answer).length} / {quizzes.length}
                  </p>
                </div>

                <Button
                  onClick={() => {
                    setShowQuizResults(false)
                    setQuizAnswers({})
                  }}
                  variant='secondary'
                  size='lg'
                  className='w-full'
                >
                  Recommencer
                </Button>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
