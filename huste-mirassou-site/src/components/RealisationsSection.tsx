'use client';

import { useState, useEffect } from 'react';
import { client } from '../../tina/__generated__/client';
import RealisationModal from './RealisationModal';

interface Realisation {
  title: string;
  type: string;
  lieu: string;
  excerpt: string;
  featured_image?: string;
  date: string;
  _sys: {
    filename: string;
  };
}

export default function RealisationsSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [realisations, setRealisations] = useState<Realisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRealisation, setSelectedRealisation] = useState<Realisation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (realisation: Realisation) => {
    setSelectedRealisation(realisation);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRealisation(null);
  };

  useEffect(() => {
    const fetchRealisations = async () => {
      try {
        const result = await client.queries.realisationConnection();
        const realisationsData = result.data.realisationConnection.edges?.map(edge => edge?.node) || [];
        setRealisations(realisationsData.filter(realisation => realisation?.published) as Realisation[]);
      } catch (error) {
        console.error('Erreur lors du chargement des réalisations:', error);
        // Données par défaut en cas d'erreur
        setRealisations([
          {
            title: "Terrasse en béton désactivé",
            type: "terrasse",
            lieu: "Mirassou",
            excerpt: "Création d'une terrasse de 40m² en béton désactivé avec finition soignée.",
            date: "2024-01-15T10:00:00.000Z",
            _sys: { filename: "terrasse-mirassou" }
          },
          {
            title: "Muret de soutènement",
            type: "maconnerie",
            lieu: "Husté",
            excerpt: "Construction d'un muret de soutènement en pierre naturelle.",
            date: "2024-02-10T14:00:00.000Z",
            _sys: { filename: "muret-huste" }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRealisations();
  }, []);

  const categories = [
    { id: 'all', label: 'Tous' },
    { id: 'terrasse', label: 'Terrasses' },
    { id: 'maconnerie', label: 'Maçonnerie' },
    { id: 'amenagement', label: 'Aménagements' },
    { id: 'renovation', label: 'Rénovation' }
  ];

  const filteredRealisations = selectedCategory === 'all'
    ? realisations
    : realisations.filter(r => r.type === selectedCategory);

  return (
    <section id="realisations" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Nos Réalisations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez quelques-unes de nos réalisations récentes. 
            Chaque projet est unique et réalisé avec le plus grand soin.
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Grille des réalisations */}
        {loading ? (
          <div className="text-center">
            <p className="text-gray-600">Chargement des réalisations...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRealisations.map((realisation, index) => (
              <div
                key={realisation._sys.filename}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => openModal(realisation)}
              >
                {/* Image */}
                <div className="h-48 bg-gray-300 flex items-center justify-center">
                  {realisation.featured_image ? (
                    <img
                      src={realisation.featured_image}
                      alt={realisation.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm">Photo à ajouter</p>
                    </div>
                  )}
                </div>

                {/* Contenu */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {realisation.title}
                  </h3>
                  <p className="text-blue-600 text-sm mb-3">
                    📍 {realisation.lieu}
                  </p>
                  <p className="text-gray-600 mb-4">
                    {realisation.excerpt}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">
                      {new Date(realisation.date).toLocaleDateString('fr-FR')}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Empêcher la propagation vers la carte
                        openModal(realisation);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Voir plus →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Vous avez un projet similaire ? Parlons-en !
          </p>
          <button
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Nous contacter
          </button>
        </div>
      </div>

      {/* Modal de galerie */}
      <RealisationModal
        realisation={selectedRealisation}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
}
