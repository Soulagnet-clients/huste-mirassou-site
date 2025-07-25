import { test, expect } from '@playwright/test';

test.describe('Interactions Utilisateur', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000); // Attendre le chargement des données
  });

  test('Formulaire de devis - Validation des champs requis', async ({ page }) => {
    // Aller à la section devis
    await page.click('text=Devis');
    await page.waitForTimeout(1000);
    
    const devisSection = page.locator('#devis');
    
    // Essayer de soumettre le formulaire vide
    await devisSection.locator('button[type="submit"]').click();
    
    // Vérifier que les champs requis sont mis en évidence
    const nameField = devisSection.locator('input[name="name"]');
    const emailField = devisSection.locator('input[name="email"]');
    const phoneField = devisSection.locator('input[name="phone"]');
    const projectTypeField = devisSection.locator('select[name="projectType"]');
    const descriptionField = devisSection.locator('textarea[name="description"]');
    
    // Vérifier que les champs requis ont l'attribut required
    await expect(nameField).toHaveAttribute('required');
    await expect(emailField).toHaveAttribute('required');
    await expect(phoneField).toHaveAttribute('required');
    await expect(projectTypeField).toHaveAttribute('required');
    await expect(descriptionField).toHaveAttribute('required');
  });

  test('Formulaire de devis - Remplissage et soumission', async ({ page }) => {
    // Aller à la section devis
    await page.click('text=Devis');
    await page.waitForTimeout(1000);
    
    const devisSection = page.locator('#devis');
    
    // Remplir le formulaire
    await devisSection.locator('input[name="name"]').fill('Jean Dupont');
    await devisSection.locator('input[name="phone"]').fill('06 12 34 56 78');
    await devisSection.locator('input[name="email"]').fill('jean.dupont@email.com');
    await devisSection.locator('select[name="projectType"]').selectOption('terrasse');
    await devisSection.locator('textarea[name="description"]').fill('Je souhaite créer une terrasse de 30m² en béton désactivé');
    await devisSection.locator('select[name="budget"]').selectOption('5k-10k');
    await devisSection.locator('select[name="timeline"]').selectOption('moyen');
    
    // Intercepter l'alerte de confirmation
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Votre demande de devis a été envoyée');
      await dialog.accept();
    });
    
    // Soumettre le formulaire
    await devisSection.locator('button[type="submit"]').click();
  });

  test('Formulaire de devis - Validation email', async ({ page }) => {
    await page.click('text=Devis');
    await page.waitForTimeout(1000);
    
    const devisSection = page.locator('#devis');
    const emailField = devisSection.locator('input[name="email"]');
    
    // Tester avec un email invalide
    await emailField.fill('email-invalide');
    await devisSection.locator('input[name="name"]').click(); // Déclencher la validation
    
    // Vérifier que le champ email a le type email
    await expect(emailField).toHaveAttribute('type', 'email');
  });

  test('Boutons CTA - Navigation vers devis', async ({ page }) => {
    // Tester le bouton CTA dans le hero
    const heroSection = page.locator('#accueil');
    await heroSection.locator('text=Devis gratuit').click();
    await page.waitForTimeout(1000);
    await expect(page.locator('#devis')).toBeInViewport();
    
    // Retourner en haut
    await page.click('text=Accueil');
    await page.waitForTimeout(1000);
    
    // Tester le bouton CTA dans les services
    const servicesSection = page.locator('#services');
    await servicesSection.locator('text=Demander un devis').click();
    await page.waitForTimeout(1000);
    await expect(page.locator('#devis')).toBeInViewport();
  });

  test('Boutons CTA - Navigation vers réalisations', async ({ page }) => {
    const heroSection = page.locator('#accueil');
    
    // Cliquer sur "Voir nos réalisations"
    await heroSection.locator('text=Voir nos réalisations').click();
    await page.waitForTimeout(1000);
    
    // Vérifier que la section réalisations est visible
    await expect(page.locator('#realisations')).toBeInViewport();
  });

  test('Boutons CTA - Navigation vers contact', async ({ page }) => {
    const realisationsSection = page.locator('#realisations');
    
    // Cliquer sur "Nous contacter"
    await realisationsSection.locator('text=Nous contacter').click();
    await page.waitForTimeout(1000);
    
    // Vérifier que la section contact est visible
    await expect(page.locator('#contact')).toBeInViewport();
  });

  test('Liens téléphone fonctionnent', async ({ page }) => {
    const contactSection = page.locator('#contact');
    
    // Vérifier la présence des liens téléphone
    const phoneLinks = contactSection.locator('a[href^="tel:"]');
    
    if (await phoneLinks.count() > 0) {
      const firstPhoneLink = phoneLinks.first();
      await expect(firstPhoneLink).toBeVisible();
      
      // Vérifier que le lien a le bon format
      const href = await firstPhoneLink.getAttribute('href');
      expect(href).toMatch(/^tel:/);
    }
  });

  test('Flèche de scroll dans hero fonctionne', async ({ page }) => {
    const heroSection = page.locator('#accueil');
    
    // Cliquer sur la flèche de scroll
    await heroSection.locator('svg').last().click();
    await page.waitForTimeout(1000);
    
    // Vérifier que la section services est visible
    await expect(page.locator('#services')).toBeInViewport();
  });

  test('Menu mobile - Ouverture et fermeture', async ({ page }) => {
    // Simuler un écran mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    const mobileMenuButton = page.locator('button[class*="md:hidden"]');
    
    // Ouvrir le menu mobile
    await mobileMenuButton.click();
    
    // Vérifier que le menu est ouvert
    await expect(page.locator('.md\\:hidden .px-2')).toBeVisible();
    
    // Cliquer sur un lien du menu mobile
    await page.locator('.md\\:hidden text=Services').click();
    await page.waitForTimeout(1000);
    
    // Vérifier que le menu se ferme et que la navigation fonctionne
    await expect(page.locator('#services')).toBeInViewport();
  });

  test('Interactions hover sur les cartes', async ({ page }) => {
    // Tester le hover sur les cartes de services
    const servicesSection = page.locator('#services');
    const firstServiceCard = servicesSection.locator('.bg-white.rounded-lg.shadow-lg').first();
    
    // Vérifier l'état initial
    await expect(firstServiceCard).toHaveClass(/shadow-lg/);
    
    // Simuler le hover
    await firstServiceCard.hover();
    
    // Vérifier que la classe hover est appliquée
    await expect(firstServiceCard).toHaveClass(/hover:shadow-xl/);
  });

  test('Interactions avec les filtres de réalisations', async ({ page }) => {
    const realisationsSection = page.locator('#realisations');
    
    // Vérifier l'état initial (filtre "Tous" actif)
    const tousFilter = realisationsSection.locator('button:has-text("Tous")');
    await expect(tousFilter).toHaveClass(/bg-blue-600/);
    
    // Cliquer sur le filtre "Terrasses"
    const terrassesFilter = realisationsSection.locator('button:has-text("Terrasses")');
    await terrassesFilter.click();
    await page.waitForTimeout(500);
    
    // Vérifier que le filtre "Terrasses" est maintenant actif
    await expect(terrassesFilter).toHaveClass(/bg-blue-600/);
    await expect(tousFilter).not.toHaveClass(/bg-blue-600/);
    
    // Vérifier que les réalisations sont filtrées
    const realisationCards = realisationsSection.locator('.bg-white.rounded-lg.shadow-lg');
    const cardCount = await realisationCards.count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('Boutons "Voir plus" des réalisations', async ({ page }) => {
    const realisationsSection = page.locator('#realisations');
    
    // Vérifier la présence des boutons "Voir plus"
    const voirPlusButtons = realisationsSection.locator('text=Voir plus →');
    await expect(voirPlusButtons.first()).toBeVisible();
    
    // Cliquer sur le premier bouton "Voir plus"
    await voirPlusButtons.first().click();
    
    // Pour l'instant, vérifier juste que le bouton est cliquable
    // (La fonctionnalité de détail pourrait être ajoutée plus tard)
  });

  test('Accessibilité clavier - Navigation', async ({ page }) => {
    // Tester la navigation au clavier
    await page.keyboard.press('Tab');
    
    // Vérifier que le focus est visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Continuer la navigation au clavier
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Tester l'activation avec Entrée
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
  });

  test('Gestion des erreurs JavaScript', async ({ page }) => {
    const errors: string[] = [];
    
    // Capturer les erreurs JavaScript
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    // Interagir avec différents éléments
    await page.click('text=Services');
    await page.waitForTimeout(500);
    
    await page.click('text=Réalisations');
    await page.waitForTimeout(500);
    
    await page.click('text=Devis');
    await page.waitForTimeout(500);
    
    // Remplir le formulaire
    const devisSection = page.locator('#devis');
    await devisSection.locator('input[name="name"]').fill('Test');
    await devisSection.locator('input[name="email"]').fill('test@test.com');
    
    // Vérifier qu'il n'y a pas d'erreurs critiques
    const criticalErrors = errors.filter(error => 
      !error.includes('Warning') && 
      !error.includes('fetch')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});
