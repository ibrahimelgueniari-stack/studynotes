# ✅ Production Readiness Checklist

Ce fichier vérifie que **le projet est prêt à être déployé en production** sur Vercel.

---

## 🔍 Vérifications Essentielles

### 1️⃣ Code Quality & Security

#### ✓ .gitignore correctement configuré

```bash
# Vérify que .env.local n'est PAS committé
git status

# Devrait montrer
nothing to commit, working tree clean
```

**Tu NE dois PAS voir:**
- `.env.local`
- `.env.*.local`
- `node_modules/`

#### ✓ Pas de secrets hardcodés

Cherche ces patterns:

```bash
grep -r "sk_test_" src/       # Stripe keys?
grep -r "pk_test_" src/       # Stripe keys?
grep -r "BEGIN PRIVATE KEY" src/  # SSL keys?
```

**Si tu trouves des secrets:**
1. Crée une `.env.local`
2. Mets la valeur dedans
3. Remplace par `process.env.VARIABLE_NAME`
4. Commit et push

#### ✓ Dépendances à jour

```bash
npm outdated
```

Si tu vois des versions OLD:
```bash
npm update
npm audit fix
```

### 2️⃣ Build & Runtime

#### ✓ Build réussie

```bash
npm run build
```

Doit afficher:
```
✓ Compiled 23 routes with 0 errors
✓ Generated static sitemap
```

**Si erreurs:**
- Fix les erreurs TypeScript
- Re-run `npm run build`

#### ✓ Serveur démarrage

```bash
npm run build
npm start
```

Doit afficher:
```
> next start

> Local:        http://localhost:3000
```

**Puis ouvre http://localhost:3000** et teste:
- [ ] Page d'accueil charge
- [ ] Peux créer un profil
- [ ] Peux créer une fiche
- [ ] Peux voir les flashcards
- [ ] Peux tester les quizzes

### 3️⃣ Environment Variables

#### ✓ Variables correctes

**Vérify dans `.env.local`:**

```env
# Toutes ces 3 variables doivent exister:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

#### ✓ Pas d'erreurs de connexion

Au démarrage du serveur, tu ne dois pas voir:
```
Error: Failed to connect to Supabase
```

Si tu vois ça:
1. Vérifie les variables dans `.env.local`
2. Vérifie que tu es connecté à internet
3. Vérifie le status Supabase: https://status.supabase.com

#### ✓ Variables dans Vercel

**Avant de déployer, configure dans Vercel:**

1. Vercel Dashboard → Settings → Environment Variables
2. Ajoute les 3 variables
3. S'assure que le scope inclut "Production"

---

## 🗄️ Supabase Production Setup

### ✓ Tables existent

```sql
-- Vérify que toutes les tables existent
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
```

**Valeurs attendues:**
- [x] `profiles` table
- [x] `study_notes` table
- [x] `flashcards` table
- [x] `quizzes` table

### ✓ RLS Activé

```sql
-- Vérify RLS est activé
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('profiles', 'study_notes', 'flashcards', 'quizzes');
```

**Toutes les valeurs dans `rowsecurity` doivent être `true`**

### ✓ Policies Configurées

```sql
-- Vérify les policies (pour démo)
SELECT * FROM pg_policies
WHERE tablename = 'profiles';
```

**Tu devrais voir:**
```
Public access policy
```

### ✓ Indexes existent

Les indexes rendent les requêtes rapides:
```sql
SELECT indexname FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY indexname;
```

**Tu devrais voir:**
- `idx_study_notes_profile_id`
- `idx_study_notes_is_shared`
- `idx_flashcards_study_note_id`
- `idx_quizzes_study_note_id`

---

## 🌐 GitHub Ready

### ✓ Repository créé

```bash
git config --get remote.origin.url
```

Doit retourner quelque chose comme:
```
https://github.com/TONUSERNAME/studynotes-app.git
```

### ✓ Tous les commits pushés

```bash
git log --oneline -5

git push origin main
```

Pas de messages "ahead of origin"

### ✓ .gitignore Respecté

```bash
# Vérifiy .env.local n'est pas suivi
git ls-files | grep ".env"

