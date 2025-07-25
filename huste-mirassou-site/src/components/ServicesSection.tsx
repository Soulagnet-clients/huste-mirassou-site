'use client';

import { useEffect, useState } from 'react';
import { client } from '../../tina/__generated__/client';

interface Service {
  title: string;
  excerpt: string;
  category: string;
  features: { feature: string }[];
  price_range?: string;
}

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const result = await client.queries.serviceConnection();
        const servicesData = result.data.serviceConnection.edges?.map(edge => edge?.node) || [];
        setServices(servicesData.filter(service => service?.published) as Service[]);
      } catch (error) {
        console.error('Erreur lors du chargement des services:', error);
        // Services par défaut en cas d'erreur
        setServices([
          {
            title: "Terrasses",
            excerpt: "Création de terrasses en béton, pierre naturelle ou composite. Étanchéité et finitions soignées.",
            category: "terrasse",
            features: [
              { feature: "Béton désactivé" },
              { feature: "Pierre naturelle" },
              { feature: "Carrelage" },
              { feature: "Étanchéité" }
            ]
          },
          {
            title: "Maçonnerie",
            excerpt: "Murets, murs de soutènement, fondations. Travaux de maçonnerie traditionnelle et moderne.",
            category: "maconnerie",
            features: [
              { feature: "Murets" },
              { feature: "Murs de soutènement" },
              { feature: "Fondations" },
              { feature: "Réparations" }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'terrasse': return '🏗️';
      case 'maconnerie': return '🧱';
      case 'amenagement': return '🌿';
      case 'renovation': return '🔧';
      default: return '🏠';
    }
  };

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Nos Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nous vous accompagnons dans tous vos projets d'aménagements extérieurs, 
            de la conception à la réalisation, avec un savoir-faire reconnu.
          </p>
        </div>

        {/* Grille des services */}
        {loading ? (
          <div className="text-center">
            <p className="text-gray-600">Chargement des services...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                {/* Icône */}
                <div className="text-4xl mb-4 text-center">
                  {getCategoryIcon(service.category)}
                </div>

                {/* Titre */}
                <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4 text-center">
                  {service.excerpt}
                </p>

                {/* Prix indicatif */}
                {service.price_range && (
                  <p className="text-blue-600 text-sm text-center mb-4 font-medium">
                    {service.price_range}
                  </p>
                )}

                {/* Caractéristiques */}
                <ul className="space-y-2">
                  {service.features?.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                      <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature.feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Call to action */}
        <div className="text-center mt-12">
          <button
            onClick={() => {
              const element = document.getElementById('devis');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Demander un devis
          </button>
        </div>
      </div>
    </section>
  );
}
