# 📑 Index du Projet - StudyNotes

Navigateur complet du projet pour trouver rapidement ce que vous cherchez.

## 📖 Documentation

| Fichier | Objectif |
|---------|----------|
| **README.md** | Vue d'ensemble du projet, features et déploiement |
| **QUICKSTART.md** | Installation en 10 minutes, configuration rapide |
| **DELIVERY.md** | Ce qui a été livré et comment démarrer |
| **DATABASE.md** | Schéma PostgreSQL, relations, requêtes utiles |
| **DEVELOPMENT.md** | Guide pour les développeurs, patterns et bonnes pratiques |
| **copilot-instructions.md** | Instructions pour GitHub Copilot |

**👉 Commencer par:** QUICKSTART.md si c'est votre première fois

---

## 🔧 Configuration

| Fichier | Rôle |
|---------|------|
| **.env.example** | Template des variables d'environnement |
| **.env.local** | **À REMPLIR** - Vos clés API Supabase, OpenAI |
| **next.config.js** | Configuration Next.js (images, headers, etc.) |
| **tsconfig.json** | Configuration TypeScript et paths |
| **tailwind.config.ts** | Design system, couleurs, animations |
| **postcss.config.js** | Preprocessing CSS avec Tailwind |
| **.eslintrc.json** | Linter pour la qualité du code |
| **.gitignore** | Fichiers à ignorer avec Git |
| **package.json** | Dépendances et scripts npm |

---

## 🎨 Pages et Routes

### Page d'Accueil
- **`src/app/page.tsx`** - Accueil avec sélection/création de profils
- **`src/app/layout.tsx`** - Layout principal
- **`src/app/globals.css`** - Styles globaux

### Dashboard (Connecté)
- **`src/app/dashboard/layout.tsx`** - Layout avec navigation
- **`src/app/dashboard/page.tsx`** - Dashboard principal
- **`src/app/dashboard/create/page.tsx`** - Créer une fiche
- **`src/app/dashboard/note/[id]/page.tsx`** - Voir une fiche
- **`src/app/dashboard/my-notes/page.tsx`** - Mes fiches
- **`src/app/dashboard/shared/page.tsx`** - Fiches partagées
- **`src/app/dashboard/profile/page.tsx`** - Profil utilisateur

### API Routes
- **`src/app/api/analyze/route.ts`** - Analyser contenu avec IA
- **`src/app/api/extract-text/route.ts`** - Extraire texte des images

---

## 🧩 Composants

### Composants UI (Réutilisables)
Dossier: `src/components/ui/`

| Composant | Fichier | Usage |
|-----------|---------|-------|
| Button | Button.tsx | Boutons avec 4 variants |
| Card | Card.tsx | Cartes standard premium |
| Input | Input.tsx | Inputs texte avec label |
| Avatar | Avatar.tsx | Avatars colorés |
| Modal | Modal.tsx | Modales réutilisables |
| Spinner | Spinner.tsx | Spinner de chargement |
| - | index.ts | Export de tous les composants |

### Composants Métier (Spécifiques)
Dossier: `src/components/sections/`

| Composant | Fichier | Objectif |
|-----------|---------|----------|
| Navigation | Navigation.tsx | Sidebar + bottom nav mobile |
| ProfileCard | ProfileCard.tsx | Carte d'un profil |
| StudyNoteCard | StudyNoteCard.tsx | Carte d'une fiche d'étude |

---

## 🛠️ Services et Logique

| Fichier | Contient |
|---------|----------|
| **`src/services/supabase.ts`** | Services CRUD (profiles, notes, flashcards, quizzes) |
| **`src/services/ai.ts`** | Services OpenAI (analyse, génération de résumé) |
| **`src/services/ocr.ts`** | Services OCR (extraction de texte) |
| **`src/store/app.ts`** | État global Zustand |
| **`src/hooks/useToast.ts`** | Hook pour notifications toast |
| **`src/lib/utils.ts`** | Utilitaires (cn, colors, dates) |
| **`src/lib/constants.ts`** | Constantes de l'application |
| **`src/types/index.ts`** | Types TypeScript (Profile, StudyNote, etc.) |

---

## 📁 Hiérarchie Complète

