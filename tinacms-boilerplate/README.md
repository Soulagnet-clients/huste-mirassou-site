# 🚀 TinaCMS Boilerplate

Boilerplate Next.js + TinaCMS prêt à l'emploi pour créer des sites web modernes avec un système de gestion de contenu intégré.

## ✨ Fonctionnalités

- **Next.js 14** avec App Router
- **TinaCMS** pour l'édition de contenu
- **TypeScript** pour la sécurité du code
- **Tailwind CSS** pour le styling
- **Configuration Git** intégrée
- **Déploiement facile** sur Vercel/Netlify

## 🛠️ Installation

```bash
# Cloner le projet
git clone <votre-repo>
cd tinacms-boilerplate

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## 📝 Utilisation

### Développement local

```bash
# Serveur Next.js simple
npm run dev

# Serveur avec TinaCMS activé
npm run tina:dev
```

### Interface d'administration

Accédez à l'interface TinaCMS sur : `http://localhost:3000/admin`

### Structure du contenu

```
content/
├── config/          # Configuration du site
│   └── site.json
├── pages/           # Pages statiques
│   └── about.mdx
└── posts/           # Articles/Blog
    └── premier-article.mdx
```

## 🎨 Personnalisation

### Modifier les collections TinaCMS

Éditez `tina/config.ts` pour :
- Ajouter de nouveaux types de contenu
- Modifier les champs existants
- Configurer les routes

### Styling

Le projet utilise Tailwind CSS. Modifiez :
- `tailwind.config.js` pour les couleurs et thèmes
- `src/app/globals.css` pour les styles globaux

## 🚀 Déploiement

### Vercel (recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

### Netlify

1. Connectez votre repo GitHub
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Variables d'environnement

Pour la production, configurez :

```env
NEXT_PUBLIC_TINA_CLIENT_ID=your_client_id
TINA_TOKEN=your_token
GITHUB_BRANCH=main
```

## 📚 Documentation

- [TinaCMS Documentation](https://tina.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.

---

**Créé avec ❤️ pour simplifier la création de sites web modernes.**
