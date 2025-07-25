// tina/config.ts
import { defineConfig } from "tinacms";

// tina/utils/console-fix.ts
var originalWarn;
var originalError;
var suppressReactWarnings = () => {
  if (!originalWarn) {
    originalWarn = console.warn;
    originalError = console.error;
  }
  const warningsToSuppress = [
    "React does not recognize the `setOption` prop",
    "React does not recognize the `setOptions` prop",
    "React does not recognize the `getOption` prop",
    "React does not recognize the `getOptions` prop",
    "Warning: React does not recognize the",
    "setOption",
    "setOptions",
    "getOption",
    "getOptions",
    "Support for defaultProps will be removed",
    "defaultProps",
    "Connect(Droppable)",
    "memo components"
  ];
  const shouldSuppress = (message) => {
    return warningsToSuppress.some(
      (warning) => message.toLowerCase().includes(warning.toLowerCase())
    );
  };
  console.warn = (...args) => {
    const message = args.join(" ");
    if (!shouldSuppress(message)) {
      originalWarn.apply(console, args);
    }
  };
  console.error = (...args) => {
    const message = args.join(" ");
    if (!shouldSuppress(message)) {
      originalError.apply(console, args);
    }
  };
};
var applyGlobalConsoleFix = () => {
  suppressReactWarnings();
  setTimeout(() => {
    suppressReactWarnings();
  }, 100);
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", suppressReactWarnings);
    } else {
      suppressReactWarnings();
    }
  }
};

// tina/init.ts
if (typeof window !== "undefined") {
  applyGlobalConsoleFix();
  if (true) {
    console.log("\u{1F527} TinaCMS: Correctifs console appliqu\xE9s");
  }
}

