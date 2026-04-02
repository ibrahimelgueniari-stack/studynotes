# Schéma de la Base de Données - StudyNotes

Documentations complète des tables et relations.

## 📋 Tables

### 1. `profiles` - Profils utilisateurs

Stocks dans les profils des utilisateurs (sans authentification).

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  pin TEXT,
  avatar_initials TEXT NOT NULL,
  avatar_color TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
)
```

**Champs:**
- `id` - Identifiant unique
- `name` - Prénom de l'utilisateur
- `pin` - Code PIN optionnel à 4 chiffres
- `avatar_initials` - Initiales pour l'avatar (ex: "AB")
- `avatar_color` - Couleur du cercle avatar (ex: "#FF6B6B")
- `created_at` - Date de création
- `updated_at` - Dernière modification

**Exemple:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Alice",
  "pin": null,
  "avatar_initials": "AL",
  "avatar_color": "#4ECDC4",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### 2. `study_notes` - Fiches d'étude

Contient les fiches d'étude créées par les profils.

```sql
CREATE TABLE study_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  subject TEXT,
  summary TEXT,
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
)
```

**Champs:**
- `id` - Identifiant unique
- `profile_id` - Référence au propriétaire (clé étrangère)
- `title` - Titre de la fiche
- `content` - Contenu texte complet
- `subject` - Matière/sujet (ex: "Mathématiques")
- `summary` - Résumé généré par l'IA
- `is_shared` - Publique (true) ou privée (false)
- `created_at` - Date de création
- `updated_at` - Dernière modification

**Exemple:**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "profile_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Les Fonctions Mathématiques",
  "content": "Une fonction est...",
  "subject": "Mathématiques",
  "summary": "Les fonctions sont des relations...",
  "is_shared": true,
  "created_at": "2024-01-15T11:00:00Z",
  "updated_at": "2024-01-15T11:00:00Z"
}
```

---

### 3. `flashcards` - Cartes mémoire

Flashcards générées automatiquement pour chaque fiche.

```sql
CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_note_id UUID NOT NULL REFERENCES study_notes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
)
```

**Champs:**
- `id` - Identifiant unique
- `study_note_id` - Référence à la fiche (clé étrangère)
- `question` - La question
- `answer` - La réponse
- `created_at` - Date de création

**Exemple:**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "study_note_id": "660e8400-e29b-41d4-a716-446655440001",
  "question": "Qu'est-ce qu'une fonction?",
  "answer": "Une fonction est une relation entre des ensembles...",
  "created_at": "2024-01-15T11:00:00Z"
}
```

---

### 4. `quizzes` - Questions de quiz

Questions de quiz avec options multiples.

```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_note_id UUID NOT NULL REFERENCES study_notes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT now()
)
```

**Champs:**
- `id` - Identifiant unique
- `study_note_id` - Référence à la fiche (clé étrangère)
- `question` - La question du quiz
- `options` - Array de 4 options (PostgreSQL TEXT[])
- `correct_answer` - Index de la bonne réponse (0-3)
- `created_at` - Date de création

**Exemple:**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "study_note_id": "660e8400-e29b-41d4-a716-446655440001",
  "question": "Quel est le domaine d'une fonction?",
  "options": [
    "L'ensemble de départ",
    "L'ensemble d'arrivée",
    "Le résultat",
    "Le coefficient"
  ],
  "correct_answer": 0,
  "created_at": "2024-01-15T11:00:00Z"
}
```

---

## 🔗 Relations

```
profiles (1) ──── (N) study_notes
  id                  profile_id

study_notes (1) ──── (N) flashcards
  id                      study_note_id

study_notes (1) ──── (N) quizzes
  id                      study_note_id
```

---

## 🔑 Indexes pour Performance

```sql
CREATE INDEX idx_study_notes_profile_id ON study_notes(profile_id);
CREATE INDEX idx_study_notes_is_shared ON study_notes(is_shared);
CREATE INDEX idx_flashcards_study_note_id ON flashcards(study_note_id);
CREATE INDEX idx_quizzes_study_note_id ON quizzes(study_note_id);
```

---

## 🔐 Row Level Security (RLS)

Pour la démo, les RLS policies permettent l'accès public :

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access" ON profiles FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE study_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access" ON study_notes FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access" ON flashcards FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access" ON quizzes FOR ALL USING (true) WITH CHECK (true);
```

**⚠️ En production**, implémentez une authentification réelle et des policies sécurisées :

```sql
-- Exemple pour production
CREATE POLICY "Users can only access their own profiles"
  ON profiles
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can only access their own study notes"
  ON study_notes
  FOR SELECT
  USING (profile_id = auth.uid() OR is_shared = true);
```

---

## 📊 Capacité

- **Profiles:** Illimité (très petit)
- **Study Notes:** Illimité (taille moyenne)
- **Flashcards:** ~10-20 par fiche (petit)
- **Quizzes:** ~5-10 par fiche (petit)

**Limite Supabase gratuit:**
- 500 MB de stockage
- ~50,000 lignes recommandées

---

## 🔄 Workflow de Création de Fiche

```
1. Utilisateur crée un profil
   → INSERT INTO profiles

2. Utilisateur crée une fiche
   → INSERT INTO study_notes

3. IA génère du contenu
   → INSERT INTO flashcards (multiple)
   → INSERT INTO quizzes (multiple)
   → UPDATE study_notes SET summary

4. Utilisateur partage
   → UPDATE study_notes SET is_shared = true
```

---

## 💾 Sauvegarde et Récupération

**Sauvegarde:**
Supabase sauvegarde automatiquement. Vous pouvez aussi :
```sql
-- Exporter les données
pg_dump connection_string > backup.sql
```

**Récupération:**
```sql
psql connection_string < backup.sql
```

---

## 📈 Requêtes Utiles

**Obtenir les fiches partagées par matière:**
```sql
SELECT * FROM study_notes
WHERE is_shared = true
ORDER BY subject, created_at DESC;
```

**Obtenir toutes les flashcards d'une fiche:**
```sql
SELECT f.* FROM flashcards f
JOIN study_notes sn ON f.study_note_id = sn.id
WHERE sn.id = '660e8400-e29b-41d4-a716-446655440001';
```

**Compter les fiches par utilisateur:**
```sql
SELECT profile_id, COUNT(*) as note_count
FROM study_notes
GROUP BY profile_id
ORDER BY note_count DESC;
```

---

## Version Historique

- **v1.0** (2024-01) - Schéma initial
