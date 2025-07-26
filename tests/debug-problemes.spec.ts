import { test, expect } from '@playwright/test';

test.describe('Debug - Problèmes réels du site', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000); // Attendre le chargement
  });

  test('Vérifier l\'image de fond Hero', async ({ page }) => {
    console.log('🔍 Test de l\'image de fond Hero');
    
    // Vérifier si l'image de fond est définie
    const heroSection = page.locator('#accueil');
    
    // Vérifier les styles CSS de l'image de fond
    const backgroundImage = await heroSection.evaluate((el) => {
      const heroDiv = el.querySelector('div[style*="backgroundImage"]');
      if (heroDiv) {
        return window.getComputedStyle(heroDiv).backgroundImage;
      }
      return 'none';
    });
    
    console.log(`📸 Image de fond détectée: ${backgroundImage}`);
    
    if (backgroundImage === 'none') {
      console.log('❌ Aucune image de fond détectée');
      
      // Vérifier si c'est le placeholder qui s'affiche
      const placeholder = heroSection.locator('text=Image de chantier à ajouter');
      if (await placeholder.count() > 0) {
        console.log('🔧 Placeholder affiché - image manquante');
        await expect(placeholder).toBeVisible();
      }
    } else {
      console.log('✅ Image de fond trouvée');
      expect(backgroundImage).not.toBe('none');
    }
  });

  test('Vérifier les données TinaCMS chargées', async ({ page }) => {
    console.log('🔍 Test du chargement des données TinaCMS');
    
    // Attendre plus longtemps pour le chargement des données
    await page.waitForTimeout(5000);
    
    // Vérifier les données de l'entreprise
    const companyName = await page.locator('h1').textContent();
    console.log(`🏢 Nom entreprise: ${companyName}`);
    
    // Vérifier les services
    const serviceCards = page.locator('#services .bg-white.rounded-lg.shadow-lg');
    const serviceCount = await serviceCards.count();
    console.log(`🛠️ Nombre de services: ${serviceCount}`);
    
    if (serviceCount === 0) {
      console.log('❌ Aucun service chargé');
      
      // Vérifier s'il y a un message de chargement
      const loadingMessage = page.locator('text=Chargement des services');
      if (await loadingMessage.count() > 0) {
        console.log('⏳ Message de chargement encore affiché');
      }
    } else {
      // Lister les services trouvés
      const serviceTitles = await serviceCards.locator('h3').allTextContents();
      console.log(`📋 Services trouvés: ${serviceTitles.join(', ')}`);
    }
    
    // Vérifier les réalisations
    const realisationCards = page.locator('#realisations .bg-white.rounded-lg.shadow-lg');
    const realisationCount = await realisationCards.count();
    console.log(`🏗️ Nombre de réalisations: ${realisationCount}`);
    
    if (realisationCount > 0) {
      const realisationTitles = await realisationCards.locator('h3').allTextContents();
      console.log(`📋 Réalisations trouvées: ${realisationTitles.join(', ')}`);
    }
  });

  test('Vérifier les erreurs JavaScript', async ({ page }) => {
    console.log('🔍 Test des erreurs JavaScript');
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Capturer les erreurs et warnings
    page.on('pageerror', error => {
      errors.push(error.message);
      console.log(`❌ Erreur JS: ${error.message}`);
    });
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
        console.log(`❌ Console Error: ${msg.text()}`);
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text());
        console.log(`⚠️ Console Warning: ${msg.text()}`);
      }
    });
    
    // Naviguer dans le site pour déclencher les erreurs
    await page.click('text=Services');
    await page.waitForTimeout(1000);
    
    await page.click('text=Réalisations');
    await page.waitForTimeout(1000);
    
    await page.click('text=Devis');
    await page.waitForTimeout(1000);
    
    // Essayer de remplir le formulaire
    const devisSection = page.locator('#devis');
    await devisSection.locator('input[name="name"]').fill('Test');
    await devisSection.locator('input[name="email"]').fill('test@test.com');
    
    console.log(`📊 Total erreurs: ${errors.length}`);
    console.log(`📊 Total warnings: ${warnings.length}`);
    
    // Afficher les erreurs uniques
    const uniqueErrors = [...new Set(errors)];
    uniqueErrors.forEach(error => console.log(`🔴 ${error}`));
    
    // Le test échoue s'il y a des erreurs critiques
    const criticalErrors = errors.filter(error => 
      !error.includes('Warning') && 
      !error.includes('fetch') &&
      !error.includes('Failed to load resource')
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('Vérifier les requêtes réseau', async ({ page }) => {
    console.log('🔍 Test des requêtes réseau');
    
    const requests: any[] = [];
    const responses: any[] = [];
    
    // Capturer les requêtes et réponses
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method()
      });
    });
    
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    console.log(`📡 Requêtes totales: ${requests.length}`);
    console.log(`📡 Réponses totales: ${responses.length}`);
    
    // Vérifier les erreurs 404, 500, etc.
    const errorResponses = responses.filter(r => r.status >= 400);
    console.log(`❌ Réponses en erreur: ${errorResponses.length}`);
    
    errorResponses.forEach(error => {
      console.log(`🔴 ${error.status} ${error.statusText}: ${error.url}`);
    });
    
    // Vérifier les requêtes vers TinaCMS/GraphQL
    const graphqlRequests = requests.filter(r => r.url.includes('graphql'));
    console.log(`🔗 Requêtes GraphQL: ${graphqlRequests.length}`);
    
    const tinaRequests = requests.filter(r => r.url.includes('4001'));
    console.log(`🔗 Requêtes vers TinaCMS: ${tinaRequests.length}`);
    
    // Le test échoue s'il y a trop d'erreurs réseau
    expect(errorResponses.length).toBeLessThan(5);
  });

  test('Vérifier la configuration TinaCMS', async ({ page }) => {
    console.log('🔍 Test de la configuration TinaCMS');
    
    // Vérifier que les fichiers de configuration existent
    const configFiles = [
      '/content/config/entreprise.json',
      '/content/services/terrasses.mdx',
      '/content/services/maconnerie.mdx'
    ];
    
    for (const file of configFiles) {
      const response = await page.request.get(`http://localhost:3000${file}`);
      console.log(`📄 ${file}: ${response.status()}`);
      
      if (response.status() === 200) {
        console.log(`✅ ${file} accessible`);
      } else {
        console.log(`❌ ${file} non accessible (${response.status()})`);
      }
    }
    
    // Vérifier l'API GraphQL
    try {
      const graphqlResponse = await page.request.post('http://localhost:4001/graphql', {
        data: {
          query: '{ __schema { types { name } } }'
        }
      });
      
      console.log(`🔗 API GraphQL: ${graphqlResponse.status()}`);
      
      if (graphqlResponse.status() === 200) {
        console.log('✅ API GraphQL accessible');
      } else {
        console.log('❌ API GraphQL non accessible');
      }
    } catch (error) {
      console.log(`❌ Erreur API GraphQL: ${error}`);
    }
  });

  test('Vérifier les collections TinaCMS utilisées', async ({ page }) => {
    console.log('🔍 Test des collections TinaCMS');
    
    // Aller sur l'admin TinaCMS
    await page.goto('/admin/index.html');
    await page.waitForTimeout(5000);
    
    const pageContent = await page.content();
    
    // Vérifier si TinaCMS se charge
    if (pageContent.includes('TinaCMS') || pageContent.includes('tina')) {
      console.log('✅ Interface TinaCMS chargée');
    } else {
      console.log('❌ Interface TinaCMS non chargée');
    }
    
    // Vérifier les collections mentionnées
    const collections = ['Configuration', 'Services', 'Réalisations', 'Pages'];
    
    for (const collection of collections) {
      if (pageContent.includes(collection)) {
        console.log(`✅ Collection "${collection}" trouvée`);
      } else {
        console.log(`❌ Collection "${collection}" non trouvée`);
      }
    }
    
    // La collection Pages ne devrait plus exister
    expect(pageContent.includes('Pages')).toBeFalsy();
  });
});
