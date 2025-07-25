import { test, expect } from '@playwright/test';

test.describe('Structure et Navigation', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Page d\'accueil se charge correctement', async ({ page }) => {
    // Vérifier que la page se charge
    await expect(page).toHaveTitle(/SARL Husté-Mirassou/);
    
    // Vérifier la présence des éléments principaux
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('#accueil')).toBeVisible();
    await expect(page.locator('#services')).toBeVisible();
    await expect(page.locator('#realisations')).toBeVisible();
    await expect(page.locator('#devis')).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();
  });

  test('Navigation fixe fonctionne', async ({ page }) => {
    // Vérifier que la navigation est fixe
    const nav = page.locator('nav');
    await expect(nav).toHaveClass(/fixed/);
    
    // Vérifier la présence du logo/nom
    await expect(nav.locator('text=SARL Husté-Mirassou')).toBeVisible();
    
    // Vérifier les liens de navigation
    const navLinks = ['Accueil', 'Services', 'Réalisations', 'Devis', 'Contact'];
    for (const link of navLinks) {
      await expect(nav.locator(`text=${link}`)).toBeVisible();
    }
  });

  test('Navigation smooth scroll fonctionne', async ({ page }) => {
    // Tester le scroll vers Services
    await page.click('text=Services');
    await page.waitForTimeout(1000); // Attendre l'animation
    
    // Vérifier que la section Services est visible
    await expect(page.locator('#services')).toBeInViewport();
    
    // Tester le scroll vers Réalisations
    await page.click('text=Réalisations');
    await page.waitForTimeout(1000);
    await expect(page.locator('#realisations')).toBeInViewport();
    
    // Tester le scroll vers Contact
    await page.click('text=Contact');
    await page.waitForTimeout(1000);
    await expect(page.locator('#contact')).toBeInViewport();
  });

  test('Bouton CTA "Devis Gratuit" fonctionne', async ({ page }) => {
    // Cliquer sur le bouton CTA dans la navigation
    await page.click('text=Devis Gratuit');
    await page.waitForTimeout(1000);
    
    // Vérifier que la section devis est visible
    await expect(page.locator('#devis')).toBeInViewport();
  });

  test('Hero Section affiche le contenu', async ({ page }) => {
    const heroSection = page.locator('#accueil');
    
    // Vérifier la présence du titre principal
    await expect(heroSection.locator('h1')).toContainText('Husté-Mirassou');
    
    // Vérifier la présence du slogan
    await expect(heroSection.locator('text=Spécialiste en maçonnerie')).toBeVisible();
    
    // Vérifier les boutons d'action
    await expect(heroSection.locator('text=Voir nos réalisations')).toBeVisible();
    await expect(heroSection.locator('text=Devis gratuit')).toBeVisible();
    
    // Vérifier la flèche de scroll
    await expect(heroSection.locator('svg')).toBeVisible();
  });

  test('Responsive design - Mobile', async ({ page }) => {
    // Simuler un écran mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Vérifier que le menu mobile est présent
    const mobileMenuButton = page.locator('button[class*="md:hidden"]');
    await expect(mobileMenuButton).toBeVisible();
    
    // Ouvrir le menu mobile
    await mobileMenuButton.click();
    
    // Vérifier que les liens sont visibles dans le menu mobile
    await expect(page.locator('text=Accueil')).toBeVisible();
    await expect(page.locator('text=Services')).toBeVisible();
  });

  test('Responsive design - Desktop', async ({ page }) => {
    // Simuler un écran desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Vérifier que la navigation desktop est visible
    const desktopNav = page.locator('.hidden.md\\:flex');
    await expect(desktopNav).toBeVisible();
    
    // Vérifier que le menu mobile n'est pas visible
    const mobileMenuButton = page.locator('button[class*="md:hidden"]');
    await expect(mobileMenuButton).not.toBeVisible();
  });

  test('Structure HTML sémantique', async ({ page }) => {
    // Vérifier la présence des éléments sémantiques
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('section')).toHaveCount(5); // 5 sections principales
    
    // Vérifier les titres hiérarchiques
    await expect(page.locator('h1')).toHaveCount(1); // Un seul H1
    await expect(page.locator('h2')).toHaveCount(5); // H2 pour chaque section
  });

  test('Liens externes et internes', async ({ page }) => {
    // Vérifier que les liens téléphone sont corrects
    const phoneLinks = page.locator('a[href^="tel:"]');
    await expect(phoneLinks.first()).toBeVisible();
    
    // Vérifier que les liens email sont corrects
    const emailLinks = page.locator('a[href^="mailto:"]');
    if (await emailLinks.count() > 0) {
      await expect(emailLinks.first()).toBeVisible();
    }
  });

  test('Performance de chargement', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Vérifier que la page se charge en moins de 5 secondes
    expect(loadTime).toBeLessThan(5000);
    
    // Vérifier que les éléments critiques sont visibles rapidement
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });
});
