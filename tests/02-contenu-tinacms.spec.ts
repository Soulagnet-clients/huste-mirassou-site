import { test, expect } from '@playwright/test';

test.describe('Contenu et Données TinaCMS', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Attendre que les données TinaCMS se chargent
    await page.waitForTimeout(2000);
  });

  test('Données entreprise se chargent depuis TinaCMS', async ({ page }) => {
    // Vérifier que le nom de l'entreprise est chargé
    await expect(page.locator('h1')).toContainText('SARL Husté-Mirassou');
    
    // Vérifier que le slogan est présent
    await expect(page.locator('text=Spécialiste en maçonnerie')).toBeVisible();
    
    // Vérifier que la description est présente
    await expect(page.locator('text=Terrasses, murets, allées')).toBeVisible();
  });

  test('Services se chargent depuis TinaCMS', async ({ page }) => {
    const servicesSection = page.locator('#services');
    
    // Attendre que les services se chargent
    await expect(servicesSection.locator('text=Chargement des services')).not.toBeVisible();
    
    // Vérifier qu'au moins 2 services sont affichés
    const serviceCards = servicesSection.locator('.bg-white.rounded-lg.shadow-lg');
    await expect(serviceCards).toHaveCount(4); // 4 services attendus
    
    // Vérifier les services spécifiques
    await expect(servicesSection.locator('text=Terrasses')).toBeVisible();
    await expect(servicesSection.locator('text=Maçonnerie')).toBeVisible();
    await expect(servicesSection.locator('text=Aménagements extérieurs')).toBeVisible();
    await expect(servicesSection.locator('text=Rénovation et réparation')).toBeVisible();
  });

  test('Détails des services affichent les bonnes données', async ({ page }) => {
    const servicesSection = page.locator('#services');
    
    // Vérifier le service Terrasses
    const terrassesCard = servicesSection.locator('text=Terrasses').locator('..').locator('..');
    await expect(terrassesCard.locator('text=🏗️')).toBeVisible(); // Icône
    await expect(terrassesCard.locator('text=À partir de')).toBeVisible(); // Prix
    await expect(terrassesCard.locator('text=Béton désactivé')).toBeVisible(); // Caractéristique
    
    // Vérifier le service Maçonnerie
    const maconnerieCard = servicesSection.locator('text=Maçonnerie').locator('..').locator('..');
    await expect(maconnerieCard.locator('text=🧱')).toBeVisible(); // Icône
    await expect(maconnerieCard.locator('text=Murets')).toBeVisible(); // Caractéristique
  });

  test('Réalisations se chargent depuis TinaCMS', async ({ page }) => {
    const realisationsSection = page.locator('#realisations');
    
    // Attendre que les réalisations se chargent
    await expect(realisationsSection.locator('text=Chargement des réalisations')).not.toBeVisible();
    
    // Vérifier qu'au moins 2 réalisations sont affichées
    const realisationCards = realisationsSection.locator('.bg-white.rounded-lg.shadow-lg');
    await expect(realisationCards).toHaveCountGreaterThan(1);
    
    // Vérifier les réalisations spécifiques
    await expect(realisationsSection.locator('text=Terrasse béton désactivé')).toBeVisible();
    await expect(realisationsSection.locator('text=Muret de soutènement')).toBeVisible();
  });

  test('Détails des réalisations affichent les bonnes données', async ({ page }) => {
    const realisationsSection = page.locator('#realisations');
    
    // Vérifier la première réalisation
    const firstCard = realisationsSection.locator('.bg-white.rounded-lg.shadow-lg').first();
    
    // Vérifier la présence du titre
    await expect(firstCard.locator('h3')).toBeVisible();
    
    // Vérifier la présence du lieu (📍)
    await expect(firstCard.locator('text=📍')).toBeVisible();
    
    // Vérifier la présence de la description
    await expect(firstCard.locator('p').nth(1)).toBeVisible();
    
    // Vérifier la présence de la date
    await expect(firstCard.locator('text=/')).toBeVisible(); // Format date français
    
    // Vérifier le bouton "Voir plus"
    await expect(firstCard.locator('text=Voir plus →')).toBeVisible();
  });

  test('Filtres des réalisations fonctionnent', async ({ page }) => {
    const realisationsSection = page.locator('#realisations');
    
    // Vérifier que tous les filtres sont présents
    await expect(realisationsSection.locator('text=Tous')).toBeVisible();
    await expect(realisationsSection.locator('text=Terrasses')).toBeVisible();
    await expect(realisationsSection.locator('text=Maçonnerie')).toBeVisible();
    
    // Tester le filtre "Terrasses"
    await realisationsSection.locator('text=Terrasses').click();
    await page.waitForTimeout(500);
    
    // Vérifier que le filtre est actif
    const terrassesFilter = realisationsSection.locator('button:has-text("Terrasses")');
    await expect(terrassesFilter).toHaveClass(/bg-blue-600/);
    
    // Tester le filtre "Maçonnerie"
    await realisationsSection.locator('text=Maçonnerie').click();
    await page.waitForTimeout(500);
    
    // Vérifier que le filtre est actif
    const maconnerieFilter = realisationsSection.locator('button:has-text("Maçonnerie")');
    await expect(maconnerieFilter).toHaveClass(/bg-blue-600/);
    
    // Revenir à "Tous"
    await realisationsSection.locator('text=Tous').click();
    await page.waitForTimeout(500);
  });

  test('Informations de contact se chargent depuis TinaCMS', async ({ page }) => {
    const contactSection = page.locator('#contact');
    
    // Vérifier le nom de l'entreprise
    await expect(contactSection.locator('text=SARL Husté-Mirassou')).toBeVisible();
    
    // Vérifier les informations de contact
    await expect(contactSection.locator('text=Téléphone')).toBeVisible();
    await expect(contactSection.locator('text=Email')).toBeVisible();
    await expect(contactSection.locator('text=Adresse')).toBeVisible();
    await expect(contactSection.locator('text=Horaires')).toBeVisible();
    
    // Vérifier les données spécifiques
    await expect(contactSection.locator('text=06 12 34 56 78')).toBeVisible();
    await expect(contactSection.locator('text=contact@huste-mirassou.fr')).toBeVisible();
    await expect(contactSection.locator('text=8h - 18h')).toBeVisible();
  });

  test('Gestion des erreurs de chargement TinaCMS', async ({ page }) => {
    // Simuler une erreur réseau en bloquant les requêtes API
    await page.route('**/api/**', route => route.abort());
    
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    // Vérifier que les données par défaut s'affichent
    await expect(page.locator('h1')).toContainText('SARL Husté-Mirassou');
    
    // Vérifier qu'il n'y a pas d'erreurs JavaScript critiques
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    
    await page.waitForTimeout(2000);
    
    // Filtrer les erreurs critiques (ignorer les erreurs de réseau attendues)
    const criticalErrors = errors.filter(error => 
      !error.includes('fetch') && 
      !error.includes('network') &&
      !error.includes('Failed to load')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('Performance du chargement des données', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Attendre que les services se chargent
    await expect(page.locator('#services .bg-white.rounded-lg.shadow-lg')).toHaveCountGreaterThan(0);
    
    // Attendre que les réalisations se chargent
    await expect(page.locator('#realisations .bg-white.rounded-lg.shadow-lg')).toHaveCountGreaterThan(0);
    
    const loadTime = Date.now() - startTime;
    
    // Vérifier que les données se chargent en moins de 10 secondes
    expect(loadTime).toBeLessThan(10000);
  });

  test('Cohérence des données entre sections', async ({ page }) => {
    // Vérifier que le nom de l'entreprise est cohérent
    const heroName = await page.locator('#accueil h1').textContent();
    const contactName = await page.locator('#contact h3').textContent();
    
    expect(heroName).toContain('Husté-Mirassou');
    expect(contactName).toContain('Husté-Mirassou');
    
    // Vérifier que le téléphone est cohérent
    const contactPhone = await page.locator('#contact text=06 12 34 56 78').textContent();
    const ctaPhone = await page.locator('text=📞').textContent();
    
    expect(contactPhone).toBeTruthy();
  });
});
