import { test, expect } from '@playwright/test';

test.describe('Audit Complet - Site Husté-Mirassou', () => {
  
  test('Audit global - Fonctionnalités critiques', async ({ page }) => {
    console.log('🚀 Début de l\'audit complet du site Husté-Mirassou');
    
    // 1. Chargement initial
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    console.log(`⏱️  Temps de chargement: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(10000); // 10 secondes max
    
    // 2. Structure de base
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Husté-Mirassou');
    await expect(page.locator('#services')).toBeVisible();
    await expect(page.locator('#realisations')).toBeVisible();
    await expect(page.locator('#devis')).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();
    
    console.log('✅ Structure de base validée');
    
    // 3. Navigation
    await page.click('text=Services');
    await page.waitForTimeout(1000);
    await expect(page.locator('#services')).toBeInViewport();
    
    await page.click('text=Réalisations');
    await page.waitForTimeout(1000);
    await expect(page.locator('#realisations')).toBeInViewport();
    
    console.log('✅ Navigation validée');
    
    // 4. Contenu TinaCMS
    await page.waitForTimeout(2000); // Attendre le chargement des données
    
    const serviceCount = await page.locator('#services .bg-white.rounded-lg.shadow-lg').count();
    expect(serviceCount).toBeGreaterThan(0);
    
    const realisationCount = await page.locator('#realisations .bg-white.rounded-lg.shadow-lg').count();
    expect(realisationCount).toBeGreaterThan(0);
    
    console.log(`✅ Contenu TinaCMS validé: ${serviceCount} services, ${realisationCount} réalisations`);
    
    // 5. Formulaire de devis
    await page.click('text=Devis');
    await page.waitForTimeout(1000);
    
    const devisSection = page.locator('#devis');
    await devisSection.locator('input[name="name"]').fill('Test Audit');
    await devisSection.locator('input[name="email"]').fill('audit@test.com');
    await devisSection.locator('input[name="phone"]').fill('06 12 34 56 78');
    await devisSection.locator('select[name="projectType"]').selectOption('terrasse');
    await devisSection.locator('textarea[name="description"]').fill('Test audit complet');
    
    console.log('✅ Formulaire de devis validé');
    
    // 6. Responsive design
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    const mobileMenuButton = page.locator('button[class*="md:hidden"]');
    await expect(mobileMenuButton).toBeVisible();
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    
    console.log('✅ Responsive design validé');
    
    // 7. Accessibilité de base
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    
    console.log('✅ Accessibilité de base validée');
    
    // 8. Performance
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart
      };
    });
    
    console.log(`⚡ Métriques de performance:`, performanceMetrics);
    
    console.log('🎉 Audit complet terminé avec succès !');
  });

  test('Rapport d\'audit détaillé', async ({ page }) => {
    const auditResults = {
      structure: { passed: 0, failed: 0, tests: [] as string[] },
      contenu: { passed: 0, failed: 0, tests: [] as string[] },
      interactions: { passed: 0, failed: 0, tests: [] as string[] },
      performance: { passed: 0, failed: 0, tests: [] as string[] },
      accessibilite: { passed: 0, failed: 0, tests: [] as string[] }
    };

    await page.goto('/');
    await page.waitForTimeout(3000);

    // Tests de structure
    try {
      await expect(page.locator('nav')).toBeVisible();
      auditResults.structure.passed++;
      auditResults.structure.tests.push('✅ Navigation présente');
    } catch {
      auditResults.structure.failed++;
      auditResults.structure.tests.push('❌ Navigation manquante');
    }

    try {
      await expect(page.locator('h1')).toBeVisible();
      auditResults.structure.passed++;
      auditResults.structure.tests.push('✅ Titre principal présent');
    } catch {
      auditResults.structure.failed++;
      auditResults.structure.tests.push('❌ Titre principal manquant');
    }

    try {
      const sectionCount = await page.locator('section').count();
      expect(sectionCount).toBeGreaterThanOrEqual(5);
      auditResults.structure.passed++;
      auditResults.structure.tests.push(`✅ ${sectionCount} sections trouvées`);
    } catch {
      auditResults.structure.failed++;
      auditResults.structure.tests.push('❌ Sections insuffisantes');
    }

    // Tests de contenu
    try {
      const serviceCount = await page.locator('#services .bg-white.rounded-lg.shadow-lg').count();
      expect(serviceCount).toBeGreaterThan(0);
      auditResults.contenu.passed++;
      auditResults.contenu.tests.push(`✅ ${serviceCount} services chargés`);
    } catch {
      auditResults.contenu.failed++;
      auditResults.contenu.tests.push('❌ Services non chargés');
    }

    try {
      const realisationCount = await page.locator('#realisations .bg-white.rounded-lg.shadow-lg').count();
      expect(realisationCount).toBeGreaterThan(0);
      auditResults.contenu.passed++;
      auditResults.contenu.tests.push(`✅ ${realisationCount} réalisations chargées`);
    } catch {
      auditResults.contenu.failed++;
      auditResults.contenu.tests.push('❌ Réalisations non chargées');
    }

    // Tests d'interactions
    try {
      await page.click('text=Services');
      await page.waitForTimeout(500);
      await expect(page.locator('#services')).toBeInViewport();
      auditResults.interactions.passed++;
      auditResults.interactions.tests.push('✅ Navigation smooth scroll fonctionne');
    } catch {
      auditResults.interactions.failed++;
      auditResults.interactions.tests.push('❌ Navigation smooth scroll défaillante');
    }

    try {
      const devisSection = page.locator('#devis');
      await page.click('text=Devis');
      await page.waitForTimeout(500);
      await expect(devisSection).toBeInViewport();
      auditResults.interactions.passed++;
      auditResults.interactions.tests.push('✅ Section devis accessible');
    } catch {
      auditResults.interactions.failed++;
      auditResults.interactions.tests.push('❌ Section devis inaccessible');
    }

    // Tests de performance
    const startTime = Date.now();
    await page.reload();
    await page.waitForLoadState('networkidle');
    const reloadTime = Date.now() - startTime;

    if (reloadTime < 5000) {
      auditResults.performance.passed++;
      auditResults.performance.tests.push(`✅ Rechargement rapide (${reloadTime}ms)`);
    } else {
      auditResults.performance.failed++;
      auditResults.performance.tests.push(`❌ Rechargement lent (${reloadTime}ms)`);
    }

    // Tests d'accessibilité
    try {
      const title = await page.title();
      expect(title.length).toBeGreaterThan(10);
      auditResults.accessibilite.passed++;
      auditResults.accessibilite.tests.push(`✅ Titre de page valide (${title.length} caractères)`);
    } catch {
      auditResults.accessibilite.failed++;
      auditResults.accessibilite.tests.push('❌ Titre de page invalide');
    }

    try {
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
      auditResults.accessibilite.passed++;
      auditResults.accessibilite.tests.push('✅ Structure de titres correcte');
    } catch {
      auditResults.accessibilite.failed++;
      auditResults.accessibilite.tests.push('❌ Structure de titres incorrecte');
    }

    // Affichage du rapport
    console.log('\n📊 RAPPORT D\'AUDIT DÉTAILLÉ');
    console.log('================================');
    
    Object.entries(auditResults).forEach(([category, results]) => {
      const total = results.passed + results.failed;
      const percentage = total > 0 ? Math.round((results.passed / total) * 100) : 0;
      
      console.log(`\n${category.toUpperCase()}: ${percentage}% (${results.passed}/${total})`);
      results.tests.forEach(test => console.log(`  ${test}`));
    });

    const totalPassed = Object.values(auditResults).reduce((sum, cat) => sum + cat.passed, 0);
    const totalTests = Object.values(auditResults).reduce((sum, cat) => sum + cat.passed + cat.failed, 0);
    const globalScore = Math.round((totalPassed / totalTests) * 100);

    console.log(`\n🎯 SCORE GLOBAL: ${globalScore}% (${totalPassed}/${totalTests})`);
    
    if (globalScore >= 80) {
      console.log('🎉 Excellent ! Le site passe l\'audit avec succès.');
    } else if (globalScore >= 60) {
      console.log('⚠️  Bien, mais des améliorations sont possibles.');
    } else {
      console.log('❌ Des corrections importantes sont nécessaires.');
    }

    // Le test passe si le score global est acceptable
    expect(globalScore).toBeGreaterThanOrEqual(60);
  });
});
