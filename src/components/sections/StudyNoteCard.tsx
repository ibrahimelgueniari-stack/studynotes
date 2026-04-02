'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseService } from '@/services/supabase';
import { useToast } from '@/hooks/useToast';
import { Card } from '@/components/ui';
import { Share2, Lock, Trash2, Eye } from 'lucide-react';
import type { StudyNote } from '@/types';

const AVATAR_COLORS = [
  'from-red-600 to-red-400',
  'from-blue-600 to-blue-400',
  'from-purple-600 to-purple-400',
  'from-pink-600 to-pink-400',
  'from-green-600 to-green-400',
  'from-yellow-600 to-yellow-400',
  'from-indigo-600 to-indigo-400',
  'from-orange-600 to-orange-400',
  'from-cyan-600 to-cyan-400',
  'from-emerald-600 to-emerald-400',
];

interface StudyNoteCardProps {
  note: StudyNote;
  colorIndex?: number;
  onUpdate?: () => void;
}

const StudyNoteCard: React.FC<StudyNoteCardProps> = ({ note, colorIndex = 0, onUpdate }) => {
  const router = useRouter();
  const { currentProfile } = useAuth();
  const { toast } = useToast();

  const isOwner = currentProfile?.id === note.profile_id;
  const color = AVATAR_COLORS[colorIndex];

  const handleToggleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await supabaseService.toggleShareNote(note.id, !note.is_shared);
      toast({
        type: 'success',
        message: note.is_shared ? 'Fiche rendue privée' : 'Fiche partagée',
      });
      onUpdate?.();
    } catch (error) {
      console.error('Error toggling share:', error);
      toast({
        type: 'error',
        message: 'Erreur lors du partage',
      });
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Êtes-vous sûr de vouloir supprimer cette fiche?')) return;

    try {
      await supabaseService.deleteNote(note.id);
      toast({
        type: 'success',
        message: 'Fiche supprimée',
      });
      onUpdate?.();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        type: 'error',
        message: 'Erreur lors de la suppression',
      });
    }
  };

  return (
    <Link href={`/dashboard/notes/${note.id}`}>
      <Card className='p-6 h-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-slate-600 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex-1'>
            <h3 className='text-lg font-semibold text-white line-clamp-2'>{note.title}</h3>
            <span className='inline-block mt-2 px-2 py-1 rounded text-xs bg-blue-600/20 text-blue-300'>
              {note.category}
            </span>
          </div>
          <div>
            {note.is_shared ? (
              <Share2 size={18} className='text-green-400' />
            ) : (
              <Lock size={18} className='text-slate-500' />
            )}
          </div>
        </div>

        <p className='text-sm text-slate-300 flex-1 line-clamp-3 mb-4'>
          {note.content}
        </p>

        <div className='pt-4 border-t border-slate-700 flex items-center justify-between'>
          <p className='text-xs text-slate-500'>
            {new Date(note.created_at).toLocaleDateString('fr-FR', {
              month: 'short',
              day: 'numeric',
            })}
          </p>

          {isOwner && (
            <div className='flex gap-2' onClick={(e) => e.preventDefault()}>
              <button
                onClick={handleToggleShare}
                className='p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-200'
                title={note.is_shared ? 'Rendre privée' : 'Partager'}
              >
                <Share2 size={16} />
              </button>
              <button
                onClick={handleDelete}
                className='p-2 rounded-lg hover:bg-red-600/20 transition-colors text-slate-400 hover:text-red-400'
                title='Supprimer'
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default StudyNoteCard;
