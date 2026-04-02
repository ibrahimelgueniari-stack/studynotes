# Guide de Développement - StudyNotes

Bonnes pratiques et directives pour le développement futur.

## 📐 Architecture

### Principes

1. **Separation of Concerns** - Chaque fichier a une responsabilité unique
2. **Composants Réutilisables** - Créer des composants génériques dans `ui/`
3. **Custom Hooks** - Extraire la logique dans les hooks
4. **Services** - Centraliser la logique métier
5. **Types - Utiliser TypeScript strictement

### Structure

```
src/
├── app/                # Pages et routes Next.js
├── components/
│   ├── ui/            # Composants génériques (Button, Card, etc.)
│   └── sections/      # Composants métier (ProfileCard, NoteCard, etc.)
├── lib/               # Utilitaires et helpers
├── services/          # Appels API et Supabase
├── store/             # État global (Zustand)
├── hooks/             # Hooks personnalisés
└── types/             # Définitions TypeScript
```

## 🎨 Design System

### Couleurs

- **Primary**: `#3b82f6` - Action principale
- **Accent**: `#06b6d4` - Accent secondaire
- **Success**: `#10b981` - Actions réussies
- **Error**: `#ef4444` - Erreurs
- **Background**: `#0a0a0a` - Fond principal
- **Surface**: `#111111` - Cartes et surfaces

### Espacement

Utiliser le système de spacing Tailwind (multiples de 4px) :
- `p-4` (16px) pour padding de base
- `mb-8` (32px) pour marges entre sections
- `gap-4` pour espacement entre éléments

### Typographie

- **Headings**: Font Weight 600-700
- **Body**: Font Weight 400
- **Labels**: Font Weight 500, text-sm

### Composants

Tous les composants doivent :
- Utiliser `forwardRef` pour les inputs/buttons
- Supporter `className` pour customisation
- Avoir des variants (primary, secondary, ghost, etc.)
- Être documentés avec JSDoc

## 🔧 Développement

### Variables d'Environnement

```env
# Pour la démo (public)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=

# Secrets (à ne jamais commit)
OPENAI_API_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_VISION_API_KEY=
```

### Commandes

```bash
# Développement
npm run dev              # Lancer le serveur local

# Build
npm run build            # Build pour production
npm run start            # Lancer la version build

# Linting
npm run lint             # Vérifier le code

# Format
npx prettier --write .   # Formater le code
```

### Git Workflow

```bash
# Créer une feature
git checkout -b feature/ma-feature

# Commit régulier
git commit -m "Add: description claire"

# Push
git push origin feature/ma-feature

# Créer une PR pour fusionner
```

## 🛡️ Sécurité

### Secrets

- ✅ Variables d'environnement dans `.env.local`
- ✅ Clés protégées coté serveur
- ❌ Jamais commit les secrets
- ❌ Jamais afficher les clés dans les logs

### Validation

```typescript
// Valider les inputs
if (!input || input.trim().length === 0) {
  throw new Error('Input invalide')
}

// Valider les réponses API
if (!response.ok) {
  throw new Error('Erreur API')
}
```

### CORS et CSP

Les headers sont configurés dans `next.config.js`.

## 🧪 Testing

### Tester manuellement

1. Créer un profil avec différents noms
2. Créer une fiche avec du texte
3. Vérifier la génération IA
4. Vérifier le partage
5. Tester sur mobile

### Tester les API

```bash
# Tester /api/analyze
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"content":"Texte de test"}'

# Tester /api/extract-text
curl -X POST http://localhost:3000/api/extract-text \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"https://..."}'
```

## 📦 Dépendances

### Core
- `next` - Framework React
- `react` / `react-dom` - Bibliothèque UI
- `typescript` - Langage typé

### Styling
- `tailwindcss` - Utility CSS
- `tailwind-merge` - Fusionner les classes
- `clsx` - Classe conditionnelles

### État
- `zustand` - State management léger

### API
- `@supabase/supabase-js` - Client Supabase
- `openai` - Client OpenAI
- `axios` - HTTP client

### UI
- `lucide-react` - Icônes SVG
- `react-hot-toast` - Notifications

### Utilitaires
- `framer-motion` - Animations (optionnel)

