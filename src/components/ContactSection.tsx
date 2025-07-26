'use client';

import { useEffect, useState } from 'react';
import { client } from '../../tina/__generated__/client';

interface ContactData {
  company_name: string;
  contact: {
    phone: string;
    email: string;
    address: string;
    city: string;
    postal_code: string;
  };
  business: {
    siret: string;
    insurance: string;
    zone_intervention: string;
    horaires: {
      lundi_vendredi: string;
      samedi: string;
      dimanche: string;
    };
  };
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
}

export default function ContactSection() {
  const [contactData, setContactData] = useState<ContactData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await client.queries.config({
          relativePath: 'entreprise.json'
        });
        setContactData(result.data.config as ContactData);
      } catch (error) {
        console.error('Erreur lors du chargement des données de contact:', error);
      }
    };

    fetchData();
  }, []);
  return (
    <section id="contact" className="py-20 bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Contact & Informations
            </h2>
            <p className="text-xl text-gray-300">
              N'hésitez pas à nous contacter pour tous vos projets
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Informations de contact */}
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-semibold mb-6">
                {contactData?.company_name || 'SARL Husté-Mirassou'}
              </h3>

              <div className="space-y-6">
                {/* Téléphone */}
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-blue-400 mr-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold">Téléphone</h4>
                    <p className="text-gray-300">{contactData?.contact.phone || '06 XX XX XX XX'}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-blue-400 mr-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-gray-300">{contactData?.contact.email || 'contact@huste-mirassou.fr'}</p>
                  </div>
                </div>

                {/* Adresse */}
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-blue-400 mr-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold">Adresse</h4>
                    <p className="text-gray-300">
                      {contactData?.contact.address || 'Zone d\'intervention :\nHusté, Mirassou et environs\nLandes (40)'}
                    </p>
                  </div>
                </div>

                {/* Horaires */}
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-blue-400 mr-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold">Horaires</h4>
                    <p className="text-gray-300">
                      Lundi - Vendredi : {contactData?.business.horaires.lundi_vendredi || '8h - 18h'}<br />
                      Samedi : {contactData?.business.horaires.samedi || '8h - 12h'}<br />
                      Dimanche : {contactData?.business.horaires.dimanche || 'Fermé'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations entreprise */}
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-semibold mb-6">
                Informations Entreprise
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Spécialités</h4>
                  <ul className="text-gray-300 space-y-1">
                    <li>• Terrasses béton et pierre</li>
                    <li>• Maçonnerie traditionnelle</li>
                    <li>• Aménagements extérieurs</li>
                    <li>• Rénovation et réparation</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Garanties</h4>
                  <ul className="text-gray-300 space-y-1">
                    <li>• Garantie décennale</li>
                    <li>• Assurance responsabilité civile</li>
                    <li>• Devis gratuit</li>
                    <li>• Conseils personnalisés</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Zone d'intervention</h4>
                  <p className="text-gray-300">
                    Nous intervenons principalement dans les Landes (40), 
                    autour de Husté et Mirassou, dans un rayon de 30 km.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="lg:col-span-1">
              <div className="bg-blue-600 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4">
                  Prêt à démarrer ?
                </h3>
                <p className="mb-6">
                  Contactez-nous dès maintenant pour discuter de votre projet 
                  et obtenir un devis personnalisé.
                </p>
                
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      const element = document.getElementById('devis');
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Demander un devis
                  </button>
                  
                  <a
                    href="tel:06XXXXXXXX"
                    className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors block text-center"
                  >
                    📞 Appeler maintenant
                  </a>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="mt-8">
                <h4 className="font-semibold mb-4">Suivez-nous</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-700 mt-16 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SARL Husté-Mirassou. Tous droits réservés.</p>
            <p className="mt-2">SIRET : XXX XXX XXX XXXXX - Assurance décennale</p>
          </div>
        </div>
      </div>
    </section>
  );
}
