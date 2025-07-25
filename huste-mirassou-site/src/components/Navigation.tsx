'use client';

import { useState } from 'react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-800">
              SARL Husté-Mirassou
            </span>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection('accueil')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Accueil
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('realisations')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Réalisations
            </button>
            <button
              onClick={() => scrollToSection('devis')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Devis
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Bouton CTA */}
          <div className="hidden md:block">
            <button
              onClick={() => scrollToSection('devis')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Devis Gratuit
            </button>
          </div>

          {/* Menu Mobile */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Menu Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => scrollToSection('accueil')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600"
              >
                Accueil
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('realisations')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600"
              >
                Réalisations
              </button>
              <button
                onClick={() => scrollToSection('devis')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600"
              >
                Devis
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600"
              >
                Contact
              </button>
              <button
                onClick={() => scrollToSection('devis')}
                className="block w-full text-left px-3 py-2 bg-blue-600 text-white rounded-lg mt-2"
              >
                Devis Gratuit
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
