'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/app'
import { studyNoteService, flashcardService, quizService } from '@/services/supabase'
import { aiService } from '@/services/ai'
import { Button, Input, Modal, Spinner, Card } from '@/components/ui'
import { Upload, Send, FileText, Image as ImageIcon } from 'lucide-react'
import type { StudyNote, Flashcard, Quiz } from '@/types'

interface GeneratedContent {
  summary: string
  flashcards: Array<{ question: string; answer: string }>
  quiz: Array<{ question: string; options: string[]; correctAnswer: number }>
  keywords: string[]
}

export default function CreateNote() {
  const router = useRouter()
  const { currentProfile } = useAppStore()

  // Input states
  const [inputType, setInputType] = useState<'text' | 'image'>('text')
  const [textInput, setTextInput] = useState('')
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Processing states
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [noteTitle, setNoteTitle] = useState('')
  const [noteSubject, setNoteSubject] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  if (!currentProfile) {
    return (
      <div className='p-6 md:p-8'>
        <p>Please select a profile first</p>
      </div>
    )
  }

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return

    try {
      setIsAnalyzing(true)
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: textInput }),
      })

      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error || 'Analysis failed')

      setGeneratedContent(data)
      
      // Generate title if not provided
      if (!noteTitle) {
        const title = await aiService.generateTitle(textInput)
        setNoteTitle(title)
      }
    } catch (error) {
      console.error('Error analyzing content:', error)
      alert('Erreur lors de l\'analyse du contenu')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedImages([...uploadedImages, ...files])
  }

  const handleRemoveImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index))
  }

  const handleProcessImages = async () => {
    if (uploadedImages.length === 0) return

    try {
      setIsAnalyzing(true)
      let combinedText = ''

      // In a real app, you would upload images to Supabase Storage and extract text
      // For now, we'll just use placeholder text
      combinedText = `[Images uploadées: ${uploadedImages.length} fichier(s)]\n\nTexte extrait (configuration OCR requise)`

      setTextInput(combinedText)
      await handleTextSubmit()
    } catch (error) {
      console.error('Error processing images:', error)
      alert('Erreur lors du traitement des images')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSaveNote = async () => {
    if (!noteTitle.trim()) {
      alert('Veuillez entrer un titre')
      return
    }

    try {
      setIsSaving(true)

      // Create the main study note
      const note = await studyNoteService.create(
        currentProfile.id,
        noteTitle,
        textInput,
        noteSubject
      )

      // Save generated flashcards
      if (generatedContent?.flashcards) {
        for (const card of generatedContent.flashcards) {
          await flashcardService.create(note.id, card.question, card.answer)
        }
      }

      // Save generated quiz questions
      if (generatedContent?.quiz) {
        for (const q of generatedContent.quiz) {
          await quizService.create(
            note.id,
            q.question,
            q.options,
            q.correctAnswer
          )
        }
      }

      // Update note with summary and keywords
      if (generatedContent) {
        await studyNoteService.update(note.id, {
          summary: generatedContent.summary,
        })
      }

      // Reset form
      setTextInput('')
      setNoteTitle('')
      setNoteSubject('')
      setGeneratedContent(null)
      setUploadedImages([])

      router.push(`/note/${note.id}`)
    } catch (error) {
      console.error('Error saving note:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className='p-6 md:p-8 max-w-4xl mx-auto'>
      <h1 className='text-3xl md:text-4xl font-bold mb-8'>Créer une fiche d\'étude</h1>

      {!generatedContent ? (
        <div className='space-y-8'>
          {/* Input Type Selection */}
          <div className='flex gap-4'>
            <button
              onClick={() => setInputType('text')}
              className={`flex-1 p-6 rounded-lg border-2 transition-all ${
                inputType === 'text'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary'
              }`}
            >
              <FileText className='w-8 h-8 mx-auto mb-2' />
              <p className='font-medium'>Texte</p>
              <p className='text-sm text-muted-foreground'>Collez vos notes</p>
            </button>

            <button
              onClick={() => setInputType('image')}
              className={`flex-1 p-6 rounded-lg border-2 transition-all ${
                inputType === 'image'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary'
              }`}
            >
              <ImageIcon className='w-8 h-8 mx-auto mb-2' />
              <p className='font-medium'>Images</p>
              <p className='text-sm text-muted-foreground'>Téléchargez des documents</p>
            </button>
          </div>

          {/* Text Input */}
          {inputType === 'text' && (
            <div className='space-y-4'>
              <label className='block text-sm font-medium'>Contenu à analyser</label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder='Collez le texte que vous voulez transformer en fiche d\'étude...'
                className='w-full h-64 p-4 rounded-lg bg-surface border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary'
              />
              <Button
                onClick={handleTextSubmit}
                variant='primary'
                size='lg'
                isLoading={isAnalyzing}
                disabled={!textInput.trim() || isAnalyzing}
                className='w-full gap-2'
              >
                <Send size={20} />
                Analyser le contenu
              </Button>
            </div>
          )}

          {/* Image Upload */}
          {inputType === 'image' && (
            <div className='space-y-4'>
              <div
                onClick={() => fileInputRef.current?.click()}
                className='border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors'
              >
                <input
                  ref={fileInputRef}
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={handleImageUpload}
                  className='hidden'
                />
                <Upload className='w-12 h-12 mx-auto mb-4 text-muted-foreground' />
                <p className='font-medium mb-2'>Cliquez pour télécharger des images</p>
                <p className='text-sm text-muted-foreground'>ou glissez-déposez vos fichiers</p>
              </div>

              {uploadedImages.length > 0 && (
                <div className='space-y-2'>
                  <p className='font-medium'>{uploadedImages.length} fichier(s) sélectionné(s):</p>
                  <div className='space-y-2'>
                    {uploadedImages.map((file, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between p-3 bg-surface rounded-lg'
                      >
                        <span className='text-sm'>{file.name}</span>
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className='text-error hover:bg-error/10 px-3 py-1 rounded'
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={handleProcessImages}
                variant='primary'
                size='lg'
                isLoading={isAnalyzing}
                disabled={uploadedImages.length === 0 || isAnalyzing}
                className='w-full gap-2'
              >
                <ImageIcon size={20} />
                Traiter les images
              </Button>
            </div>
          )}
        </div>
      ) : (
        // Generated Content Display
        <div className='space-y-8'>
          {/* Note Details */}
          <div className='space-y-4'>
            <Input
              label='Titre de la fiche'
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder='Titre de votre fiche'
            />
            <Input
              label='Matière (optionnel)'
              value={noteSubject}
              onChange={(e) => setNoteSubject(e.target.value)}
              placeholder='Ex: Mathématiques, Histoire, etc.'
            />
          </div>

          {/* Generated Content Preview */}
          <Card className='p-6'>
            <h3 className='text-xl font-bold mb-4'>Résumé généré</h3>
            <p className='text-foreground text-lg'>{generatedContent.summary}</p>
          </Card>

          {generatedContent.flashcards.length > 0 && (
            <Card className='p-6'>
              <h3 className='text-xl font-bold mb-4'>Flashcards ({generatedContent.flashcards.length})</h3>
              <div className='space-y-3'>
                {generatedContent.flashcards.map((card, index) => (
                  <div key={index} className='p-4 bg-surface rounded-lg'>
                    <p className='text-sm font-medium text-accent mb-2'>Q: {card.question}</p>
                    <p className='text-sm text-foreground'>R: {card.answer}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {generatedContent.keywords.length > 0 && (
            <Card className='p-6'>
              <h3 className='text-xl font-bold mb-4'>Mots-clés</h3>
              <div className='flex flex-wrap gap-2'>
                {generatedContent.keywords.map((keyword, index) => (
                  <span key={index} className='badge'>
                    {keyword}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className='flex gap-4'>
            <Button
              onClick={() => setGeneratedContent(null)}
              variant='secondary'
              size='lg'
              className='flex-1'
              disabled={isSaving}
            >
              Modifier
            </Button>
            <Button
              onClick={handleSaveNote}
              variant='primary'
              size='lg'
              className='flex-1'
              isLoading={isSaving}
              disabled={!noteTitle.trim() || isSaving}
            >
              Enregistrer la fiche
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
