// Client TinaCMS avec données statiques pour la production
import { createClient } from "tinacms/dist/client";
import { queries } from "./types";

// Données statiques pour la production
const staticData = {
  realisationConnection: {
    edges: [
      {
        node: {
          id: "terrasse-beton-desactive-mirassou",
          title: "Terrasse béton désactivé - Mirassou",
          excerpt: "Création d'une terrasse en béton désactivé de 40m² avec finition pierre naturelle.",
          featured_image: "/images/terrasse-beton-desactive-1.jpg",
          date: "2024-03-15",
          lieu: "Mirassou",
          categorie: { value: "terrasse", label: "Terrasse" },
          published: true,
          _sys: { filename: "terrasse-beton-desactive-mirassou.mdx" }
        }
      },
      {
        node: {
          id: "muret-soutenement-huste",
          title: "Muret de soutènement - Husté",
          excerpt: "Construction d'un muret de soutènement en pierre naturelle de 25m linéaires.",
          featured_image: "/images/muret-soutenement-1.jpg",
          date: "2024-02-20",
          lieu: "Husté",
          categorie: { value: "maconnerie", label: "Maçonnerie" },
          published: true,
          _sys: { filename: "muret-soutenement-huste.mdx" }
        }
      },
      {
        node: {
          id: "terrassement",
          title: "Terrassement et préparation terrain",
          excerpt: "Terrassement complet pour préparation d'une construction neuve.",
          featured_image: "/images/terrassement-1.jpg",
          date: "2024-01-10",
          lieu: "Landes",
          categorie: { value: "terrassement", label: "Terrassement" },
          published: true,
          _sys: { filename: "terrassement-.mdx" }
        }
      }
    ]
  },
  serviceConnection: {
    edges: [
      {
        node: {
          id: "terrasses",
          title: "Terrasses",
          excerpt: "Création de terrasses en béton, pierre naturelle ou composite. Étanchéité et finitions soignées.",
          icon: null,
          price_range: "À partir de 80€/m²",
          duration: "2-5 jours selon surface",
          features: [
            { feature: "Béton désactivé" },
            { feature: "Pierre naturelle" },
            { feature: "Carrelage" },
            { feature: "Étanchéité" }
          ],
          featured: true,
          published: true,
          _sys: { filename: "terrasses.mdx" }
        }
      },
      {
        node: {
          id: "maconnerie",
          title: "Maçonnerie",
          excerpt: "Murets, murs de soutènement, fondations. Travaux de maçonnerie traditionnelle et moderne.",
          icon: null,
          price_range: "Sur devis",
          duration: "Variable selon projet",
          features: [
            { feature: "Murets" },
            { feature: "Murs de soutènement" },
            { feature: "Fondations" },
            { feature: "Réparations" }
          ],
          featured: true,
          published: true,
          _sys: { filename: "maconnerie.mdx" }
        }
      },
      {
        node: {
          id: "amenagements-exterieurs",
          title: "Aménagements extérieurs",
          excerpt: "Conception et réalisation d'espaces extérieurs personnalisés : allées, escaliers, clôtures.",
          icon: null,
          price_range: "À partir de 50€/m²",
          duration: "1-3 semaines",
          features: [
            { feature: "Allées" },
            { feature: "Escaliers" },
            { feature: "Clôtures" },
            { feature: "Drainage" }
          ],
          featured: true,
          published: true,
          _sys: { filename: "amenagements-exterieurs.mdx" }
        }
      }
    ]
  },
  categorieConnection: {
    edges: [
      {
        node: {
          id: "terrasse",
          label: "Terrasse",
          value: "terrasse",
          description: "Création et rénovation de terrasses",
          _sys: { filename: "terrasse.md" }
        }
      },
      {
        node: {
          id: "maconnerie",
          label: "Maçonnerie",
          value: "maconnerie",
          description: "Travaux de maçonnerie traditionnelle",
          _sys: { filename: "maconnerie.md" }
        }
      },
      {
        node: {
          id: "amenagement",
          label: "Aménagement extérieur",
          value: "amenagement",
          description: "Aménagements d'espaces extérieurs",
          _sys: { filename: "amenagement.md" }
        }
      },
      {
        node: {
          id: "terrassement",
          label: "Terrassement",
          value: "terrassement",
          description: "Travaux de terrassement et préparation",
          _sys: { filename: "terrassement.md" }
        }
      }
    ]
  }
};

// Client mock pour la production
const mockClient = {
  queries: {
    realisationConnection: async () => ({
      data: { realisationConnection: staticData.realisationConnection }
    }),

    realisation: async (variables: any) => {
      const filename = variables.relativePath;
      const realisation = staticData.realisationConnection.edges
        .find(edge => edge.node._sys.filename === filename)?.node;

      return {
        data: {
          realisation: realisation ? {
            ...realisation,
            body: "Contenu détaillé de la réalisation...",
            gallery: []
          } : null
        }
      };
    },

    serviceConnection: async () => ({
      data: { serviceConnection: staticData.serviceConnection }
    }),

    categorieConnection: async () => ({
      data: { categorieConnection: staticData.categorieConnection }
    }),

    config: async () => ({
      data: {
        config: {
          company_name: "SARL Husté-Mirassou",
          tagline: "Maçonnerie et aménagements extérieurs",
          phone: "06 XX XX XX XX",
          email: "contact@huste-mirassou.fr",
          address: "Husté, Mirassou et environs - Landes (40)",
          description: "Spécialiste en maçonnerie et aménagements extérieurs dans les Landes"
        }
      }
    })
  }
};

// Utiliser le client mock en production, le vrai client en développement
export const client = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? createClient({ url: 'http://localhost:4001/graphql', token: 'undefined', queries })
  : mockClient;

export default client;
  