# Doit être vide!
```

---

## 🚀 Vercel Ready

### ✓ Projet importé

1. Vercel Dashboard → Projects
2. Tu devrais voir `studynotes-app`

### ✓ Domaine obtenu

Vercel donne un domaine gratuit:
```
https://studynotes-app-XXXX.vercel.app
```

### ✓ Dernière build réussie

Vercel Dashboard:
1. Clique le projet
2. Clique "Deployments"
3. Tu devrais voir ✅ "Ready" sur la dernière build

### ✓ Site accessible

Ouvre ton URL Vercel et teste:
- [ ] Home page charge
- [ ] Peux créer profil (teste avec Supabase)
- [ ] Les données persistent
- [ ] Pas d'erreurs 500
- [ ] Responsive design (resize ton navigateur)

---

## 📱 Responsive Testing

### Desktop (1920x1080)
- [ ] Header/Nav affiche correctement
- [ ] Content area bien dimensionné
- [ ] Buttons cliquables
- [ ] Formulaires exploitables

### Tablet (768x1024)
- [ ] Layout adapté
- [ ] Pas de scrolling horizontal
- [ ] Touch-friendly buttons

### Mobile (375x667)
- [ ] Bottom nav au lieu de sidebar
- [ ] Text lisible (font size)
- [ ] Pas de scroll horizontal
- [ ] Buttons cliquables facilement

**Teste dans DevTools:**
```
F12 → Toggle Device Toolbar → Teste différentes tailles
```

---

## 🔒 Security Checklist

### ✓ HTTPS Activé

Vercel force HTTPS par défaut ✓

### ✓ Pas de credentials exposées

Grep pour potentiels secrets:
```bash
grep -r "password" src/
grep -r "secret" src/
grep -r "key" src/
```

Tous les secrets doivent venir de `process.env.*`

### ✓ RLS Strong

En production, les RLS policies devraient être restrictives:

```sql
-- Exemple pour restricter à l'utilisateur seulement:
create policy "Users can view their own profiles"
on profiles for select
using (auth.uid() = id);
```

**Pour v1.0, les policies publiques sont OK** (démo)

### ✓ CORS Configuré (si APIs)

Si tu ajoutes des APIs externes, config CORS:
```typescript
// next.config.js
headers: [
  {
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: '*' },
    ],
  },
]
```

---

## 📊 Performance Check

### ✓ Bundle Size Raisonnable

```bash
npm run build

# Regarde le output:
# Route sizes
```

**Doit être < 500KB** par route

### ✓ Images Optimizées

Si tu as des images:
```
✓ Using next/image ✓
✓ Images optimized ✓
```

---

## 🧪 Functional Testing

### ✓ User Flow v1.0

**Étape par étape:**

1. Ouvre le site en production
   ```
   https://studynotes-app-XXXX.vercel.app
   ```

2. **Create Profile**
   - [ ] Clique "+ Nouveau profil"
   - [ ] Entre un nom
   - [ ] Entre optionnellement un PIN
   - [ ] Clique "Créer"
   - [ ] Profil apparaît ✓

3. **Select Profile**
   - [ ] Clique sur le profil créé
   - [ ] Redirigé vers dashboard
   - [ ] Greeting affiché

4. **Create Note**
   - [ ] Clique "Créer"
   - [ ] Entre un titre
   - [ ] Sélectionne une catégorie
   - [ ] Entre du content
   - [ ] Clique "Créer la fiche"
   - [ ] Note créée et visible ✓

5. **View Note**
   - [ ] Clique sur la note
   - [ ] Vois le contenu complet
   - [ ] Onglets: Content, Flashcards, Quiz
   - [ ] Chaque onglet marche ✓

6. **Create Flashcard**
   - [ ] Dans onglet Flashcards du create
   - [ ] Ajoute une Q/A pair
   - [ ] Fait partie de la note ✓

7. **Take Quiz**
   - [ ] Dans onglet Quiz du detail
   - [ ] Répond aux questions
   - [ ] Vois le score ✓

8. **Share Note**
   - [ ] Dans detail de note
   - [ ] Clique "Partager"
   - [ ] Note devient "Public"
   - [ ] Vois sur "Fiches Partagées" ✓

### ✓ Database Persistence

Crée une note, puis:
1. Ferme le navigateur
2. Ouvre à nouveau le site
3. **La note doit toujours être là!** ✓

---

## 🎯 Final Checklist

- [ ] Code build localement sans erreurs
- [ ] npm start fonctionne (test production build)
- [ ] .env.local N'EST PAS dans git
- [ ] Tous les secrets en variables d'environnement
- [ ] Repository GitHub public et à jour
- [ ] Vercel configuré avec variables
- [ ] Build Vercel réussie (✅ Production)
- [ ] Site accessible via URL publique
- [ ] Tests fonctionnels passent
- [ ] Design responsive testé (desktop/tablet/mobile)
- [ ] Supabase tables + RLS configuré
- [ ] Pas d'erreurs 500 en production
- [ ] Pas d'erreurs de sécurité (credentials exposées)

---

## 🚀 Next Steps

### Immédiat (après déploiement)
- [ ] Partage le lien avec les utilisateurs
- [ ] Recueille du feedback
- [ ] Monitore les erreurs (Vercel logs)

### Court terme (v1.1)
- [ ] Ajouter authentication (email/password)
- [ ] Upload images vers Supabase Storage
- [ ] Responsive design improvements
- [ ] Dark/Light mode toggle

### Medium terme (v2.0)
- [ ] Ajouter AI summaries si voulu
- [ ] Collaborations entre users
- [ ] Statistiques d'étude
- [ ] Export PDF
- [ ] Mobile app

---

## 📞 Support

**Problème en production?**

Checklist:
1. Ouvre les logs Vercel: Dashboard → Deployments → Latest
2. Cherche l'erreur
3. Fix localement (`npm run build`)
4. Commit et push (Vercel redéploie auto)

**Supabase issues?**
- https://status.supabase.com (status page)
- Supabase Docs: https://supabase.com/docs

**Vercel issues?**
- Vercel Status: https://vercel-status.com
- Vercel Docs: https://vercel.com/docs

---

✅ **Prêt pour la production!** 🎉