```
site web/
│
├── 📚 Documentation
│   ├── README.md
│   ├── QUICKSTART.md
│   ├── DELIVERY.md
│   ├── DATABASE.md
│   ├── DEVELOPMENT.md
│   └── INDEX.md (ce fichier)
│
├── ⚙️ Configuration
│   ├── .env.example
│   ├── .env.local (à créer)
│   ├── .eslintrc.json
│   ├── .gitignore
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── next-env.d.ts
│   ├── package.json
│   ├── package-lock.json
│   └── copilot-instructions.md
│
├── 📦 Node modules (généré)
│   └── node_modules/
│
├── 🎨 Public Assets
│   └── public/
│
└── 💻 Source Code
    └── src/
        ├── app/                          # Pages et routes
        │   ├── layout.tsx
        │   ├── globals.css
        │   ├── page.tsx                  # Accueil
        │   ├── api/
        │   │   ├── analyze/
        │   │   │   └── route.ts          # API IA
        │   │   └── extract-text/
        │   │       └── route.ts          # API OCR
        │   └── dashboard/                # Pages connecté
        │       ├── layout.tsx
        │       ├── page.tsx
        │       ├── create/
        │       ├── note/[id]/
        │       ├── my-notes/
        │       ├── shared/
        │       └── profile/
        │
        ├── components/                   # Composants React
        │   ├── ui/                       # Réutilisables
        │   │   ├── Button.tsx
        │   │   ├── Card.tsx
        │   │   ├── Input.tsx
        │   │   ├── Avatar.tsx
        │   │   ├── Modal.tsx
        │   │   ├── Spinner.tsx
        │   │   └── index.ts
        │   └── sections/                 # Métier
        │       ├── Navigation.tsx
        │       ├── ProfileCard.tsx
        │       └── StudyNoteCard.tsx
        │
        ├── lib/                          # Utilitaires
        │   ├── utils.ts
        │   └── constants.ts
        │
        ├── services/                     # Intégrations
        │   ├── supabase.ts               # BD
        │   ├── ai.ts                     # OpenAI
        │   └── ocr.ts                    # Extraction texte
        │
        ├── store/                        # État global
        │   └── app.ts                    # Zustand
        │
        ├── hooks/                        # Hooks personnalisés
        │   └── useToast.ts
        │
        └── types/                        # Types TypeScript
            └── index.ts
```

---

## 🚀 Commandes Utiles

```bash
# Installation
npm install

# Développement
npm run dev              # Lancer serveur local (port 3000)

# Production
npm run build            # Build pour production
npm start                # Démarrer version build

# Maintenance
npm run lint             # Vérifier le code

# Format
npx prettier --write .   # Formater tout le code
```

---

## 🔑 Points d'Entrée

Pour **modifier ou ajouter** quelque chose:

| Besoin | Aller à |
|--------|---------|
| Ajouter une page | `src/app/dashboard/ma-page/page.tsx` |
| Ajouter un composant UI | `src/components/ui/MonComposant.tsx` |
| Ajouter une API | `src/app/api/ma-route/route.ts` |
| Modifier la base de données | `src/services/supabase.ts` |
| Ajouter une logique IA | `src/services/ai.ts` |
| Changer les couleurs | `tailwind.config.ts` |
| Ajouter une constante | `src/lib/constants.ts` |
| Ajouter un type | `src/types/index.ts` |
| Étendre l'état global | `src/store/app.ts` |
| Ajouter un hook | `src/hooks/useMonHook.ts` |

---

## 📞 Documentation par Sujet

### Installation & Configuration
→ **QUICKSTART.md**

### Architecture et Patterns
→ **DEVELOPMENT.md**

### Base de Données
→ **DATABASE.md**

### Deployment
→ **README.md** (section "Déploiement")

### Troubleshooting
→ **README.md** ou **QUICKSTART.md** (section Troubleshooting)

---

## 🎯 Workflow Typique

### 1. Démarrer le Projet
```
1. Lire QUICKSTART.md
2. Remplir .env.local
3. Créer tables Supabase
4. npm install
5. npm run dev
```

### 2. Ajouter une Feature
```
1. Créer le composant dans src/components/
2. Créer la page/route nécessaire
3. Ajouter la logique dans src/services/
4. Ajouter les types dans src/types/
5. Tester sur mobile et desktop
```

### 3. Deploy
```
1. Vérifier que tout fonctionne localement
2. Push sur GitHub
3. Deployer sur Vercel ou autre
4. Configurer les variables d'env
```

---

## 📊 Statistiques du Projet

- **Total de fichiers**: 50+
- **Lignes de code**: 3000+
- **Composants**: 10+
- **Pages/Routes**: 10+
- **Services**: 3
- **Documentation**: 6 fichiers complets

---

## 💾 Structures de Données Clés

```typescript
// Profile
{ id, name, pin?, avatar_initials, avatar_color, created_at, updated_at }

// StudyNote
{ id, profile_id, title, content, subject?, summary?, is_shared, created_at, updated_at }

// Flashcard
{ id, study_note_id, question, answer, created_at }

// Quiz
{ id, study_note_id, question, options[], correct_answer, created_at }
```

---

## ✅ Checklist de Démarrage

- [ ] Lire README.md
- [ ] Lire QUICKSTART.md
- [ ] Remplir .env.local
- [ ] Créer un compte Supabase
- [ ] Créer un compte OpenAI
- [ ] Exécuter `npm install`
- [ ] Exécuter les migrations Supabase
- [ ] Lancer `npm run dev`
- [ ] Tester sur [http://localhost:3000](http://localhost:3000)
- [ ] Créer un profil de test
- [ ] Créer une fiche de test
- [ ] Vérifier l'analyse IA fonctionne

---

## 🎓 Ressources Externes

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase Docs](https://supabase.com/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Vous êtes prêt à commencer! Bonne développement! 🚀**
