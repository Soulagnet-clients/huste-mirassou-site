'use client';

import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import RealisationsSection from '../components/RealisationsSection';
import DevisSection from '../components/DevisSection';
import ContactSection from '../components/ContactSection';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section - Image plein cadre */}
      <HeroSection />

      {/* Services */}
      <ServicesSection />

      {/* Réalisations */}
      <RealisationsSection />

      {/* Demande de devis */}
      <DevisSection />

      {/* Contact et infos */}
      <ContactSection />
    </main>
  );
}
