import { defineConfig } from "tinacms";

// Configuration de la branche Git
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Pas de configuration d'authentification pour le développement local
  // TinaCMS fonctionne en mode local sans token

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },

  // Schéma de contenu
  schema: {
    collections: [
      // Collection pour les réalisations
      {
        name: "realisation",
        label: "Réalisations",
        path: "content/realisations",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Titre du projet",
            isTitle: true,
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Date de réalisation",
            required: true,
          },
          {
            type: "string",
            name: "type",
            label: "Type de projet",
            options: [
              { value: "terrasse", label: "Terrasse" },
              { value: "maconnerie", label: "Maçonnerie" },
              { value: "amenagement", label: "Aménagement extérieur" },
              { value: "renovation", label: "Rénovation" },
              { value: "autre", label: "Autre" },
            ],
            required: true,
          },
          {
            type: "string",
            name: "lieu",
            label: "Lieu (ville)",
          },
          {
            type: "string",
            name: "client",
            label: "Client (optionnel)",
          },
          {
            type: "string",
            name: "excerpt",
            label: "Description courte",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "featured_image",
            label: "Image principale",
          },
          {
            type: "string",
            name: "location",
            label: "Lieu du projet",
          },
          {
            type: "string",
            name: "surface",
            label: "Surface (ex: 50m²)",
          },
          {
            type: "string",
            name: "duration",
            label: "Durée des travaux",
          },
          {
            type: "object",
            name: "gallery",
            label: "Galerie d'images",
            list: true,
            fields: [
              {
                type: "image",
                name: "image",
                label: "Image",
              },
              {
                type: "string",
                name: "caption",
                label: "Légende",
              },
            ],
          },
          {
            type: "boolean",
            name: "featured",
            label: "Projet mis en avant",
          },
          {
            type: "boolean",
            name: "published",
            label: "Publié",
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Description détaillée",
            isBody: true,
          },
        ],
        ui: {
          router: ({ document }) => `/realisations/${document._sys.filename}`,
        },
      },

      // Collection pour les services
      {
        name: "service",
        label: "Services",
        path: "content/services",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Nom du service",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "category",
            label: "Catégorie",
            options: [
              { value: "maconnerie", label: "Maçonnerie" },
              { value: "terrasse", label: "Terrasses" },
              { value: "amenagement", label: "Aménagements extérieurs" },
              { value: "renovation", label: "Rénovation" },
              { value: "autre", label: "Autre" },
            ],
            required: true,
          },
          {
            type: "string",
            name: "excerpt",
            label: "Description courte",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "icon",
            label: "Icône/Image du service",
          },
          {
            type: "string",
            name: "price_range",
            label: "Fourchette de prix",
            description: "Ex: À partir de 50€/m²",
          },
          {
            type: "string",
            name: "duration",
            label: "Durée indicative",
            description: "Ex: 2-3 jours",
          },
          {
            type: "object",
            name: "features",
            label: "Caractéristiques",
            list: true,
            fields: [
              {
                type: "string",
                name: "feature",
                label: "Caractéristique",
              },
            ],
          },
          {
            type: "boolean",
            name: "featured",
            label: "Service mis en avant",
          },
          {
            type: "boolean",
            name: "published",
            label: "Publié",
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Description détaillée",
            isBody: true,
          },
        ],
        ui: {
          router: ({ document }) => `/services/${document._sys.filename}`,
        },
      },


      // Configuration de l'entreprise
      {
        name: "config",
        label: "Configuration Entreprise",
        path: "content/config",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "string",
            name: "company_name",
            label: "Nom de l'entreprise",
            required: true,
          },
          {
            type: "string",
            name: "tagline",
            label: "Slogan",
          },
          {
            type: "string",
            name: "description",
            label: "Description de l'entreprise",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "hero_image",
            label: "Image de fond page d'accueil",
            description: "Image qui s'affiche en arrière-plan de la page d'accueil",
          },
          {
            type: "object",
            name: "contact",
            label: "Informations de contact",
            fields: [
              {
                type: "string",
                name: "phone",
                label: "Téléphone",
                required: true,
              },
              {
                type: "string",
                name: "email",
                label: "Email",
                required: true,
              },
              {
                type: "string",
                name: "address",
                label: "Adresse complète",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                name: "city",
                label: "Ville",
              },
              {
                type: "string",
                name: "postal_code",
                label: "Code postal",
              },
            ],
          },
          {
            type: "object",
            name: "business",
            label: "Informations métier",
            fields: [
              {
                type: "string",
                name: "siret",
                label: "SIRET",
              },
              {
                type: "string",
                name: "insurance",
                label: "Assurance",
              },
              {
                type: "string",
                name: "zone_intervention",
                label: "Zone d'intervention",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "object",
                name: "horaires",
                label: "Horaires d'ouverture",
                fields: [
                  {
                    type: "string",
                    name: "lundi_vendredi",
                    label: "Lundi - Vendredi",
                  },
                  {
                    type: "string",
                    name: "samedi",
                    label: "Samedi",
                  },
                  {
                    type: "string",
                    name: "dimanche",
                    label: "Dimanche",
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "social",
            label: "Réseaux sociaux",
            fields: [
              {
                type: "string",
                name: "facebook",
                label: "Facebook",
              },
              {
                type: "string",
                name: "instagram",
                label: "Instagram",
              },
              {
                type: "string",
                name: "linkedin",
                label: "LinkedIn",
              },
            ],
          },
        ],
      },
    ],
  },
});
