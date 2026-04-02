// Couleurs premium pour les avatars
export const AVATAR_COLORS = [
  '#FF6B6B', // Rouge
  '#4ECDC4', // Teal
  '#45B7D1', // Bleu ciel
  '#FFA07A', // Saumon
  '#98D8C8', // Menthe
  '#F7DC6F', // Or
  '#BB8FCE', // Violet
  '#85C1E2', // Bleu pale
  '#F8B88B', // Beige
  '#A8E6CF', // Vert clair
  '#FFD93D', // Jaune
  '#FF6B9D', // Rose
]

// Catégories de matières prédéfinies
export const PREDEFINED_SUBJECTS = [
  'Mathématiques',
  'Français',
  'Anglais',
  'Histoire',
  'Géographie',
  'Sciences',
  'Physique',
  'Chimie',
  'Biologie',
  'Informatique',
  'Philosophie',
  'Économie',
  'Droit',
  'Musique',
  'Arts',
  'Géométrie',
  'Statistiques',
  'Littérature',
  'Grammaire',
  'Vocabulaire',
]

// Configuration OpenAI
export const AI_CONFIG = {
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 2000,
}

// Configuration pagination
export const PAGINATION = {
  itemsPerPage: 12,
  itemsPerPageMobile: 6,
}

// Messages de l'application
export const MESSAGES = {
  success: {
    profileCreated: 'Profil créé avec succès!',
    noteCreated: 'Fiche d\'étude créée!',
    noteDeleted: 'Fiche supprimée',
    noteShared: 'Fiche partagée',
    noteMadePrivate: 'Fiche rendue privée',
    copied: 'Copié dans le presse-papiers!',
  },
  error: {
    failedToCreateProfile: 'Erreur lors de la création du profil',
    failedToCreateNote: 'Erreur lors de la création de la fiche',
    failedToDelete: 'Erreur lors de la suppression',
    failedAnalysis: 'Erreur lors de l\'analyse',
    networkError: 'Erreur réseau, veuillez réessayer',
  },
  loading: {
    analyzing: 'Analyse en cours...',
    creating: 'Création en cours...',
    saving: 'Sauvegarde...',
  },
}

// Animations
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 250,
  slow: 350,
}

// Z-index
export const Z_INDEX = {
  dropdown: 1000,
  modal: 1050,
  tooltip: 1100,
  notification: 1200,
}

// Tailles
export const SIZES = {
  mobileBreakpoint: 768,
  containerWidth: 1280,
  sidebarWidth: 256,
  topbarHeight: 64,
  bottomNavHeight: 80,
}

// Temps (en ms)
export const TIMEOUTS = {
  toast: 3000,
  debounce: 300,
  api: 30000,
}
