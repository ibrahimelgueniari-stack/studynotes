# Guide de Démarrage Rapide - StudyNotes

Démarrez votre plateforme d'étude en 10 minutes.

## 1️⃣ Prérequis

- Node.js 18+
- npm ou yarn
- Compte Supabase (gratuit sur supabase.com)
- Clé API OpenAI

## 2️⃣ Installation (3 min)

```bash
# Cloner et naviguer
cd "site web"

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env.local
```

## 3️⃣ Configurer Supabase (4 min)

### Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Cliquez "New Project"
3. Remplissez les informations
4. Attendez que le projet se crée

### Récupérer les clés

Allez à **Settings > API** :
- Copier `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- Copier `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Créer les tables

Allez à **SQL Editor**, cliquez **New Query** et collez :

```sql
-- Profiles
create table public.profiles (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  pin text,
  avatar_initials text not null,
  avatar_color text not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Study Notes
create table public.study_notes (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  content text not null,
  subject text,
  summary text,
  is_shared boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Flashcards
create table public.flashcards (
  id uuid default gen_random_uuid() primary key,
  study_note_id uuid references public.study_notes(id) on delete cascade,
  question text not null,
  answer text not null,
  created_at timestamp default now()
);

-- Quizzes
create table public.quizzes (
  id uuid default gen_random_uuid() primary key,
  study_note_id uuid references public.study_notes(id) on delete cascade,
  question text not null,
  options text[],
  correct_answer integer,
  created_at timestamp default now()
);

-- Enable access
alter table public.profiles enable row level security;
alter table public.study_notes enable row level security;
alter table public.flashcards enable row level security;
alter table public.quizzes enable row level security;

-- RLS Policies
create policy "Enable read access for all users" on public.profiles
  for select using (true);
create policy "Enable insert access for all users" on public.profiles
  for insert with check (true);
create policy "Enable update for users" on public.profiles
  for update using (true) with check (true);
create policy "Enable delete for users" on public.profiles
  for delete using (true);

create policy "Enable all for study_notes" on public.study_notes
  for all using (true) with check (true);

create policy "Enable all for flashcards" on public.flashcards
  for all using (true) with check (true);

create policy "Enable all for quizzes" on public.quizzes
  for all using (true) with check (true);
```

Cliquez **RUN**

## 4️⃣ Configurer OpenAI (2 min)

1. Allez sur [openai.com/api](https://openai.com/api)
2. Créez un compte ou connectez-vous
3. Allez à **API keys**
4. Cliquez **Create new secret key**
5. Copier la clé → `OPENAI_API_KEY` dans `.env.local`

**Important:** Ne partager jamais votre clé OpenAI!

## 5️⃣ Configurer `.env.local`

Éditez `.env.local` :

```env
# Supabase (récupérées depuis Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxx...

# OpenAI
OPENAI_API_KEY=sk-proj-xxx...

# OCR (optionnel)
GOOGLE_VISION_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 6️⃣ Lancer l'app

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) 🎉

## ✅ Tester

1. **Créer un profil** - Cliquez "Créer un nouveau profil", entrez un prénom
2. **Créer une fiche** - Cliquez "Créer une fichu", collez un texte
3. **Analyser** - Cliquez "Analyser le contenu"
4. **Générer** - L'IA génère automatiquement résumé, flashcards, quiz
5. **Enregistrer** - Cliquez "Enregistrer la fiche"
6. **Partager** - Cliquez l'icône "Partager" pour rendre visible à tous

## 🔧 Problèmes courants

### "Cannot find module" ou "Supabase credentials missing"
```bash
npm install
# Vérifiez que .env.local contient les bonnes clés
```

### "OpenAI API Error"
- Vérifiez la clé `OPENAI_API_KEY`
- Allez à [openai.com/account/usage](https://openai.com/account/usage) pour vérifier les crédits

### Port 3000 déjà utilisé
```bash
npm run dev -- -p 3001
```

### Les données ne sauvegardent pas
- Vérifiez Supabase est en ligne
- Vérifiez les RLS policies (voir SQL Editor)
- Ouvrez la console (F12) pour voir les erreurs

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🚀 Prochainement

- Authentification real (login/signup)
- Upload d'images
- Notifications temps réel
- Partage by link
- Stats d'étude
- Export PDF

Bon courage ! 🎓