// tina/config.ts
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";
var config_default = defineConfig({
  branch,
  // Pas de configuration d'authentification pour le développement local
  // TinaCMS fonctionne en mode local sans token
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public"
    }
  },
  // Schéma de contenu
  schema: {
    collections: [
      {
        name: "categorie",
        // identifiant interne (singulier)
        label: "Cat\xE9gories",
        // texte affiché dans Tina
        path: "content/categories",
        // où seront créés les fichiers (ex : my‑category.mdx)
        format: "md",
        // ou "json" si tu préfères
        fields: [
          {
            type: "string",
            name: "label",
            label: "Nom affich\xE9",
            description: "Nom qui s'affiche dans l'interface",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "value",
            label: "ID de la cat\xE9gorie (technique)",
            description: "Identifiant unique en minuscules, sans espaces (ex: terrasse, maconnerie)",
            required: true
          },
          {
            type: "string",
            name: "title",
            label: "Titre (optionnel)",
            description: "Titre pour la page de la cat\xE9gorie",
            required: false
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            description: "Description de la cat\xE9gorie de projet",
            ui: {
              component: "textarea"
            }
          }
        ]
      },
      // Collection pour les réalisations
      {
        name: "realisation",
        label: "R\xE9alisations",
        path: "content/realisations",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Titre du projet",
            isTitle: true,
            required: true
          },
          {
            type: "datetime",
            name: "date",
            label: "Date de r\xE9alisation",
            required: true
          },
          {
            type: "reference",
            name: "categorie",
            // ou "categories" + list:true si multi
            label: "Cat\xE9gorie",
            collections: ["categorie"],
            list: false,
            // true ➜ plusieurs catégories possibles
            required: false,
            ui: {
              optionComponent: (props) => {
                return props.label || props.title || "Cat\xE9gorie";
              }
            }
          },
          {
            type: "string",
            name: "lieu",
            label: "Lieu (ville)"
          },
          {
            type: "string",
            name: "client",
            label: "Client (optionnel)"
          },
          {
            type: "string",
            name: "excerpt",
            label: "Description courte",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "image",
            name: "featured_image",
            label: "Image principale"
          },
          {
            type: "string",
            name: "location",
            label: "Lieu du projet"
          },
          {
            type: "string",
            name: "surface",
            label: "Surface (ex: 50m\xB2)"
          },
          {
            type: "string",
            name: "duration",
            label: "Dur\xE9e des travaux"
          },
          {
            type: "object",
            name: "gallery",
            label: "Galerie d'images",
            list: true,
            ui: {
              itemProps: (item) => {
                const imageName = item?.image ? item.image.split("/").pop() : "Nouvelle image";
                const caption = item?.caption ? ` - ${item.caption}` : "";
                return {
                  label: `\u{1F5BC}\uFE0F ${imageName}${caption}`
                };
              },
              defaultItem: {
                image: "",
                caption: ""
              }
            },
            fields: [
              {
                type: "image",
                name: "image",
                label: "Image"
              },
              {
                type: "string",
                name: "caption",
                label: "L\xE9gende (optionnelle)",
                ui: {
                  component: "textarea"
                }
              }
            ]
          },
          {
            type: "boolean",
            name: "featured",
            label: "Projet mis en avant"
          },
          {
            type: "boolean",
            name: "published",
            label: "Publi\xE9",
            required: true
          },
          {
            type: "rich-text",
            name: "body",
            label: "Description d\xE9taill\xE9e",
            isBody: true
          }
        ]
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
            required: true
          },
          {
            type: "string",
            name: "excerpt",
            label: "Description courte",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "image",
            name: "icon",
            label: "Ic\xF4ne/Image du service"
          },
          {
            type: "string",
            name: "price_range",
            label: "Fourchette de prix",
            description: "Ex: \xC0 partir de 50\u20AC/m\xB2"
          },
          {
            type: "string",
            name: "duration",
            label: "Dur\xE9e indicative",
            description: "Ex: 2-3 jours"
          },
          {
            type: "object",
            name: "features",
            label: "Caract\xE9ristiques",
            list: true,
            fields: [
              {
                type: "string",
                name: "feature",
                label: "Caract\xE9ristique"
              }
            ]
          },
          {
            type: "boolean",
            name: "featured",
            label: "Service mis en avant"
          },
          {
            type: "boolean",
            name: "published",
            label: "Publi\xE9",
            required: true
          },
          {
            type: "rich-text",
            name: "body",
            label: "Description d\xE9taill\xE9e",
            isBody: true
          }
        ]
      },
      // Configuration de l'entreprise
      {
        name: "config",
        label: "Configuration Entreprise",
        path: "content/config",
        format: "json",
        match: {
          include: "entreprise"
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: "string",
            name: "company_name",
            label: "Nom de l'entreprise",
            required: true
          },
          {
            type: "string",
            name: "tagline",
            label: "Slogan"
          },
          {
            type: "string",
            name: "description",
            label: "Description de l'entreprise",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "image",
            name: "hero_image",
            label: "Image de fond page d'accueil",
            description: "Image qui s'affiche en arri\xE8re-plan de la page d'accueil"
          },
          {
            type: "object",
            name: "contact",
            label: "Informations de contact",
            fields: [
              {
                type: "string",
                name: "phone",
                label: "T\xE9l\xE9phone",
                required: true
              },
              {
                type: "string",
                name: "email",
                label: "Email",
                required: true
              },
              {
                type: "string",
                name: "address",
                label: "Adresse compl\xE8te",
                ui: {
                  component: "textarea"
                }
              },
              {
                type: "string",
                name: "city",
                label: "Ville"
              },
              {
                type: "string",
                name: "postal_code",
                label: "Code postal"
              }
            ]
          },
          {
            type: "object",
            name: "business",
            label: "Informations m\xE9tier",
            fields: [
              {
                type: "string",
                name: "siret",
                label: "SIRET"
              },
              {
                type: "string",
                name: "insurance",
                label: "Assurance"
              },
              {
                type: "string",
                name: "zone_intervention",
                label: "Zone d'intervention",
                ui: {
                  component: "textarea"
                }
              },
              {
                type: "object",
                name: "horaires",
                label: "Horaires d'ouverture",
                fields: [
                  {
                    type: "string",
                    name: "lundi_vendredi",
                    label: "Lundi - Vendredi"
                  },
                  {
                    type: "string",
                    name: "samedi",
                    label: "Samedi"
                  },
                  {
                    type: "string",
                    name: "dimanche",
                    label: "Dimanche"
                  }
                ]
              }
            ]
          },
          {
            type: "object",
            name: "social",
            label: "R\xE9seaux sociaux",
            fields: [
              {
                type: "string",
                name: "facebook",
                label: "Facebook"
              },
              {
                type: "string",
                name: "instagram",
                label: "Instagram"
              },
              {
                type: "string",
                name: "linkedin",
                label: "LinkedIn"
              }
            ]
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
