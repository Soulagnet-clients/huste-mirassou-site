// Types partagés pour l'application

export interface RealisationGallery {
  image: string;
  caption: string;
}

export interface Realisation {
  title: string;
  description?: string; // Description longue (optionnelle)
  excerpt?: string; // Description courte TinaCMS
  body?: any; // Contenu rich-text de TinaCMS
  date: string;
  type?: string | { value: string; label: string; }; // Ancien format
  categorie?: string | { value: string; label: string; }; // Nouveau format
  featured_image?: string;
  gallery?: RealisationGallery[];
  location?: string;
  lieu?: string; // Champ TinaCMS
  client?: string;
  duration?: string;
  surface?: string;
  _sys?: {
    filename: string;
  };
}

export interface Category {
  id: string;
  label: string;
  value?: string;
}
