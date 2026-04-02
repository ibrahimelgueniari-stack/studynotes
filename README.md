# 📚 StudyNotes - Plateforme Premium de Fiches d'Étude

Une application web **production-ready** pour créer, organiser et partager des fiches d'étude entre amis.

🚀 **Déployable en ligne immédiatement** sur Vercel avec un lien public!

## 🎨 Caractéristiques

- ✨ **Design Ultra Premium** - Dark mode moderne, animations fluides, glassmorphism
- 👥 **Gestion des Profils** - Créer plusieurs profils avec avatars personnalisés (Netflix-style)
- 📚 **Fiches d'Étude Complètes** - Contenu riche, flashcards, quizzes
- 🔄 **Flashcards Manuelles** - Ajoutez vos propres Q/A pairs
- 🎯 **Quizzes Interactifs** - Testez vos connaissances avec scoring
- 🌍 **Partage Social** - Partagez vos fiches publiquement, découvrez celle des autres
- 📱 **Fully Responsive** - Fonctionne parfaitement mobile, tablet, desktop
- 🔐 **Production-Ready** - Déployable en un clic sur Vercel

---

## 🚀 MISE EN LIGNE RAPIDE (5 min)

### Pour déployer ton site immédiatement:

**Voir le guide complet:** 👉 [QUICK_DEPLOY.md](QUICK_DEPLOY.md) (5 minutes)

**Ou le guide détaillé:** 👉 [GITHUB_SETUP.md](GITHUB_SETUP.md) (15 minutes)

**Les étapes essentielles:**
1. Git push vers GitHub → `git push origin main`
2. Importer dans Vercel → https://vercel.com/new
3. Configurer variables d'env (Supabase credentials)
4. Deploy! ✅
5. **Obtenir un lien public** comme `https://studynotes-app-XXXX.vercel.app`

---

## 🛠 Stack Technologique

- **Frontend** - Next.js 14 (App Router), React 18, TypeScript
- **Styling** - Tailwind CSS avec design system premium
- **Animation** - Framer Motion, CSS natives
- **État Global** - Zustand, React Context
- **Base de Données** - Supabase (PostgreSQL)
- **Déploiement** - Vercel (production-ready)

## 📁 Structure du Projet

```
src/
├── app/
│   ├── layout.tsx              # Layout principal
│   ├── globals.css             # Styles globaux
│   ├── page.tsx                # Page d'accueil (sélection profils)
│   ├── dashboard/
│   │   ├── layout.tsx          # Layout avec navigation
│   │   ├── page.tsx            # Dashboard principal
│   │   ├── create/             # Création de fiches
│   │   ├── my-notes/           # Mes fiches
│   │   ├── shared/             # Fiches partagées
│   │   ├── note/[id]/          # Détail fiche
│   │   └── profile/            # Profil utilisateur
│   └── api/
│       ├── analyze/            # API pour analyse IA
│       └── extract-text/       # API pour OCR
├── components/
│   ├── ui/                     # Composants UI réutilisables
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Avatar.tsx
│   │   ├── Modal.tsx
│   │   └── Spinner.tsx
│   └── sections/               # Composants métier
│       ├── Navigation.tsx
│       ├── ProfileCard.tsx
│       └── StudyNoteCard.tsx
├── lib/
│   └── utils.ts                # Utilitaires
├── services/
│   ├── supabase.ts             # Services Supabase
│   ├── ai.ts                   # Services OpenAI
│   └── ocr.ts                  # Services OCR
├── store/
│   └── app.ts                  # State management (Zustand)
└── types/
    └── index.ts                # Types TypeScript
```

## 🚀 Installation et Déploiement

### 🎯 Option 1: Déployer en Production (Recommandé)

**Tu veux un lien public immédiatement?** Suis [QUICK_DEPLOY.md](QUICK_DEPLOY.md) (5 min)

### 💻 Option 2: Développement Local

**1. Clone et installe**
```bash
npm install
```

**2. Configure `.env.local`**
```bash
cp .env.example .env.local
```

Remplis avec tes credentials Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

**3. Crée les tables Supabase**

Va dans Supabase SQL Editor et copie-colle le script depuis [SETUP.md](SETUP.md)

**4. Démarre en local**
```bash
npm run dev
```

Ouvre http://localhost:3000

### 🚀 Option 3: Passer de Local à Production

Une fois que ça marche en local:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

Puis suis [GITHUB_SETUP.md](GITHUB_SETUP.md) pour Vercel!

