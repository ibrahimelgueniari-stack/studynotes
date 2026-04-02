## StudyNotes - Architecture Complète du Projet

### 📁 Structure des Dossiers

```
site web/
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Route group authentification
│   │   │   └── page.tsx              # Home + Sélection profils Netflix-style
│   │   │
│   │   ├── (dashboard)/               # Route group dashboard authentifié
│   │   │   ├── layout.tsx             # Layout avec Navigation sidebar
│   │   │   ├── page.tsx               # Dashboard principal
│   │   │   ├── create/
│   │   │   │   └── page.tsx           # Créer nouvelle fiche manuelle
│   │   │   ├── my-notes/
│   │   │   │   └── page.tsx           # Mes fiches (search + filter)
│   │   │   ├── notes/
│   │   │   │   └── [id]/page.tsx      # Détail fiche (flashcards + quiz)
│   │   │   ├── shared/
│   │   │   │   └── page.tsx           # Fiches partagées par amis
│   │   │   └── profile/
│   │   │       └── page.tsx           # Paramètres profil utilisateur
│   │   │
│   │   ├── api/                        # Routes API
│   │   │   └── (à ajouter si besoin)
│   │   │
│   │   ├── layout.tsx                 # Root layout + AuthProvider
│   │   ├── globals.css                # Styles globaux + animations
│   │   └── page.tsx                   # (à supprimer - remplacé par (auth))
│   │
│   ├── components/
│   │   ├── ui/                         # Composants UI primitifs
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── index.ts               # Export barrel
│   │   │
│   │   └── sections/                   # Composants au niveau page
│   │       ├── Navigation.tsx          # Sidebar + bottom nav
│   │       ├── ProfileCard.tsx         # Netflix-style profile card
│   │       └── StudyNoteCard.tsx       # Carte fiche d'étude
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx             # Profile context global
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                 # Utilise AuthContext
│   │   ├── useProfile.ts              # Gère profil + localStorage
│   │   ├── useNotes.ts                # Gère CRUD notes + état
│   │   ├── useLocalStorage.ts         # localStorage generic hook
│   │   └── useToast.ts                # Notifications sonner
│   │
│   ├── lib/
│   │   ├── supabase-client.ts        # Supabase client
│   │   ├── api-client.ts             # Axios wrapper
│   │   ├── validators.ts             # Validation utilities
│   │   ├── utils.ts                  # Helper functions
│   │   └── constants.ts              # App constants
│   │
│   ├── services/
│   │   └── supabase.ts               # Supabase service (CRUD profiles/notes/flashcards/quizzes)
│   │
│   ├── store/
│   │   └── app.ts                    # Zustand store (legacy)
│   │
│   └── types/
│       └── index.ts                   # TypeScript interfaces
│
├── public/                             # Static assets
├── .env.example                        # Environment variables template
├── .env.local                          # Local environment (git ignored)
├── package.json                        # Dependencies
├── tsconfig.json                       # TypeScript config
├── next.config.js                      # Next.js config
├── tailwind.config.ts                  # Tailwind CSS config
├── postcss.config.js                   # PostCSS config
└── README.md                           # Documentation
```

### 🗄️ Base de Données Supabase (PostgreSQL)

#### profiles table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(50) NOT NULL,
  pin VARCHAR(6),
  avatar_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### study_notes table
```sql
CREATE TABLE study_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50),
  is_shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_study_notes_profile_id ON study_notes(profile_id);
CREATE INDEX idx_study_notes_is_shared ON study_notes(is_shared);
```

#### flashcards table
```sql
CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_note_id UUID NOT NULL REFERENCES study_notes(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_flashcards_study_note_id ON flashcards(study_note_id);
```

#### quizzes table
```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_note_id UUID NOT NULL REFERENCES study_notes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_quizzes_study_note_id ON quizzes(study_note_id);
```

### 🎨 Design System

**Colors (Dark Mode):**
- Background: #0f172a (slate-950)
- Surface: #1e293b (slate-800)
- Primary: #3b82f6 (blue-600)
- Accent: #a855f7 (purple)
- Success: #10b981 (emerald)
- Error: #ef4444 (red)
- Text: #f1f5f9 (slate-100)
- Muted: #94a3b8 (slate-400)

**Effects:**
- Glassmorphism: rgba(255,255,255,0.05) + backdrop-blur-md
- Shadows: shadow-lg shadow-blue-500/30
- Borders: border-slate-700
- Radius: rounded-lg (8px), rounded-xl (12px), rounded-2xl (16px)

**Animations:**
- Transitions: transition-all duration-300
- Hover: scale-105, -translate-y-1, shadow-xl
- Loading: animate-spin

### 📦 Dependencies Essentielles

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "typescript": "^5.0.0",
    "@supabase/supabase-js": "^2.40.0",
    "zustand": "^4.4.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.294.0",
    "sonner": "^1.3.0",
    "axios": "^1.6.0",
    "clsx": "^2.0.0",
    "tailwindcss": "^3.4.0"
  }
}
```

### ✨ Flows Principaux

**1. Sélection de Profil (Auth)**
- Page (auth) affiche todos les profils Netflix-style
- Clic = setCurrentProfile + redirect /dashboard
- localStorage sauvegarde l'ID

**2. Création de Fiche (Manuel)**
- Form avec: titre, contenu texte, catégorie
- Optional: ajouter flashcards (question/réponse)
- Optional: ajouter quizzes (question + 4 options)
- Tout local en TypeScript avant submit
- POST /dashboard/create -> supabaseService.createNote()

**3. Consultation Fiche**
- 3 tabs: Contenu | Flashcards | Quiz
- Flashcards: card flip animation
- Quiz: multiple choice + correction immédiate

**4. Partage**
- Toggle is_shared boolean
- Fiches partagées visibles pour tous

**5. Recherche & Filtrage**
- Client-side filtering sur userNotes
- Filter par catégorie
- Search par titre/contenu

### 🔐 Sécurité

- Pas d'authentification (PIN optionnel pour profil)
- Données privées par profile_id (backend check)
- Images uploadées dans Supabase Storage
- Variables d'env pour credentials

### 📱 Responsive Design

- Mobile-first
- Sidebar desktop caché sur mobile
- Bottom nav mobile responsive
- Grids: 2 colonnes mobile, 3+ desktop
- Touch-friendly buttons (44px minimum)

### 🚀 Production Ready

- TypeScript strict mode
- Error handling complet
- Input validation validators.ts
- Loading states partout
- Toast notifications sonner
- Optimized images
- Code splitting automatic (Next.js)
