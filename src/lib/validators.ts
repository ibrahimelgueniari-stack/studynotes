// Validation helpers

export const validators = {
  // Profile name validation
  isValidProfileName: (name: string): boolean => {
    if (!name) return false;
    if (name.length < 2) return false;
    if (name.length > 50) return false;
    return /^[a-zA-Z\s\-'àâäéèêëïîôöùûüœçÀÂÄÉÈÊËÏÎÔÖÙÛÜŒÇ]+$/.test(name);
  },

  // PIN validation (4-6 digits)
  isValidPin: (pin: string): boolean => {
    if (!pin) return true; // PIN is optional
    return /^\d{4,6}$/.test(pin);
  },

  // Study note title validation
  isValidTitle: (title: string): boolean => {
    if (!title) return false;
    if (title.length < 3) return false;
    if (title.length > 200) return false;
    return true;
  },

  // Content validation
  isValidContent: (content: string): boolean => {
    if (!content) return false;
    if (content.length < 10) return false;
    if (content.length > 10000) return false;
    return true;
  },

  // Category validation
  isValidCategory: (category: string): boolean => {
    if (!category) return false;
    if (category.length < 2) return false;
    if (category.length > 50) return false;
    return true;
  },

  // Flashcard validation
  isValidFlashcard: (front: string, back: string): boolean => {
    if (!front || !back) return false;
    if (front.length < 3 || front.length > 500) return false;
    if (back.length < 3 || back.length > 500) return false;
    return true;
  },

  // Quiz question validation
  isValidQuizQuestion: (
    question: string,
    options: string[],
    correctAnswerIndex: number
  ): boolean => {
    if (!question || question.length < 5 || question.length > 500) return false;
    if (!options || options.length !== 4) return false;
    if (!options.every((opt) => opt && opt.length > 0 && opt.length <= 200)) return false;
    if (correctAnswerIndex < 0 || correctAnswerIndex >= 4) return false;
    return true;
  },

  // Email validation
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // URL validation
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Get validation error message
  getErrorMessage: (field: string, rule: string): string => {
    const messages: Record<string, Record<string, string>> = {
      profileName: {
        required: 'Le nom du profil est requis',
        minLength: 'Le nom doit contenir au moins 2 caractères',
        maxLength: 'Le nom ne peut pas dépasser 50 caractères',
        invalid: 'Le nom contient des caractères invalides',
      },
      pin: {
        invalid: 'Le code PIN doit contenir 4 à 6 chiffres',
      },
      title: {
        required: 'Le titre est requis',
        minLength: 'Le titre doit contenir au moins 3 caractères',
        maxLength: 'Le titre ne peut pas dépasser 200 caractères',
      },
      content: {
        required: 'Le contenu est requis',
        minLength: 'Le contenu doit contenir au moins 10 caractères',
        maxLength: 'Le contenu ne peut pas dépasser 10000 caractères',
      },
      category: {
        required: 'La catégorie est requise',
        minLength: 'La catégorie doit contenir au moins 2 caractères',
        maxLength: 'La catégorie ne peut pas dépasser 50 caractères',
      },
      flashcard: {
        required: 'La question et la réponse sont requises',
        minLength: 'La question et la réponse doivent contenir au moins 3 caractères',
        maxLength: 'La question et la réponse ne peuvent pas dépasser 500 caractères',
      },
      quiz: {
        required: 'Tous les champs sont requis',
        optionsCount: 'Vous devez avoir exactement 4 options',
        minLength: 'Chaque option doit contenir au moins 1 caractère',
        maxLength: 'Chaque option ne peut pas dépasser 200 caractères',
      },
    };

    return messages[field]?.[rule] || 'Erreur de validation';
  },
};
