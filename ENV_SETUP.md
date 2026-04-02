# 🔑 Guide des Variables d'Environnement

Configuration complète de `.env.local` pour StudyNotes.

## 📋 Vue d'ensemble

Vous avez besoin de 3 services pour le fonctionnement complet:
1. **Supabase** (Base de données)
2. **OpenAI** (Intelligence artificielle)
3. **Google Cloud Vision** (OCR optionnel)

---

## 1️⃣ Supabase (Base de Données)

### Créer un compte Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Cliquez "Sign up"
3. Utilisez votre email ou compte GitHub
4. Vérifiez votre email

### Créer un projet

1. Dashboard → "New Project"
2. Remplissez:
   - **Name** - "StudyNotes" (ou votre nom)
   - **Database Password** - Générer un mot de passe fort
   - **Region** - Choisir votre région (Europe si vous êtes en Europe)
3. Attendez 2-3 minutes que le projet se crée

### Récupérer les clés

1. Allez dans **Settings → API**
2. Sous "Project API keys", vous verrez:

```
Project URL
eyJxxxxxxxxxxxxxxxx.xxxxx.xxx

anon (public)
eyJxxxxxxxxxxxxxxxx.xxxxx.xxx

service_role (secret)
[Ne montrer que si vous cliquez "Reveal"]
```

**Dont copiez-collez:**

```env
# URL de votre projet
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co

# Clé publique (safe to expose in frontend code)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxxx.xxxxx.xxx

# Clé secrète (PRIVÉE! Ne jamais commit!)
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxxxxxxxxxxxx.xxxxx.xxx
```

### Créer les tables

1. Dashboard Supabase
2. **SQL Editor** (en bas à gauche)
3. **New Query**
4. Copier le script de DATABASE.md
5. Cliquer "Run"

✅ Les tables sont prêtes!

---

## 2️⃣ OpenAI (Intelligence Artificielle)

### Créer un compte OpenAI