```sql
-- Profiles table
create table public.profiles (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  pin text,
  avatar_initials text not null,
  avatar_color text not null,
  created_at timestamp default now() not null,
  updated_at timestamp default now() not null
);

-- Study Notes table
create table public.study_notes (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content text not null,
  subject text,
  summary text,
  is_shared boolean default false,
  created_at timestamp default now() not null,
  updated_at timestamp default now() not null
);

-- Flashcards table
create table public.flashcards (
  id uuid default gen_random_uuid() primary key,
  study_note_id uuid not null references public.study_notes(id) on delete cascade,
  question text not null,
  answer text not null,
  created_at timestamp default now() not null
);

-- Quizzes table
create table public.quizzes (
  id uuid default gen_random_uuid() primary key,
  study_note_id uuid not null references public.study_notes(id) on delete cascade,
  question text not null,
  options text[] not null,
  correct_answer integer not null,
  created_at timestamp default now() not null
);

-- Create indexes for better performance
create index idx_study_notes_profile_id on public.study_notes(profile_id);
create index idx_study_notes_is_shared on public.study_notes(is_shared);
create index idx_flashcards_study_note_id on public.flashcards(study_note_id);
create index idx_quizzes_study_note_id on public.quizzes(study_note_id);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.study_notes enable row level security;
alter table public.flashcards enable row level security;
alter table public.quizzes enable row level security;

-- Create RLS policies (public access for demo)
create policy "Public access" on public.profiles
  for all using (true);

create policy "Public access" on public.study_notes
  for all using (true)
  with check (true);

create policy "Public access" on public.flashcards
  for all using (true);

create policy "Public access" on public.quizzes
  for all using (true);
```

### 📖 Documentation Détaillée

- **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** - Déployer en 5 min sur Vercel
- **[GITHUB_SETUP.md](GITHUB_SETUP.md)** - Guide GitHub + Vercel complet
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Guide production détaillé
- **[PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)** - Vérifications avant live
- **[SETUP.md](SETUP.md)** - Configuration Supabase avec SQL
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Architecture du projet

## 📖 Utilisation

### User Workflow

1. **Accueil** - Créez ou sélectionnez un profil (Netflix-style)
2. **Dashboard** - Voyez toutes vos fiches et les fiches partagées
3. **Créer** - Entrez du texte pour votre fiche
4. **Ajouter** - Flashcards (Q&A) et Quizzes (multi-choice)
5. **Partager** - Rendez la fiche publique ou gardez-la privée
6. **Étudier** - Utilisez les flashcards et quizzes pour mémoriser

### Routes de l'Application

- `/` - Page d'accueil et sélection profils
- `/dashboard` - Dashboard principal
- `/dashboard/create` - Créer nouvelle fiche
- `/dashboard/my-notes` - Mes fiches d'étude
- `/dashboard/notes/[id]` - Afficher détail d'une fiche
- `/dashboard/shared` - Fiches partagées par les autres
- `/dashboard/profile` - Settings du profil

## 🎨 Design & Customisation

### Architecture Clean Code

- ✅ TypeScript strict mode
- ✅ React Hooks + Context API
- ✅ Composants réutilisables
- ✅ Services layer avec Supabase
- ✅ Validation centralisée
- ✅ Error handling robuste
- ✅ Production-ready structure

### Design System

Le design system est défini dans `tailwind.config.ts` :

- **Color Palette** - Dark mode (slate-950 backgrounds)
- **Primary** - Blue-600 (#3b82f6)
- **Accent** - Purple-600 (#a855f7)
- **Avatars** - 10 gradients colorés
- **Effects** - Glassmorphism, shadows, animations

## � Déploiement en Production

### Déployer sur Vercel (Recommandé)

**Option facile et rapide:** Suis [QUICK_DEPLOY.md](QUICK_DEPLOY.md)

**Ou le guide complet:** Suis [GITHUB_SETUP.md](GITHUB_SETUP.md)

**En résumé:**
```bash
# 1. Commit et push sur GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Importe sur Vercel
# https://vercel.com/new → Sélectionne ton GitHub repo

# 3. Configure les variables d'env Supabase
# Dans Vercel Dashboard > Settings > Environment Variables

# 4. Deploy! ✅
# Ton site sera live en quelques minutes
```

### Variables d'Environnement Production

Vercel doit avoir ces 3 variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Domaine Personnalisé (Optionnel)

Après le déploiement, tu peux ajouter un domaine custom:

1. Vercel Dashboard → Settings → Domains
2. Ajoute ton domaine
3. Change les DNS chez ton registrar
4. Boom → `https://studynotes.com` ✓

## 🔐 Sécurité & Production

- ✅ Variables d'environnement protégées (`.env.local` ignoré)
- ✅ RLS (Row Level Security) activé sur Supabase
- ✅ HTTPS obligatoire (Vercel)
- ✅ TypeScript pour prévenir les erreurs
- ✅ Validation des inputs
- ✅ Pas de secrets hardcodés

**Avant la production réelle:**
- Restreindre les RLS policies (utilisateurs seulement)
- Ajouter l'authentification (email/password)
- Configurer CORS correctement
- Monitorer les erreurs (Vercel + Sentry)
- Backup réguliers (Supabase)

---

## 📝 Prochaines Étapes (Futur)

- [ ] Authentification vraie (email/password)
- [ ] Upload d'images vers Supabase Storage
- [ ] Notifications en temps réel (WebSocket)
- [ ] Collaborations entre users
- [ ] Statistiques d'étude (charts, analytics)
- [ ] Export PDF des fiches
- [ ] Dark/Light mode toggle
- [ ] Traduction multilingue
- [ ] App mobile (React Native)

## 📄 License

MIT

## 💬 Support

Pour des questions ou problèmes, créez une issue sur GitHub.

---

**Créé avec ❤️ - Version 1.0.0**