## 🚀 Optimisations

### Performance

```typescript
// ✅ Bon - Memoization
const MyComponent = React.memo(({ data }) => (
  // ...
))

// ✅ Bon - useCallback
const handleClick = useCallback(() => {
  // ...
}, [dependencies])

// ❌ Mauvais - Recréer à chaque rendu
const obj = { key: 'value' }
```

### Bundle

```bash
# Analyzer le bundle
npm run build && npx next-bundle-analyzer

# Tree-shaking automatique avec Next.js
```

### Images

```typescript
// ✅ Bon - Utiliser Image de Next.js
import Image from 'next/image'

<Image src="/avatar.png" alt="Avatar" width={64} height={64} />

// ❌ Mauvais - <img> basique
<img src="/avatar.png" alt="Avatar" />
```

## 📝 Code Style

### Nommer

```typescript
// ✅ Bon - Descriptif
const getUserStudyNotes = async (userId) => {}
const isLoading = true

// ❌ Mauvais - Ambigu
const get = async () => {}
const loading = true // Est-ce quoi?
```

### Commentaires

```typescript
// ✅ Bon - JSDoc pour les fonctions
/**
 * Créer une nouvelle fiche d'étude
 * @param profileId - ID du profil propriétaire
 * @param title - Titre de la fiche
 * @returns La fiche créée
 */
async function createStudyNote(profileId: string, title: string) {
  // ...
}

// ❌ Mauvais - Commentaires inutiles
const x = 1; // x est 1
```

### Erreurs

```typescript
// ✅ Bon - Gestion d'erreur explicite
try {
  const data = await api.fetch()
  setData(data)
} catch (error) {
  console.error('Erreur lors du chargement:', error)
  setError(error.message)
}

// ❌ Mauvais - Erreur silencieuse
try {
  const data = await api.fetch()
  setData(data)
} catch (error) {
  // Ignorer l'erreur
}
```

## 🔄 Intégration API

### Appels Supabase

```typescript
// Utiliser les services
import { studyNoteService } from '@/services/supabase'

const notes = await studyNoteService.getByProfileId(profileId)
```

### Appels OpenAI

```typescript
// Utiliser le service
import { aiService } from '@/services/ai'

const result = await aiService.analyzeAndGenerate(content)
```

### Erreurs API

```typescript
try {
  const data = await apiCall()
} catch (error) {
  if (error.response?.status === 401) {
    // Non authentifiée
  } else if (error.response?.status === 404) {
    // Non trouvée
  } else {
    // Autre erreur
  }
}
```

## 📚 Ressources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [OpenAI Docs](https://platform.openai.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

## ⚡ Checklist pour une Feature Nouvelle

- [ ] Créer une branche git
- [ ] Implémenter la logique
- [ ] Ajouter les types TypeScript
- [ ] Créer le composant UI ou page
- [ ] Tester manuellement
- [ ] Vérifier la responsivité mobile
- [ ] Vérifier l'accessibilité
- [ ] Commit avec message clair
- [ ] Push vers la branche

## 🐛 Debugging

### Console

```typescript
console.log('Debug:', variable) // Logs de débugage
console.error('Erreur:', error)  // Erreurs
```

### DevTools

- Ouvrir avec `F12` ou `Ctrl+Shift+I`
- **Network** - Vérifier les appels API
- **Console** - Lire les erreurs
- **Application** - Vérifier localStorage, cookies

### VS Code

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

## 🎯 Objectifs Futurs

### Court Terme
- [ ] Authentification OAuth (Google, GitHub)
- [ ] Upload d'images vers Supabase Storage
- [ ] Export PDF des fiches
- [ ] Recherche globale
- [ ] Favoris/Bookmarks

### Moyen Terme
- [ ] Collaborations entre usagers
- [ ] Notifications temps réel
- [ ] Classement des fiches populaires
- [ ] Historique d'étude
- [ ] Statistiques d'apprentissage

### Long Terme
- [ ] Application mobile (React Native)
- [ ] Synchronisation offline
- [ ] AI powered practice
- [ ] Intégration Spaced Repetition
- [ ] Marketplace de fiches

---

**Bon développement! 🚀**
