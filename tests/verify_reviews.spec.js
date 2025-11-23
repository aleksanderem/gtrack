import { test, expect } from '@playwright/test';

test('Verify Reviews Acquisition Panel Structure', async ({ page }) => {
  // 1. Navigate to app
  await page.goto('/');

  // 2. Navigate to Reviews (Opinie)
  // Menu structure might require waiting
  await page.waitForLoadState('networkidle');
  
  // Try to find "Opinie" directly first (if top level) or via "Zarządzanie"
  const managementMenu = page.getByText('Zarządzanie');
  
  // Check if we need to click it
  if (await managementMenu.isVisible()) {
      await managementMenu.click();
  }
  
  await page.getByText('Opinie').click();

  // 3. Verify Reviews Dashboard loaded
  await expect(page.getByText('Opinie Klientów')).toBeVisible();
  
  // 4. Verify Toolbar Navigation
  await expect(page.getByRole('button', { name: 'Przegląd' })).toBeVisible();
  const acquisitionTab = page.getByRole('button', { name: 'Pozyskiwanie Opinii' });
  await expect(acquisitionTab).toBeVisible();
  
  // 5. Go to Acquisition Tab
  await acquisitionTab.click();
  
  // 6. Verify Acquisition Panel Tabs (Preview/Settings)
  // PrimeVue Tabs structure usually uses role="tab"
  await expect(page.getByRole('tab', { name: 'Podgląd' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Ustawienia Grafiki' })).toBeVisible();
  
  // 7. Verify Preview Tab Content (Default)
  // Should see the poster preview and download buttons
  await expect(page.getByRole('button', { name: 'Pobierz PDF (A4)' })).toBeVisible();
  // Check for "Oceń nas!" (default poster headline)
  await expect(page.getByText('Oceń nas!', { exact: false })).toBeVisible();
  // Check for "TWOJA FIRMA" (default business name)
  await expect(page.getByText('TWOJA FIRMA')).toBeVisible();
  
  // 8. Switch to Settings Tab
  await page.getByRole('tab', { name: 'Ustawienia Grafiki' }).click();
  
  // 9. Verify Form Fields (Labels are reliable)
  // Using getByText for labels as getByLabel might depend on for/id association which I added but let's be safe
  await expect(page.getByText('Nagłówek na plakacie')).toBeVisible();
  await expect(page.getByText('Nazwa Twojej Firmy')).toBeVisible();
  await expect(page.getByText('Format & Styl')).toBeVisible();
  
  // 10. Verify QR Config
  await expect(page.getByText('Kolor QR')).toBeVisible();
  await expect(page.getByText('Styl Narożników')).toBeVisible();
  
  console.log('Verification successful!');
});
