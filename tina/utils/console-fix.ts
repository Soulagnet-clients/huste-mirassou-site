// Correctif pour les erreurs console de TinaCMS
// Ces erreurs viennent du fait que TinaCMS passe des props React non reconnues aux éléments DOM

// Sauvegarder les fonctions console originales
let originalWarn: typeof console.warn;
let originalError: typeof console.error;

// Fonction pour supprimer les warnings React spécifiques
export const suppressReactWarnings = () => {
  // Sauvegarder les fonctions originales si pas déjà fait
  if (!originalWarn) {
    originalWarn = console.warn;
    originalError = console.error;
  }

  // Liste des warnings à supprimer
  const warningsToSuppress = [
    'React does not recognize the `setOption` prop',
    'React does not recognize the `setOptions` prop',
    'React does not recognize the `getOption` prop',
    'React does not recognize the `getOptions` prop',
    'Warning: React does not recognize the',
    'setOption',
    'setOptions',
    'getOption',
    'getOptions',
    'Support for defaultProps will be removed',
    'defaultProps',
    'Connect(Droppable)',
    'memo components',
  ];

  // Fonction helper pour vérifier si un message doit être supprimé
  const shouldSuppress = (message: string) => {
    return warningsToSuppress.some(warning =>
      message.toLowerCase().includes(warning.toLowerCase())
    );
  };

  // Remplacer console.warn
  console.warn = (...args: any[]) => {
    const message = args.join(' ');
    if (!shouldSuppress(message)) {
      originalWarn.apply(console, args);
    }
  };

  // Remplacer console.error pour les erreurs React similaires
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    if (!shouldSuppress(message)) {
      originalError.apply(console, args);
    }
  };
};

// Fonction pour restaurer console.warn et console.error originaux
export const restoreConsoleWarnings = () => {
  if (originalWarn) {
    console.warn = originalWarn;
  }
  if (originalError) {
    console.error = originalError;
  }
};

// Fonction pour appliquer le correctif de manière plus agressive
export const applyGlobalConsoleFix = () => {
  // Appliquer immédiatement
  suppressReactWarnings();

  // Réappliquer après un délai pour s'assurer que ça marche
  setTimeout(() => {
    suppressReactWarnings();
  }, 100);

  // Réappliquer quand le DOM est prêt
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', suppressReactWarnings);
    } else {
      suppressReactWarnings();
    }
  }
};
