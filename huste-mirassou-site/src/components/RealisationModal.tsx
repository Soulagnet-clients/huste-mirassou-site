'use client';

import { useState, useEffect } from 'react';

interface RealisationGallery {
  image: string;
  caption: string;
}

interface Realisation {
  title: string;
  description: string;
  date: string;
  type: string;
  featured_image?: string;
  gallery?: RealisationGallery[];
  location?: string;
  client?: string;
  duration?: string;
  surface?: string;
}

interface RealisationModalProps {
  realisation: Realisation | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RealisationModal({ realisation, isOpen, onClose }: RealisationModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Créer un tableau d'images (featured_image + gallery)
  const allImages = realisation ? [
    ...(realisation.featured_image ? [{
      image: realisation.featured_image,
      caption: `Image principale - ${realisation.title}`
    }] : []),
    ...(realisation.gallery || [])
  ] : [];

  // Reset index when modal opens or when images change
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen, realisation]);

  // Vérifier que l'index reste valide
  useEffect(() => {
    if (allImages.length > 0 && currentImageIndex >= allImages.length) {
      setCurrentImageIndex(0);
    }
  }, [allImages.length, currentImageIndex]);

  // Gestion des touches clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (allImages.length > 0) {
            setCurrentImageIndex(prev =>
              prev > 0 ? prev - 1 : allImages.length - 1
            );
          }
          break;
        case 'ArrowRight':
          if (allImages.length > 0) {
            setCurrentImageIndex(prev =>
              prev < allImages.length - 1 ? prev + 1 : 0
            );
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, allImages.length]);

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
      <div className="relative bg-white rounded-lg max-w-6xl max-h-[90vh] w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{realisation.title}</h2>
            <p className="text-gray-600">{realisation.type} • {new Date(realisation.date).toLocaleDateString('fr-FR')}</p>
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
          <div className="lg:w-2/3 relative">
            {allImages.length > 0 && currentImage ? (
              <>
                <div className="relative h-96 lg:h-[500px] bg-gray-100">
                  <img
                    src={currentImage.image}
                    alt={currentImage.caption || 'Image du projet'}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation des images */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={() => {
                          if (allImages.length > 0) {
                            setCurrentImageIndex(prev =>
                              prev > 0 ? prev - 1 : allImages.length - 1
                            );
                          }
                        }}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => {
                          if (allImages.length > 0) {
                            setCurrentImageIndex(prev =>
                              prev < allImages.length - 1 ? prev + 1 : 0
                            );
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
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentImageIndex 
                            ? 'bg-blue-600' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Description de l'image courante */}
                {currentImage.caption && (
                  <div className="p-4 bg-gray-50 border-t">
                    <p className="text-sm text-gray-600">{currentImage.caption}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="h-96 lg:h-[500px] bg-gray-200 flex items-center justify-center">
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
          <div className="lg:w-1/3 p-6 bg-gray-50">
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Description</h3>
                <p className="text-gray-700 leading-relaxed">{realisation.description}</p>
              </div>

              {/* Détails du projet */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Détails du projet</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type :</span>
                    <span className="font-medium">{realisation.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date :</span>
                    <span className="font-medium">{new Date(realisation.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {realisation.location && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lieu :</span>
                      <span className="font-medium">{realisation.location}</span>
                    </div>
                  )}
                  {realisation.surface && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Surface :</span>
                      <span className="font-medium">{realisation.surface}</span>
                    </div>
                  )}
                  {realisation.duration && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durée :</span>
                      <span className="font-medium">{realisation.duration}</span>
                    </div>
                  )}
                  {realisation.client && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Client :</span>
                      <span className="font-medium">{realisation.client}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Compteur d'images */}
              {allImages.length > 0 && (
                <div className="text-center text-sm text-gray-500">
                  Image {currentImageIndex + 1} sur {allImages.length}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
