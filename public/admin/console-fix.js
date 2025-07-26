// Correctif console pour TinaCMS - Version JavaScript pure
// Ce fichier sera chargé avant TinaCMS pour supprimer les warnings

(function() {
  'use strict';
  
  // Sauvegarder les fonctions originales
  const originalWarn = console.warn;
  const originalError = console.error;
  
  // Liste des warnings à supprimer
  const warningsToSuppress = [
    'react does not recognize',
    'setoption',
    'setoptions',
    'getoption',
    'getoptions',
    'warning: react does not recognize the',
    'support for defaultprops will be removed',
    'defaultprops',
    'connect(droppable)',
    'memo components',
  ];
  
  // Fonction helper pour vérifier si un message doit être supprimé
  function shouldSuppress(message) {
    const lowerMessage = message.toLowerCase();
    return warningsToSuppress.some(function(warning) {
      return lowerMessage.includes(warning);
    });
  }
  
  // Remplacer console.warn
  console.warn = function() {
    const message = Array.prototype.join.call(arguments, ' ');
    if (!shouldSuppress(message)) {
      originalWarn.apply(console, arguments);
    }
  };
  
  // Remplacer console.error
  console.error = function() {
    const message = Array.prototype.join.call(arguments, ' ');
    if (!shouldSuppress(message)) {
      originalError.apply(console, arguments);
    }
  };
  
  // Log de confirmation
  console.log('🔧 Console fix appliqué pour TinaCMS');
})();
