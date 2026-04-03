'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/app'
import { supabaseService } from '@/services/supabase'
import { Button, Input, Card } from '@/components/ui'
import { Plus, Trash2 } from 'lucide-react'

const CATEGORIES = [
  'Mathématiques',
  'Français',
  'Histoire',
  'Géographie',
  'Anglais',
  'Sciences',
  'Biologie',
  'Physique',
  'Chimie',
  'Informatique',
  'Autres',
]

export default function CreateNote() {
  const router = useRouter()
  const { currentProfile } = useAppStore()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [content, setContent] = useState('')
  const [activeTab, setActiveTab] = useState<'content' | 'flashcards' | 'quizzes'>('content')
  const [flashcards, setFlashcards] = useState<any[]>([])
  const [newFlashcardFront, setNewFlashcardFront] = useState('')
  const [newFlashcardBack, setNewFlashcardBack] = useState('')
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [newQuizQuestion, setNewQuizQuestion] = useState('')
  const [newQuizOptions, setNewQuizOptions] = useState(['', '', '', ''])
  const [newQuizCorrect, setNewQuizCorrect] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  if (!currentProfile) {
    return <div className="p-6">Veuillez sélectionner un profil</div>
  }

  const addFlashcard = () => {
    if (!newFlashcardFront.trim() || !newFlashcardBack.trim()) {
      alert('Remplissez les deux champs')
      return
    }
    setFlashcards([
      ...flashcards,
      {
        id: Date.now().toString(),
        study_note_id: '',
        front: newFlashcardFront,
        back: newFlashcardBack,
        order_index: flashcards.length,
        created_at: new Date().toISOString(),
      },
    ])
    setNewFlashcardFront('')
    setNewFlashcardBack('')
  }

  const deleteFlashcard = (index: number) => {
    setFlashcards(flashcards.filter((_, i) => i !== index))
  }

  const addQuiz = () => {
    if (
      !newQuizQuestion.trim() ||
      newQuizOptions.some((o) => !o.trim()) ||
      newQuizCorrect < 0 ||
      newQuizCorrect > 3
    ) {
      alert('Remplissez tous les champs')
      return
    }
    setQuizzes([
      ...quizzes,
      {
        id: Date.now().toString(),
        study_note_id: '',
        question: newQuizQuestion,
        options: newQuizOptions,
        correct_answer: newQuizCorrect,
        created_at: new Date().toISOString(),
      },
    ])
    setNewQuizQuestion('')
    setNewQuizOptions(['', '', '', ''])
    setNewQuizCorrect(0)
  }

  const deleteQuiz = (index: number) => {
    setQuizzes(quizzes.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Le titre et le contenu sont obligatoires')
      return
    }

    try {
      setIsSaving(true)

      const note = await supabaseService.createNote({
        profileId: currentProfile.id,
        title,
        content,
        category,
        flashcards: flashcards.map((f) => ({
          front: f.front,
          back: f.back,
        })),
        quizzes: quizzes.map((q) => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correct_answer,
        })),
      })

      router.push(`/dashboard/notes/${note.id}`)
    } catch (error) {
      console.error('Error:', error)
      alert('Erreur')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Nouvelle Fiche</h1>

      <div className="flex gap-2 mb-8 border-b border-slate-700">
        {(['content', 'flashcards', 'quizzes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-blue-600 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab === 'content' && 'Contenu'}
            {tab === 'flashcards' && `Flashcards (${flashcards.length})`}
            {tab === 'quizzes' && `Quizzes (${quizzes.length})`}
          </button>
        ))}
      </div>

      {activeTab === 'content' && (
        <div className="space-y-6">
          <Input
            label="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entrez le titre"
          />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Catégorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:outline-none focus:border-blue-600"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Contenu</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Entrez le contenu"
              className="w-full h-64 px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>
      )}

      {activeTab === 'flashcards' && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Ajouter Flashcard</h3>
            <Input
              label="Question"
              value={newFlashcardFront}
              onChange={(e) => setNewFlashcardFront(e.target.value)}
              placeholder="Question"
            />
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Réponse</label>
              <textarea
                value={newFlashcardBack}
                onChange={(e) => setNewFlashcardBack(e.target.value)}
                placeholder="Réponse"
                className="w-full h-32 px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>
            <Button onClick={addFlashcard} variant="primary" size="lg" className="w-full gap-2">
              <Plus size={20} />
              Ajouter
            </Button>
          </div>

          {flashcards.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-300">Flashcards:</h4>
              {flashcards.map((card, index) => (
                <Card key={index} className="p-4 flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-slate-400">Q: {card.front}</p>
                    <p className="text-slate-300 mt-2">R: {card.back}</p>
                  </div>
                  <button
                    onClick={() => deleteFlashcard(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={20} />
                  </button>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Ajouter Quiz</h3>
            <Input
              label="Question"
              value={newQuizQuestion}
              onChange={(e) => setNewQuizQuestion(e.target.value)}
              placeholder="Question"
            />

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Options</label>
              {newQuizOptions.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...newQuizOptions]
                    newOptions[index] = e.target.value
                    setNewQuizOptions(newOptions)
                  }}
                  placeholder={`Option ${index + 1}`}
                  className="w-full px-4 py-2 mb-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-600"
                />
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Bonne réponse (0-3)
              </label>
              <select
                value={newQuizCorrect}
                onChange={(e) => setNewQuizCorrect(parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:outline-none focus:border-blue-600"
              >
                {[0, 1, 2, 3].map((n) => (
                  <option key={n} value={n}>
                    Option {n + 1}
                  </option>
                ))}
              </select>
            </div>

            <Button onClick={addQuiz} variant="primary" size="lg" className="w-full gap-2">
              <Plus size={20} />
              Ajouter
            </Button>
          </div>

          {quizzes.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-300">Quizzes:</h4>
              {quizzes.map((quiz, index) => (
                <Card key={index} className="p-4 flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-slate-400">{quiz.question}</p>
                    <div className="space-y-1 mt-2 text-sm">
                      {quiz.options.map((opt: any, i: number) => (
                        <p
                          key={i}
                          className={i === quiz.correct_answer ? 'text-green-400' : 'text-slate-400'}
                        >
                          {i + 1}. {opt} {i === quiz.correct_answer && '✓'}
                        </p>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteQuiz(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={20} />
                  </button>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex gap-4">
        <Button onClick={() => router.back()} variant="ghost" size="lg" className="flex-1">
          Annuler
        </Button>
        <Button
          onClick={handleSave}
          variant="primary"
          size="lg"
          isLoading={isSaving}
          disabled={!title.trim() || !content.trim() || isSaving}
          className="flex-1"
        >
          Créer
        </Button>
      </div>
    </div>
  )
}
