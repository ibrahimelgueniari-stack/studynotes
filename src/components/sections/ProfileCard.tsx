'use client';

import React from 'react';
import { Card } from '@/components/ui';
import type { Profile } from '@/types';

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

interface ProfileCardProps {
  profile: Profile;
  colorIndex?: number;
  isClickable?: boolean;
  onClick?: (profile: Profile) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, colorIndex = 0, isClickable = true, onClick }) => {
  const color = AVATAR_COLORS[profile.avatar_index || colorIndex];
  const initials = profile.first_name.substring(0, 2).toUpperCase();

  return (
    <div className={isClickable ? 'cursor-pointer group' : ''} onClick={() => onClick?.(profile)}>
      <Card className='flex flex-col items-center justify-center p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-slate-600'>
        <div
          className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform`}
        >
          {initials}
        </div>
        <h3 className='text-lg font-semibold text-white mt-4'>{profile.first_name}</h3>
        <p className='text-sm text-slate-400 mt-1'>
          {profile.pin ? '🔒 Protégé' : 'Sans PIN'}
        </p>
      </Card>
    </div>
  );
};

export default ProfileCard;
