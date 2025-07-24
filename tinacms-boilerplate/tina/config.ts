import { defineConfig } from "tinacms";

// Configuration de la branche Git
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Configuration pour le développement local
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,

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
      // Collection pour les pages
      {
        name: "page",
        label: "Pages",
        path: "content/pages",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Titre",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Contenu",
            isBody: true,
          },
        ],
        ui: {
          router: ({ document }) => `/${document._sys.filename}`,
        },
      },
      
      // Collection pour les articles/posts
      {
        name: "post",
        label: "Articles",
        path: "content/posts",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Titre",
            isTitle: true,
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true,
          },
          {
            type: "string",
            name: "excerpt",
            label: "Résumé",
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
            name: "category",
            label: "Catégorie",
            options: [
              { value: "actualites", label: "Actualités" },
              { value: "projets", label: "Projets" },
              { value: "services", label: "Services" },
            ],
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
            label: "Contenu",
            isBody: true,
          },
        ],
        ui: {
          router: ({ document }) => `/blog/${document._sys.filename}`,
        },
      },
      
      // Collection pour la configuration du site
      {
        name: "config",
        label: "Configuration",
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
            name: "site_title",
            label: "Titre du site",
            required: true,
          },
          {
            type: "string",
            name: "site_description",
            label: "Description du site",
            ui: {
              component: "textarea",
            },
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
              },
              {
                type: "string",
                name: "email",
                label: "Email",
              },
              {
                type: "string",
                name: "address",
                label: "Adresse",
                ui: {
                  component: "textarea",
                },
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