1. Allez sur [openai.com](https://openai.com)
2. Cliquez "Sign up"
3. Suivez l'inscription
4. Vérifiez votre email

### Créer une clé API

1. [Allez à openai.com/api/keys](https://platform.openai.com/api/keys)
2. Connectez-vous si vous ne l'êtes pas
3. **Create new secret key**
4. Nommez-la "StudyNotes"
5. Cliquez "Create secret key"
6. **Copier immédiatement** (vous ne pourrez pas le relire!)

**Collez dans `.env.local`:**

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxx
```

### Vérifier les crédits

1. Allez à [openai.com/account/usage](https://openai.com/account/usage)
2. Vérifiez que vous avez des crédits (au moins $5 recommandé)
3. Si pas de crédit, allez à **Billing → Add payment method**

⚠️ **Important:** OpenAI facture via API tokens. Gratuit: $5 d'essai initiaux.

---

## 3️⃣ Google Cloud Vision (OCR Optionnel)

### Pour l'extraction de texte des images

1. Créez un compte [Google Cloud](https://cloud.google.com/)
2. Créez un nouveau projet
3. Activez "Cloud Vision API"
4. Créez une clé de service
5. Téléchargez la clé JSON
6. Copier la `project_id`

**Collez dans `.env.local`:**

```env
GOOGLE_VISION_API_KEY=votre_cle_google
```

**⚠️ NOTE:** C'est optionnel. Si pas configuré, les uploads d'images disent "configuration OCR requise".

---

## 📝 Fichier `.env.local` Complet

Créez le fichier `site web/.env.local` et remplissez:

```env
# =========================================
# SUPABASE (Obligatoire)
# =========================================
# Récupérer depuis: Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGcixxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGcixxxxxxxxxxxxxxxxxxxx

# =========================================
# OPENAI (Obligatoire)
# =========================================
# Récupérer depuis: openai.com/api/keys
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxx

# =========================================
# GOOGLE VISION (Optionnel)
# =========================================
# Récupérer depuis: Google Cloud Console
GOOGLE_VISION_API_KEY=

# =========================================
# APP CONFIGURATION
# =========================================
# URL de votre app
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

---

## ✅ Vérifier que tout fonctionne

### Test 1: Supabase
```bash
npm run dev

# Aller à http://localhost:3000
# Essayer de créer un profil
# Vérifier qu'il s'enregistre dans Supabase
```

### Test 2: OpenAI
```bash
# Dans l'app:
# 1. Créer une fiche avec du texte
# 2. Cliquer "Analyser"
# 3. Attendre la réponse

# Si erreur "API Error", vérifier:
# - OPENAI_API_KEY est correct
# - Vous avez des crédits
```

### Test 3: Afficher les logs

Ouvrir navigateur → F12 → Console
Vous verrez les requêtes API et les erreurs.

---

## 🚨 Problèmes Courants

### "Supabase credentials missing"
```
❌ NEXT_PUBLIC_SUPABASE_URL n'est pas rempli
✅ Vérifiez .env.local
```

### "Cannot POST /api/analyze"
```
❌ OPENAI_API_KEY est vide ou invalide
✅ Vérifiez la clé depuis openai.com/api/keys
```

### L'app démarre mais rien ne s'affiche
```
❌ Variables d'env mal remplies
✅ Arrêtez le serveur (Ctrl+C)
✅ Vérifiez .env.local
✅ Redémarrez: npm run dev
```

### "Network error" au démarrage
```
❌ Supabase project pas actif
✅ Vérifiez sur supabase.com que votre projet existe
✅ L'URL est correcte?
```

---

## 🔒 Sécurité des Variables

### ✅ SAFE pour commit
```env
NEXT_PUBLIC_SUPABASE_URL=...      (public, c'est ok)
NEXT_PUBLIC_SUPABASE_ANON_KEY=... (public, c'est ok)
NEXT_PUBLIC_APP_URL=...           (public, c'est ok)
NODE_ENV=...                       (public, c'est ok)
```

### ❌ NEVER commit!!!
```env
OPENAI_API_KEY=...                (SECRET!)
SUPABASE_SERVICE_ROLE_KEY=...     (SECRET!)
GOOGLE_VISION_API_KEY=...         (SECRET si sensible)
```

### ✅ Assurez-vous que `.gitignore` contient:
```
.env.local
.env
.env.*.local
```

---

## 🔄 Cycle de Vie des Variables

```bash
# Développement
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Staging
NEXT_PUBLIC_APP_URL=https://staging.example.com

# Production
NEXT_PUBLIC_APP_URL=https://example.com
```

---

## 📱 Pour Déployer sur Vercel

1. Git → Push votre code
2. [Allez sur vercel.com](https://vercel.com)
3. Click "New Project"
4. Connectez votre repo GitHub
5. **Environment Variables**:
   - Ajouter toutes les variables (sauf .env.local)
6. Deploy!

**Dans Vercel Dashboard:**
- Settings → Environment Variables
- Ajouter chaque variable

---

## 📚 Documentations Officielles

- [Supabase Setup](https://supabase.com/docs/guides/getting-started)
- [OpenAI API Keys](https://platform.openai.com/docs/guides/authentication)
- [Google Vision API](https://cloud.google.com/vision/docs/setup)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

## 🎯 Ordre de Configuration Recommandé

1. **Créer compte Supabase** (5 min)
2. **Créer tables Supabase** (2 min)
3. **Créer compte OpenAI** (3 min)
4. **Générer clé OpenAI** (1 min)
5. **Remplir `.env.local`** (2 min)
6. **Tester** (2 min)

**Total: 15 minutes!**

---

## 💾 Template `.env.local`

Copiez et adaptez:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenAI (required)
OPENAI_API_KEY=sk-proj-...

# Google Vision (optional)
GOOGLE_VISION_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

**Vous êtes prêt! Commencez par QUICKSTART.md** 🚀
