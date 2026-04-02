'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Home, BookOpen, Plus, Share2, User, LogOut } from 'lucide-react';
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

interface NavigationProps {
  profile: Profile;
}

const Navigation: React.FC<NavigationProps> = ({ profile }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setCurrentProfile } = useAuth();
  const [, setSavedProfileId] = useLocalStorage<string | null>('currentProfileId', null);

  const navItems = [
    { href: '', label: 'Accueil', icon: Home },
    { href: '/my-notes', label: 'Mes fiches', icon: BookOpen },
    { href: '/create', label: 'Créer', icon: Plus },
    { href: '/shared', label: 'Partagées', icon: Share2 },
    { href: '/profile', label: 'Profil', icon: User },
  ];

  const handleLogout = () => {
    setCurrentProfile(null);
    setSavedProfileId(null);
    router.push('/');
  };

  const isActive = (href: string) => {
    if (href === '') {
      return pathname === '/' || pathname.startsWith('/(dashboard)');
    }
    return pathname.endsWith(href);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <aside className='hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 p-6'>
        {/* Logo */}
        <Link href='/' className='text-2xl font-bold text-white mb-8 flex items-center gap-2'>
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${AVATAR_COLORS[profile.avatar_index]} flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30`}>
            S
          </div>
          StudyNotes
        </Link>

        {/* Profile Info */}
        <div className='mb-8 p-4 rounded-lg bg-slate-800/50 border border-slate-700'>
          <p className='text-xs text-slate-400 mb-2'>Connecté en tant que</p>
          <p className='text-sm font-medium text-white truncate'>{profile.first_name}</p>
        </div>

        {/* Navigation Items */}
        <nav className='flex-1 space-y-2'>
          {navItems.map(({ href, label, icon: Icon }) => {
            const fullHref = href === '' ? '' : `/dashboard${href}`;
            const active = isActive(fullHref);

            return (
              <Link
                key={href}
                href={fullHref === '' ? '/dashboard' : fullHref}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className='border-t border-slate-700 pt-4'>
          <button
            onClick={handleLogout}
            className='w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-red-400 hover:bg-slate-800/50 rounded-lg transition-all'
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className='md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex items-center justify-around px-2 py-3 z-40'>
        {navItems.map(({ href, label, icon: Icon }) => {
          const fullHref = href === '' ? '' : `/dashboard${href}`;
          const active = isActive(fullHref);

          return (
            <Link
              key={href}
              href={fullHref === '' ? '/dashboard' : fullHref}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all text-xs ${
                active ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title={label}
            >
              <Icon size={24} />
              <span className='hidden sm:inline text-xs'>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Navigation;
