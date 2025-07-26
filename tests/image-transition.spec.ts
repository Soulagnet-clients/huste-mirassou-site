import { test, expect } from '@playwright/test';

test.describe('Image Transition Animation', () => {
  test('should analyze transition animation in detail', async ({ page }) => {
    // Écouter les logs de la console
    page.on('console', msg => {
      if (msg.type() === 'log') {
        console.log(`🖥️ CONSOLE: ${msg.text()}`);
      }
    });

    // Aller sur la page
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Ouvrir une réalisation
    const realisationButton = page.locator('button').filter({ hasText: 'Voir plus →' }).first();
    await realisationButton.click();
    await page.waitForSelector('[data-testid="realisation-modal"]', { timeout: 5000 });

    // Vérifier qu'il y a plusieurs images
    const navigationDots = page.locator('[data-testid="realisation-modal"] button[class*="rounded-full"]');
    const dotsCount = await navigationDots.count();

    if (dotsCount <= 1) {
      console.log('Une seule image, test non applicable');
      return;
    }

    console.log(`=== ANALYSE DÉTAILLÉE DE L'ANIMATION ===`);
    console.log(`Nombre d'images: ${dotsCount}`);

    // Fonction pour analyser l'état des images
    const analyzeImages = async (moment: string) => {
      const imageContainer = page.locator('.relative.h-96');
      const images = imageContainer.locator('img');
      const imageCount = await images.count();

      console.log(`\n--- ${moment} ---`);
      console.log(`Nombre d'éléments img: ${imageCount}`);

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const opacity = await img.evaluate(el => window.getComputedStyle(el).opacity);
        const src = await img.getAttribute('src');
        const filename = src?.split('/').pop()?.substring(0, 20) || 'unknown';

        console.log(`  Image ${i + 1}: opacity=${opacity}, src=${filename}`);
      }
    };

    // État initial
    await analyzeImages('ÉTAT INITIAL');
    await page.screenshot({ path: 'tests/screenshots/step-0-initial.png' });

    // Déclencher une transition manuelle
    console.log('\n🖱️ CLIC SUR POINT DE NAVIGATION...');
    await navigationDots.nth(1).click();

    // Analyser pendant la transition (plusieurs moments)
    await page.waitForTimeout(50);
    await analyzeImages('APRÈS 50ms');
    await page.screenshot({ path: 'tests/screenshots/step-1-50ms.png' });

    await page.waitForTimeout(100); // Total 150ms
    await analyzeImages('APRÈS 150ms');
    await page.screenshot({ path: 'tests/screenshots/step-2-150ms.png' });

    await page.waitForTimeout(100); // Total 250ms
    await analyzeImages('APRÈS 250ms');
    await page.screenshot({ path: 'tests/screenshots/step-3-250ms.png' });

    await page.waitForTimeout(100); // Total 350ms
    await analyzeImages('APRÈS 350ms (FIN)');
    await page.screenshot({ path: 'tests/screenshots/step-4-350ms.png' });

    // Attendre le redémarrage du défilement automatique (5 secondes après interaction)
    console.log('\n⏱️ ATTENTE DU REDÉMARRAGE (5 secondes)...');
    await page.waitForTimeout(5500); // 5.5 secondes pour être sûr

    console.log('🔄 DÉFILEMENT AUTOMATIQUE REDÉMARRÉ...');

    // Attendre le prochain défilement automatique (3 secondes)
    console.log('⏰ ATTENTE DU PROCHAIN DÉFILEMENT (3 secondes)...');
    await page.waitForTimeout(2800); // Presque 3 secondes

    console.log('🎬 PRÉPARATION POUR CAPTURER L\'ANIMATION...');

    // Attendre le déclenchement et capturer immédiatement
    await page.waitForTimeout(200); // Total 3 secondes

    // Analyser le défilement automatique (timing ajusté)
    await analyzeImages('AUTO - DÉCLENCHEMENT');
    await page.screenshot({ path: 'tests/screenshots/auto-0-trigger.png' });

    await page.waitForTimeout(50);
    await analyzeImages('AUTO - APRÈS 50ms');
    await page.screenshot({ path: 'tests/screenshots/auto-1-50ms.png' });

    await page.waitForTimeout(100);
    await analyzeImages('AUTO - APRÈS 150ms');
    await page.screenshot({ path: 'tests/screenshots/auto-2-150ms.png' });

    await page.waitForTimeout(150);
    await analyzeImages('AUTO - APRÈS 300ms');
    await page.screenshot({ path: 'tests/screenshots/auto-3-300ms.png' });

    console.log('\n✅ ANALYSE TERMINÉE - Vérifiez les captures d\'écran !');
  });
  
  test('should test manual navigation', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Ouvrir une réalisation
    const realisationButton = page.locator('button').filter({ hasText: 'Voir plus →' }).first();
    await realisationButton.click();
    
    await page.waitForSelector('[data-testid="realisation-modal"]', { timeout: 5000 });
    
    // Tester les flèches de navigation
    const leftArrow = page.locator('button').filter({ hasText: '←' });
    const rightArrow = page.locator('button').filter({ hasText: '→' });
    
    if (await leftArrow.count() > 0) {
      console.log('Test de la flèche droite...');
      await rightArrow.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'tests/screenshots/right-arrow.png' });
      
      console.log('Test de la flèche gauche...');
      await leftArrow.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'tests/screenshots/left-arrow.png' });
    }
  });
});
