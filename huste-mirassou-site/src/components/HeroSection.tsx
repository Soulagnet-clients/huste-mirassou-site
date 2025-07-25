'use client';

import { useEffect, useState } from 'react';
import { client } from '../../tina/__generated__/client';

interface CompanyData {
  company_name: string;
  tagline: string;
  description: string;
  hero_image?: string;
}

export default function HeroSection() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await client.queries.config({
          relativePath: 'entreprise.json'
        });

        if (result.data && result.data.config) {
          setCompanyData(result.data.config as CompanyData);
        } else {
          throw new Error('Données non trouvées');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // Données par défaut en cas d'erreur
        setCompanyData({
          company_name: 'SARL Husté-Mirassou',
          tagline: 'Spécialiste en maçonnerie et aménagements extérieurs',
          description: 'Terrasses, murets, allées... Nous donnons vie à vos projets extérieurs avec expertise et passion',
          hero_image: '/uploads/hero-background.jpg'
        });
      }
    };

    fetchData();
  }, []);
  return (
    <section id="accueil" className="relative h-screen flex items-center justify-center">
      {/* Image de fond */}
      <div className="absolute inset-0 z-0">
        {companyData?.hero_image ? (
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${companyData.hero_image})` }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-600">
            {/* Placeholder pour l'image */}
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <svg className="w-24 h-24 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4h16v12H4V4zm2 2v8h12V6H6zm2 2h8v4H8V8z" />
                </svg>
                <p className="text-sm">Image de chantier à ajouter</p>
              </div>
            </div>
          </div>
        )}
        {/* Overlay sombre pour la lisibilité du texte */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Contenu */}
      <div className="relative z-10 text-center text-white px-4">
        {companyData ? (
          <>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {companyData.company_name}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {companyData.tagline}
            </p>
            <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto opacity-90">
              {companyData.description}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              SARL Husté-Mirassou
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Chargement...
            </p>
          </>
        )}
        
        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              const element = document.getElementById('realisations');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Voir nos réalisations
          </button>
          <button
            onClick={() => {
              const element = document.getElementById('devis');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-800 transition-colors"
          >
            Devis gratuit
          </button>
        </div>
      </div>

      {/* Flèche vers le bas */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <button
          onClick={() => {
            const element = document.getElementById('services');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-white hover:text-blue-300 transition-colors animate-bounce"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </section>
  );
}
