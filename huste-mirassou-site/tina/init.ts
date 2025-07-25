// Initialisation de TinaCMS avec correctifs
import { applyGlobalConsoleFix } from './utils/console-fix';

// Appliquer les correctifs dès que possible
if (typeof window !== 'undefined') {
  // Supprimer les warnings React de TinaCMS de manière agressive
  applyGlobalConsoleFix();

  // Log de confirmation (seulement en développement)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 TinaCMS: Correctifs console appliqués');
  }
}
