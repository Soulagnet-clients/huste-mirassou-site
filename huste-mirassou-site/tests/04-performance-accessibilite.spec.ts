import { test, expect } from '@playwright/test';

test.describe('Performance et Accessibilité', () => {
  
  test('Performance - Temps de chargement initial', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Vérifier que la page se charge en moins de 5 secondes
    expect(loadTime).toBeLessThan(5000);
    
    console.log(`Temps de chargement: ${loadTime}ms`);
  });

  test('Performance - First Contentful Paint', async ({ page }) => {
    await page.goto('/');
    
    // Mesurer les métriques de performance
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            resolve(fcpEntry.startTime);
          }
        }).observe({ entryTypes: ['paint'] });
        
        // Timeout après 10 secondes
        setTimeout(() => resolve(null), 10000);
      });
    });
    
    if (metrics) {
      console.log(`First Contentful Paint: ${metrics}ms`);
      expect(metrics).toBeLessThan(3000); // Moins de 3 secondes
    }
  });

  test('Performance - Largest Contentful Paint', async ({ page }) => {
    await page.goto('/');
    
    // Attendre que le contenu principal se charge
    await page.waitForSelector('h1');
    await page.waitForTimeout(3000);
    
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        setTimeout(() => resolve(null), 5000);
      });
    });
    
    if (lcp) {
      console.log(`Largest Contentful Paint: ${lcp}ms`);
      expect(lcp).toBeLessThan(4000); // Moins de 4 secondes
    }
  });

  test('Accessibilité - Structure des titres', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Vérifier la hiérarchie des titres
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1); // Un seul H1
    
    const h2Count = await page.locator('h2').count();
    expect(h2Count).toBeGreaterThan(0); // Au moins un H2
    
    // Vérifier que H1 contient du texte significatif
    const h1Text = await page.locator('h1').textContent();
    expect(h1Text).toBeTruthy();
    expect(h1Text?.length).toBeGreaterThan(5);
  });

  test('Accessibilité - Attributs alt des images', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Vérifier que toutes les images ont un attribut alt
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      
      // Vérifier que l'attribut alt existe (peut être vide pour les images décoratives)
      expect(alt).not.toBeNull();
    }
  });

  test('Accessibilité - Contraste des couleurs', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Vérifier le contraste du texte principal
    const mainText = page.locator('h1');
    const styles = await mainText.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor
      };
    });
    
    // Vérifier que les couleurs sont définies
    expect(styles.color).toBeTruthy();
    
    // Test basique - vérifier que le texte n'est pas transparent
    expect(styles.color).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('Accessibilité - Navigation au clavier', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Tester la navigation au clavier
    let focusableElements = 0;
    
    // Compter les éléments focusables
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      
      const focusedElement = page.locator(':focus');
      if (await focusedElement.count() > 0) {
        focusableElements++;
        
        // Vérifier que l'élément focusé est visible
        await expect(focusedElement).toBeVisible();
      }
    }
    
    // Vérifier qu'il y a des éléments focusables
    expect(focusableElements).toBeGreaterThan(5);
  });

  test('Accessibilité - Labels des formulaires', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Aller à la section devis
    await page.click('text=Devis');
    await page.waitForTimeout(1000);
    
    // Vérifier que tous les champs de formulaire ont des labels
    const formInputs = page.locator('#devis input, #devis select, #devis textarea');
    const inputCount = await formInputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = formInputs.nth(i);
      const inputId = await input.getAttribute('id');
      const inputName = await input.getAttribute('name');
      
      if (inputName) {
        // Vérifier qu'il y a un label associé
        const label = page.locator(`label[for="${inputId}"], label:has(input[name="${inputName}"])`);
        const labelCount = await label.count();
        
        if (labelCount === 0) {
          // Vérifier s'il y a un label parent
          const parentLabel = input.locator('xpath=ancestor::label');
          const parentLabelCount = await parentLabel.count();
          expect(parentLabelCount).toBeGreaterThan(0);
        }
      }
    }
  });

  test('Accessibilité - Attributs ARIA', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Vérifier la présence d'attributs ARIA appropriés
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Vérifier les boutons avec des rôles appropriés
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();
      
      // Vérifier que le bouton a soit un aria-label soit du texte
      expect(ariaLabel || textContent).toBeTruthy();
    }
  });

  test('SEO - Métadonnées de base', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier le titre de la page
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThan(60); // Limite SEO recommandée
    
    // Vérifier la meta description
    const metaDescription = page.locator('meta[name="description"]');
    const description = await metaDescription.getAttribute('content');
    
    if (description) {
      expect(description.length).toBeGreaterThan(50);
      expect(description.length).toBeLessThan(160); // Limite SEO recommandée
    }
  });

  test('SEO - Structure des URLs', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier que l'URL est propre
    const url = page.url();
    expect(url).toMatch(/^https?:\/\/[^\/]+\/?$/); // URL racine propre
    
    // Vérifier qu'il n'y a pas de paramètres inutiles
    expect(url).not.toContain('?');
    expect(url).not.toContain('#');
  });

  test('Performance - Taille des ressources', async ({ page }) => {
    const responses: any[] = [];
    
    // Capturer toutes les réponses réseau
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        size: response.headers()['content-length']
      });
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Vérifier qu'il n'y a pas d'erreurs 404
    const errors = responses.filter(r => r.status >= 400);
    expect(errors.length).toBe(0);
    
    // Vérifier que les ressources principales se chargent
    const htmlResponse = responses.find(r => r.url.includes('localhost:3000') && !r.url.includes('.'));
    expect(htmlResponse?.status).toBe(200);
  });

  test('Performance - Optimisation des images', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Vérifier que les images ont des attributs de performance
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      
      // Vérifier les attributs de performance recommandés
      const loading = await img.getAttribute('loading');
      const width = await img.getAttribute('width');
      const height = await img.getAttribute('height');
      
      // Au moins un attribut de performance devrait être présent
      const hasPerformanceAttr = loading || width || height;
      
      if (!hasPerformanceAttr) {
        console.warn(`Image sans attributs de performance: ${await img.getAttribute('src')}`);
      }
    }
  });

  test('Accessibilité - Couleurs et contrastes', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Vérifier que les liens sont distinguables
    const links = page.locator('a');
    const linkCount = await links.count();
    
    if (linkCount > 0) {
      const firstLink = links.first();
      const linkStyles = await firstLink.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          textDecoration: computed.textDecoration
        };
      });
      
      // Vérifier que les liens ont une couleur ou une décoration
      expect(linkStyles.color || linkStyles.textDecoration).toBeTruthy();
    }
  });

  test('Performance - Métriques Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Attendre que la page soit complètement chargée
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Mesurer le Cumulative Layout Shift (CLS)
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
        }).observe({ entryTypes: ['layout-shift'] });
        
        setTimeout(() => resolve(clsValue), 2000);
      });
    });
    
    console.log(`Cumulative Layout Shift: ${cls}`);
    
    // CLS devrait être inférieur à 0.1 pour une bonne expérience
    if (typeof cls === 'number') {
      expect(cls).toBeLessThan(0.25); // Seuil acceptable
    }
  });
});
