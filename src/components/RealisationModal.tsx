'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { client } from '../../tina/__generated__/client';
import { Realisation, RealisationGallery } from '../types';

interface RealisationModalProps {
  realisation: Realisation | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RealisationModal({ realisation, isOpen, onClose }: RealisationModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullRealisation, setFullRealisation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [nextImageIndex, setNextImageIndex] = useState<number | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Refs pour accéder aux valeurs actuelles dans l'intervalle
  const currentImageIndexRef = useRef(currentImageIndex);
  const nextImageIndexRef = useRef(nextImageIndex);

  // Mettre à jour les refs quand les states changent
  useEffect(() => {
    currentImageIndexRef.current = currentImageIndex;
  }, [currentImageIndex]);

  useEffect(() => {
    nextImageIndexRef.current = nextImageIndex;
  }, [nextImageIndex]);

  // Utiliser fullRealisation si disponible, sinon realisation
  const displayRealisation = fullRealisation || realisation;

  // Fonction pour pauser temporairement le défilement automatique
  const pauseAutoScroll = useCallback(() => {
    setIsPaused(true);

    // Nettoyer le timeout précédent s'il existe
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }

    // Redémarrer le défilement après 5 secondes
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
      console.log('🔄 Redémarrage du défilement automatique');
    }, 5000);
  }, []);

  // Fonction pour changer d'image avec animation croisée
  const changeImage = useCallback((newIndex: number) => {
    if (newIndex === currentImageIndexRef.current || nextImageIndexRef.current !== null) return;

    console.log(`🎬 Démarrage transition: ${currentImageIndexRef.current} → ${newIndex}`);

    // Étape 1: Afficher la nouvelle image par-dessus (opacity 0 → 1)
    setNextImageIndex(newIndex);

    // Étape 2: Après la transition complète, nettoyer
    setTimeout(() => {
      setCurrentImageIndex(newIndex);
      setNextImageIndex(null);
      console.log(`✅ Transition terminée: ${newIndex}`);
    }, 300); // Une seule étape de 300ms
  }, []);

  // Créer un tableau d'images (featured_image + gallery)
  const allImages = displayRealisation ? [
    ...(displayRealisation.featured_image ? [{
      image: displayRealisation.featured_image,
      caption: `Image principale - ${displayRealisation.title}`
    }] : []),
    ...(displayRealisation.gallery || [])
  ] : [];

  // Reset index when modal opens or when images change
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setIsPaused(false);
      setNextImageIndex(null);
    }
  }, [isOpen, realisation]);

  // Charger le contenu complet quand le modal s'ouvre
  useEffect(() => {
    const loadFullContent = async () => {
      if (isOpen && realisation && realisation._sys?.filename) {
        setIsLoading(true);
        try {
          const result = await client.queries.realisation({
            relativePath: `${realisation._sys.filename}.mdx`
          });
          setFullRealisation(result.data.realisation);
        } catch (error) {
          console.error('Erreur lors du chargement du contenu complet:', error);
          setFullRealisation(realisation); // Fallback sur les données de base
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadFullContent();
  }, [isOpen, realisation]);

  // Vérifier que l'index reste valide
  useEffect(() => {
    if (allImages.length > 0 && currentImageIndex >= allImages.length) {
      setCurrentImageIndex(0);
    }
  }, [allImages.length, currentImageIndex]);

  // Défilement automatique des images
  useEffect(() => {
    if (!isOpen || allImages.length <= 1 || isPaused) return;

    console.log('🔄 Démarrage défilement automatique');
    const interval = setInterval(() => {
      // Vérifier qu'aucune transition n'est en cours
      if (nextImageIndexRef.current !== null) {
        console.log('⏸️ Transition en cours, attente...');
        return;
      }

      const nextIndex = currentImageIndexRef.current < allImages.length - 1 ? currentImageIndexRef.current + 1 : 0;
      console.log(`⏰ Défilement auto: ${currentImageIndexRef.current} → ${nextIndex}`);
      changeImage(nextIndex);
    }, 3000); // 3 secondes

    return () => {
      console.log('🛑 Arrêt défilement automatique');
      clearInterval(interval);
    };
  }, [isOpen, allImages.length, isPaused, changeImage]);

  // Gestion des touches clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          pauseAutoScroll(); // Pause le défilement automatique
          if (allImages.length > 0) {
            const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : allImages.length - 1;
            changeImage(newIndex);
          }
          break;
        case 'ArrowRight':
          pauseAutoScroll(); // Pause le défilement automatique
          if (allImages.length > 0) {
            const newIndex = currentImageIndex < allImages.length - 1 ? currentImageIndex + 1 : 0;
            changeImage(newIndex);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, allImages.length, pauseAutoScroll, changeImage]);

  if (!isOpen || !realisation) return null;

  const currentImage = allImages[currentImageIndex];

  // Vérifier que l'index est valide
  if (allImages.length === 0 || !currentImage) {
    // Pas d'images disponibles
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      {/* Overlay pour fermer */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      {/* Contenu du modal */}
      <div className="relative bg-white rounded-lg max-w-7xl max-h-[95vh] w-full mx-2 sm:mx-4 overflow-hidden" data-testid="realisation-modal">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{displayRealisation?.title}</h2>
            <p className="text-gray-600">
              {/* Afficher la catégorie (nouveau ou ancien format) */}
              {displayRealisation?.categorie
                ? (typeof displayRealisation.categorie === 'object'
                   ? displayRealisation.categorie.label
                   : displayRealisation.categorie)
                : (typeof displayRealisation?.type === 'object'
                   ? displayRealisation.type.label
                   : displayRealisation?.type)
              } • {displayRealisation?.date ? new Date(displayRealisation.date).toLocaleDateString('fr-FR') : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Section Image */}
          <div className="lg:w-3/5 relative">
            {allImages.length > 0 && currentImage ? (
              <>
                <div className="relative h-48 sm:h-64 lg:h-[550px] bg-gray-100">
                  {/* Image actuelle (toujours visible) */}
                  <img
                    src={currentImage.image}
                    alt={currentImage.caption || 'Image du projet'}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none"
                    style={{ opacity: 1 }}
                  />

                  {/* Image suivante (apparaît par-dessus pendant la transition) */}
                  {nextImageIndex !== null && allImages[nextImageIndex] && (
                    <img
                      src={allImages[nextImageIndex].image}
                      alt={allImages[nextImageIndex].caption || 'Image du projet'}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none opacity-0"
                      style={{
                        opacity: 1,
                        animation: 'fadeIn 300ms ease-in-out forwards'
                      }}
                    />
                  )}
                  
                  {/* Navigation des images */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={() => {
                          pauseAutoScroll(); // Pause le défilement automatique
                          if (allImages.length > 0) {
                            const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : allImages.length - 1;
                            changeImage(newIndex);
                          }
                        }}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => {
                          pauseAutoScroll(); // Pause le défilement automatique
                          if (allImages.length > 0) {
                            const newIndex = currentImageIndex < allImages.length - 1 ? currentImageIndex + 1 : 0;
                            changeImage(newIndex);
                          }
                        }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                      >
                        →
                      </button>
                    </>
                  )}
                </div>

                {/* Indicateurs d'images */}
                {allImages.length > 1 && (
                  <div className="flex justify-center space-x-2 p-4 bg-gray-50">
                    {allImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          pauseAutoScroll(); // Pause le défilement automatique
                          changeImage(index);
                        }}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentImageIndex 
                            ? 'bg-blue-600' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Description de l'image courante - très réduite */}
                {currentImage.caption && (
                  <div className="px-3 py-1 bg-gray-50 border-t">
                    <p className="text-xs text-gray-500 truncate">{currentImage.caption}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="h-48 sm:h-64 lg:h-[550px] bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 4h16v12H4V4zm2 2v8h12V6H6zm2 2h8v4H8V8z" />
                  </svg>
                  <p>Aucune image disponible</p>
                </div>
              </div>
            )}
          </div>

          {/* Section Informations */}
          <div className="lg:w-2/5 px-4 sm:px-6 pb-6 bg-gray-50 overflow-y-auto max-h-[calc(95vh-200px)] sm:max-h-[calc(95vh-280px)] lg:max-h-[calc(95vh-120px)]" style={{paddingTop: '5px'}}>
            <div className="space-y-6">
              {/* Description détaillée uniquement */}
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Chargement du contenu...</p>
                </div>
              ) : displayRealisation?.body ? (
                <div className="text-gray-700 leading-relaxed space-y-4 -mt-2">
                    <TinaMarkdown
                      content={displayRealisation.body}
                      components={{
                        h1: (props: any) => <h1 className="text-xl font-bold text-gray-900 mt-0 mb-4 border-b border-gray-200 pb-2" {...props} />,
                        h2: (props: any) => <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3" {...props} />,
                        p: (props: any) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
                        ul: (props: any) => <ul className="mb-4 list-none pl-0" {...props} />,
                        ol: (props: any) => <ol className="mb-4 list-none pl-0" {...props} />,
                        li: (props: any) => <li className="text-gray-700 leading-relaxed mb-1 flex items-start" {...props} />,
                        lic: (props: any) => (
                          <div className="flex items-start">
                            <span className="text-gray-400 mr-2 mt-1">•</span>
                            <span className="flex-1" {...props} />
                          </div>
                        ),
                        strong: (props: any) => <strong className="font-semibold text-gray-900" {...props} />,
                      }}
                    />
                </div>
              ) : (
                <div className="text-gray-500 italic">
                  Aucune description détaillée disponible.
                </div>
              )}




            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
