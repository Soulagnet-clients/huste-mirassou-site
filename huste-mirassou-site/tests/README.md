# 🧪 Tests Playwright - Site Husté-Mirassou

Suite de tests automatisés complète pour auditer toutes les fonctionnalités du site web.

## 📋 Structure des tests

### **01 - Structure et Navigation** (`01-structure-navigation.spec.ts`)
- ✅ Chargement de la page d'accueil
- ✅ Navigation fixe et responsive
- ✅ Smooth scroll entre sections
- ✅ Boutons CTA fonctionnels
- ✅ Hero Section complète
- ✅ Structure HTML sémantique
- ✅ Performance de chargement

### **02 - Contenu et TinaCMS** (`02-contenu-tinacms.spec.ts`)
- ✅ Chargement des données entreprise
- ✅ Services depuis TinaCMS (4 services)
- ✅ Réalisations avec filtres
- ✅ Informations de contact
- ✅ Gestion des erreurs de connexion
- ✅ Performance de l'API
- ✅ Cohérence des données

### **03 - Interactions Utilisateur** (`03-interactions-utilisateur.spec.ts`)
- ✅ Formulaire de devis complet
- ✅ Validation des champs requis
- ✅ Boutons CTA et navigation
- ✅ Liens téléphone/email
- ✅ Menu mobile responsive
- ✅ Filtres des réalisations
- ✅ Accessibilité clavier
- ✅ Gestion des erreurs JS

### **04 - Performance et Accessibilité** (`04-performance-accessibilite.spec.ts`)
- ✅ Temps de chargement (< 5s)
- ✅ First Contentful Paint (< 3s)
- ✅ Largest Contentful Paint (< 4s)
- ✅ Structure des titres (H1, H2...)
- ✅ Attributs alt des images
- ✅ Contraste des couleurs
- ✅ Navigation au clavier
- ✅ Labels des formulaires
- ✅ Métadonnées SEO
- ✅ Core Web Vitals

### **05 - Intégration TinaCMS** (`05-integration-tinacms.spec.ts`)
- ✅ Interface d'administration accessible
- ✅ Collections configurées
- ✅ API GraphQL fonctionnelle
- ✅ Synchronisation frontend/backend
- ✅ Gestion des erreurs de connexion
- ✅ Performance de l'API
- ✅ Validation du schéma
- ✅ Persistance des données

### **Audit Complet** (`audit-complet.spec.ts`)
- 🎯 Test global de toutes les fonctionnalités
- 📊 Rapport détaillé avec scores
- 🎉 Validation finale du site

## 🚀 Commandes de test

### **Tests complets**
```bash
# Tous les tests
npm run test

# Tests avec interface graphique
npm run test:ui

# Tests en mode visible (navigateur ouvert)
npm run test:headed
```

### **Tests spécifiques**
```bash
# Audit complet avec rapport
npm run test:audit

# Structure et navigation
npm run test:structure

# Contenu TinaCMS
npm run test:contenu

# Interactions utilisateur
npm run test:interactions

# Performance et accessibilité
npm run test:performance

# Intégration TinaCMS
npm run test:tinacms
```

### **Rapports**
```bash
# Afficher le rapport HTML
npm run test:report
```

## 📊 Critères de validation

### **Performance**
- ⏱️ Chargement initial < 5 secondes
- 🎨 First Contentful Paint < 3 secondes
- 📏 Largest Contentful Paint < 4 secondes
- 📱 Responsive sur mobile et desktop

### **Accessibilité**
- 🏷️ Un seul H1 par page
- 🖼️ Images avec attributs alt
- ⌨️ Navigation au clavier
- 🎯 Labels de formulaires
- 📝 Métadonnées SEO complètes

### **Fonctionnalités**
- 🧭 Navigation smooth scroll
- 📝 Formulaire de devis fonctionnel
- 🔄 Filtres des réalisations
- 📱 Menu mobile responsive
- 🔗 Liens téléphone/email

### **TinaCMS**
- 🔌 API GraphQL accessible
- 📊 4 services chargés
- 🏗️ 2+ réalisations affichées
- ⚙️ Configuration entreprise
- 🔄 Synchronisation temps réel

## 🎯 Score d'audit

Le site doit obtenir **minimum 60%** pour passer l'audit :
- **80%+** : Excellent ✨
- **60-79%** : Bien ⚠️
- **<60%** : Corrections nécessaires ❌

## 🔧 Configuration

### **Navigateurs testés**
- Chrome Desktop
- Firefox Desktop  
- Safari Desktop
- Chrome Mobile (Pixel 5)
- Safari Mobile (iPhone 12)

### **Environnement**
- URL de base : `http://localhost:3000`
- API TinaCMS : `http://localhost:4001/graphql`
- Timeout : 30 secondes par test
- Retry : 2 fois en CI

## 📝 Rapports générés

- **HTML** : Interface graphique complète
- **JSON** : Données structurées
- **JUnit** : Compatible CI/CD
- **Screenshots** : En cas d'échec
- **Vidéos** : Pour les erreurs

## 🚨 Dépannage

### **Erreurs communes**
```bash
# Serveur non démarré
npm run tina:dev

# Port occupé
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Cache Playwright
npx playwright install
```

### **Debug**
```bash
# Mode debug
npx playwright test --debug

# Tests spécifiques
npx playwright test tests/01-structure-navigation.spec.ts --headed
```

---

**🎉 Tests créés pour garantir la qualité et la fiabilité du site Husté-Mirassou !**
