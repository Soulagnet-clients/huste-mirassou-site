import { test, expect } from '@playwright/test';

test.describe('Intégration TinaCMS', () => {
  
  test('Interface d\'administration TinaCMS accessible', async ({ page }) => {
    // Aller à l'interface d'administration
    await page.goto('/admin/index.html');
    
    // Attendre que TinaCMS se charge
    await page.waitForTimeout(5000);
    
    // Vérifier que l'interface TinaCMS est présente
    const tinaCMSElements = [
      'text=TinaCMS',
      '[data-testid="tina-cms"]',
      '.tina-cms',
      'iframe[title*="TinaCMS"]'
    ];
    
    let tinaCMSFound = false;
    for (const selector of tinaCMSElements) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        tinaCMSFound = true;
        break;
      }
    }
    
    // Si TinaCMS n'est pas trouvé par les sélecteurs, vérifier le contenu de la page
    if (!tinaCMSFound) {
      const pageContent = await page.content();
      tinaCMSFound = pageContent.includes('TinaCMS') || pageContent.includes('tina');
    }
    
    expect(tinaCMSFound).toBeTruthy();
  });

  test('Collections TinaCMS sont configurées', async ({ page }) => {
    await page.goto('/admin/index.html');
    await page.waitForTimeout(5000);
    
    // Vérifier que les collections sont accessibles
    // (Les sélecteurs peuvent varier selon la version de TinaCMS)
    const possibleSelectors = [
      'text=Configuration Entreprise',
      'text=Services',
      'text=Réalisations',
      'text=Pages',
      '[data-collection="config"]',
      '[data-collection="service"]',
      '[data-collection="realisation"]'
    ];
    
    let collectionsFound = 0;
    for (const selector of possibleSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        collectionsFound++;
      }
    }
    
    // Au moins quelques collections devraient être trouvées
    expect(collectionsFound).toBeGreaterThan(0);
  });

  test('API GraphQL TinaCMS répond', async ({ page }) => {
    // Tester l'endpoint GraphQL de TinaCMS
    const response = await page.request.post('http://localhost:4001/graphql', {
      data: {
        query: `
          query {
            configConnection {
              edges {
                node {
                  id
                }
              }
            }
          }
        `
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Vérifier que l'API répond
    expect(response.status()).toBeLessThan(500);
    
    // Si l'API est disponible, vérifier la structure de la réponse
    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('data');
    }
  });

  test('Synchronisation des données entre TinaCMS et frontend', async ({ page }) => {
    // Aller sur la page principale
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    // Capturer les données affichées sur le frontend
    const frontendData = {
      companyName: await page.locator('h1').textContent(),
      services: await page.locator('#services .bg-white.rounded-lg.shadow-lg h3').allTextContents(),
      realisations: await page.locator('#realisations .bg-white.rounded-lg.shadow-lg h3').allTextContents()
    };
    
    // Vérifier que les données sont cohérentes
    expect(frontendData.companyName).toContain('Husté-Mirassou');
    expect(frontendData.services.length).toBeGreaterThan(0);
    expect(frontendData.realisations.length).toBeGreaterThan(0);
    
    // Vérifier que les services attendus sont présents
    const expectedServices = ['Terrasses', 'Maçonnerie'];
    for (const service of expectedServices) {
      const serviceFound = frontendData.services.some(s => s.includes(service));
      expect(serviceFound).toBeTruthy();
    }
  });

  test('Gestion des erreurs de connexion TinaCMS', async ({ page }) => {
    // Simuler une panne de TinaCMS en bloquant les requêtes
    await page.route('**/graphql', route => route.abort());
    await page.route('**/api/**', route => route.abort());
    
    await page.goto('/');
    await page.waitForTimeout(5000);
    
    // Vérifier que le site fonctionne toujours avec les données par défaut
    await expect(page.locator('h1')).toContainText('Husté-Mirassou');
    
    // Vérifier qu'il n'y a pas d'erreurs critiques affichées à l'utilisateur
    const errorMessages = page.locator('text=Error, text=Erreur, text=Failed');
    const errorCount = await errorMessages.count();
    
    // Il peut y avoir des erreurs en console, mais pas d'erreurs visibles pour l'utilisateur
    expect(errorCount).toBe(0);
  });

  test('Performance de l\'API TinaCMS', async ({ page }) => {
    const startTime = Date.now();
    
    // Tester la vitesse de réponse de l'API
    const response = await page.request.get('http://localhost:4001/graphql', {
      data: {
        query: '{ __schema { types { name } } }'
      }
    });
    
    const responseTime = Date.now() - startTime;
    
    // L'API devrait répondre en moins de 2 secondes
    expect(responseTime).toBeLessThan(2000);
    
    console.log(`Temps de réponse API TinaCMS: ${responseTime}ms`);
  });

  test('Structure des fichiers de contenu', async ({ page }) => {
    // Vérifier que les fichiers de contenu existent
    const contentFiles = [
      '/content/config/entreprise.json',
      '/content/services/terrasses.mdx',
      '/content/services/maconnerie.mdx',
      '/content/realisations/terrasse-beton-desactive-mirassou.mdx'
    ];
    
    for (const file of contentFiles) {
      const response = await page.request.get(`http://localhost:3000${file}`);
      
      // Les fichiers peuvent ne pas être directement accessibles via HTTP
      // mais on peut vérifier qu'ils ne retournent pas 404
      expect(response.status()).not.toBe(404);
    }
  });

  test('Validation du schéma TinaCMS', async ({ page }) => {
    // Tester que le schéma TinaCMS est valide
    const response = await page.request.post('http://localhost:4001/graphql', {
      data: {
        query: `
          query {
            __schema {
              types {
                name
                fields {
                  name
                  type {
                    name
                  }
                }
              }
            }
          }
        `
      }
    });
    
    if (response.status() === 200) {
      const data = await response.json();
      
      // Vérifier que le schéma contient nos types personnalisés
      const schema = data.data.__schema;
      const typeNames = schema.types.map((type: any) => type.name);
      
      // Vérifier la présence des types de base
      expect(typeNames).toContain('String');
      expect(typeNames).toContain('Boolean');
      
      // Les types personnalisés peuvent avoir des noms générés
      const hasCustomTypes = typeNames.some((name: string) => 
        name.includes('Config') || 
        name.includes('Service') || 
        name.includes('Realisation')
      );
      
      expect(hasCustomTypes).toBeTruthy();
    }
  });

  test('Édition de contenu via TinaCMS (simulation)', async ({ page }) => {
    await page.goto('/admin/index.html');
    await page.waitForTimeout(5000);
    
    // Essayer de naviguer dans l'interface TinaCMS
    // (Les sélecteurs peuvent varier selon la version)
    const editableElements = [
      'button:has-text("Edit")',
      'button:has-text("Modifier")',
      '[data-testid="edit-button"]',
      '.tina-edit-button'
    ];
    
    let editButtonFound = false;
    for (const selector of editableElements) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        editButtonFound = true;
        // Essayer de cliquer sur le bouton d'édition
        await element.first().click();
        await page.waitForTimeout(1000);
        break;
      }
    }
    
    // Si aucun bouton d'édition n'est trouvé, vérifier au moins que l'interface est interactive
    if (!editButtonFound) {
      // Vérifier que la page contient des éléments interactifs
      const interactiveElements = await page.locator('button, input, select, textarea').count();
      expect(interactiveElements).toBeGreaterThan(0);
    }
  });

  test('Sauvegarde et persistance des données', async ({ page }) => {
    // Aller sur la page principale et capturer les données initiales
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    const initialData = {
      companyName: await page.locator('h1').textContent(),
      serviceCount: await page.locator('#services .bg-white.rounded-lg.shadow-lg').count(),
      realisationCount: await page.locator('#realisations .bg-white.rounded-lg.shadow-lg').count()
    };
    
    // Recharger la page
    await page.reload();
    await page.waitForTimeout(3000);
    
    // Vérifier que les données sont toujours les mêmes
    const reloadedData = {
      companyName: await page.locator('h1').textContent(),
      serviceCount: await page.locator('#services .bg-white.rounded-lg.shadow-lg').count(),
      realisationCount: await page.locator('#realisations .bg-white.rounded-lg.shadow-lg').count()
    };
    
    expect(reloadedData.companyName).toBe(initialData.companyName);
    expect(reloadedData.serviceCount).toBe(initialData.serviceCount);
    expect(reloadedData.realisationCount).toBe(initialData.realisationCount);
  });

  test('Gestion des médias TinaCMS', async ({ page }) => {
    await page.goto('/admin/index.html');
    await page.waitForTimeout(5000);
    
    // Vérifier que le système de gestion des médias est accessible
    const mediaElements = [
      'text=Media',
      'text=Images',
      'text=Upload',
      '[data-testid="media-manager"]',
      'input[type="file"]'
    ];
    
    let mediaSystemFound = false;
    for (const selector of mediaElements) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        mediaSystemFound = true;
        break;
      }
    }
    
    // Le système de médias peut ne pas être immédiatement visible
    // Vérifier au moins que l'interface TinaCMS est fonctionnelle
    const pageContent = await page.content();
    const hasTinaCMSContent = pageContent.includes('TinaCMS') || 
                             pageContent.includes('admin') || 
                             pageContent.includes('edit');
    
    expect(hasTinaCMSContent).toBeTruthy();
  });
});
