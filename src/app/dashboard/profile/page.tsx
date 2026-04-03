'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/app'
import { Avatar, Button, Card, Input } from '@/components/ui'
import { profileService } from '@/services/supabase'
import { LogOut, Edit2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { AVATAR_COLORS } from '@/lib/constants'

export default function Profile() {
  const router = useRouter()
  const { currentProfile, setCurrentProfile } = useAppStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(currentProfile?.first_name || '')
  const [isSaving, setIsSaving] = useState(false)

  if (!currentProfile) {
    return (
      <div className='p-6 text-center'>
        <p>Please select a profile first</p>
      </div>
    )
  }

  const handleSave = async () => {
    if (!editName.trim()) return

    try {
      setIsSaving(true)
      await profileService.update(currentProfile.id, { first_name: editName })
      setCurrentProfile({ ...currentProfile, first_name: editName })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Erreur lors de la mise à jour')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr? Cette action ne peut pas être annulée.')) return

    try {
      await profileService.delete(currentProfile.id)
      setCurrentProfile(null)
      router.push('/')
    } catch (error) {
      console.error('Error deleting profile:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const handleLogout = () => {
    setCurrentProfile(null)
    router.push('/')
  }

  return (
    <div className='max-w-2xl mx-auto p-6 md:p-8'>
      <h1 className='text-3xl md:text-4xl font-bold mb-8'>Mon profil</h1>

      {/* Profile Card */}
      <Card className='p-8 mb-8'>
        <div className='flex items-start justify-between gap-8'>
          <div className='flex items-center gap-6'>
            <Avatar
              initials={currentProfile.first_name.charAt(0).toUpperCase()}
              color={AVATAR_COLORS[currentProfile.avatar_index % AVATAR_COLORS.length]}
              size='xl'
            />
            <div>
              {isEditing ? (
                <div className='space-y-4 w-full'>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder='Nom'
                    autoFocus
                  />
                  <div className='flex gap-2'>
                    <Button
                      onClick={handleSave}
                      variant='primary'
                      size='sm'
                      isLoading={isSaving}
                      disabled={!editName.trim() || isSaving}
                    >
                      Enregistrer
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false)
                        setEditName(currentProfile.first_name)
                      }}
                      variant='secondary'
                      size='sm'
                      disabled={isSaving}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className='text-2xl font-bold'>{currentProfile.first_name}</h2>
                  <p className='text-muted-foreground mt-1'>
                    Créé le {new Date(currentProfile.created_at).toLocaleDateString('fr-FR')}
                  </p>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant='secondary'
                    size='sm'
                    className='mt-4 gap-2'
                  >
                    <Edit2 size={16} />
                    Modifier le profil
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
        <Card className='p-6'>
          <p className='text-muted-foreground text-sm mb-2'>ID du profil</p>
          <p className='font-mono text-sm break-all'>{currentProfile.id}</p>
        </Card>
        <Card className='p-6'>
          <p className='text-muted-foreground text-sm mb-2'>Dernière mise à jour</p>
          <p className='text-sm'>{new Date(currentProfile.updated_at).toLocaleDateString('fr-FR')}</p>
        </Card>
      </div>

      {/* Quick Links */}
      <Card className='p-8 mb-8'>
        <h3 className='text-lg font-bold mb-4'>Raccourcis</h3>
        <div className='space-y-2'>
          <Link href='/dashboard'>
            <Button variant='ghost' className='w-full justify-start'>
              📊 Aller au dashboard
            </Button>
          </Link>
          <Link href='/dashboard/my-notes'>
            <Button variant='ghost' className='w-full justify-start'>
              📚 Mes fiches
            </Button>
          </Link>
          <Link href='/dashboard/create'>
            <Button variant='ghost' className='w-full justify-start'>
              ➕ Créer une fiche
            </Button>
          </Link>
          <Link href='/dashboard/shared'>
            <Button variant='ghost' className='w-full justify-start'>
              🌍 Fiches partagées
            </Button>
          </Link>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className='p-8 border-error/30'>
        <h3 className='text-lg font-bold mb-4 text-error'>Zone de danger</h3>
        <div className='space-y-3'>
          <div>
            <p className='text-sm text-muted-foreground mb-3'>
              Supprimer ce profil et toutes ses données associées
            </p>
            <Button
              onClick={handleDelete}
              variant='danger'
              className='gap-2'
            >
              <Trash2 size={16} />
              Supprimer le profil
            </Button>
          </div>
          <div className='pt-4 border-t border-border'>
            <p className='text-sm text-muted-foreground mb-3'>
              Déconnecter
            </p>
            <Button
              onClick={handleLogout}
              variant='secondary'
              className='gap-2'
            >
              <LogOut size={16} />
              Déconnexion
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
