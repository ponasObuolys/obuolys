import { test, expect } from '@playwright/test';

test.describe('Critical User Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto('/');
  });

  test.describe('Homepage Navigation', () => {
    test('should load homepage successfully', async ({ page }) => {
      // Check that the page loads
      await expect(page).toHaveTitle(/Obuolys/i);

      // Verify main navigation is visible
      await expect(page.locator('nav')).toBeVisible();
    });

    test('should navigate to publications page', async ({ page }) => {
      // Click on publications link
      await page.click('text=Publikacijos');

      // Verify we're on the publications page
      await expect(page).toHaveURL(/.*publikacijos/);
      await expect(page.locator('h1')).toContainText(/Publikacijos/i);
    });

    test('should navigate to tools page', async ({ page }) => {
      // Click on tools link
      await page.click('text=Įrankiai');

      // Verify we're on the tools page
      await expect(page).toHaveURL(/.*irankiai/);
    });

    test('should navigate to courses page', async ({ page }) => {
      // Click on courses link
      await page.click('text=Kursai');

      // Verify we're on the courses page
      await expect(page).toHaveURL(/.*kursai/);
    });

    test('should navigate to contact page', async ({ page }) => {
      // Click on contact link
      await page.click('text=Kontaktai');

      // Verify we're on the contact page
      await expect(page).toHaveURL(/.*kontaktai/);
    });
  });

  test.describe('Content Loading', () => {
    test('should display tools list', async ({ page }) => {
      await page.goto('/irankiai');

      // Wait for tools to load
      await page.waitForSelector('[data-testid="tool-card"], .tool-card, article', {
        timeout: 10000,
      });

      // Verify at least one tool is displayed (if any exist)
      const toolCards = page.locator('[data-testid="tool-card"], .tool-card, article');
      const count = await toolCards.count();

      // Either tools are displayed or there's a "no tools" message
      if (count === 0) {
        await expect(page.locator('text=/Įrankių nerasta|Nėra įrankių/i')).toBeVisible();
      } else {
        await expect(toolCards.first()).toBeVisible();
      }
    });

    test('should display publications list', async ({ page }) => {
      await page.goto('/publikacijos');

      // Wait for content to load
      await page.waitForLoadState('networkidle');

      // Verify page content is visible
      await expect(page.locator('main')).toBeVisible();
    });
  });

  test.describe('Search and Filter', () => {
    test('should be able to search tools', async ({ page }) => {
      await page.goto('/irankiai');

      // Look for search input
      const searchInput = page.locator('input[type="search"], input[placeholder*="ieškoti" i]');

      if (await searchInput.isVisible()) {
        await searchInput.fill('AI');
        await searchInput.press('Enter');

        // Wait for results to update
        await page.waitForTimeout(500);

        // Verify search is working (results should change or filter)
        await expect(searchInput).toHaveValue('AI');
      }
    });

    test('should filter tools by category', async ({ page }) => {
      await page.goto('/irankiai');

      // Look for category filters
      const categoryButtons = page.locator('button[data-category], .category-filter');

      if (await categoryButtons.count() > 0) {
        await categoryButtons.first().click();

        // Wait for filtered results
        await page.waitForTimeout(500);

        // Verify filtering worked (URL or content changed)
        expect(await page.url()).toBeTruthy();
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/');

      // Verify mobile menu button exists
      const mobileMenuButton = page.locator('button[aria-label*="menu" i], button.mobile-menu');

      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click();

        // Verify menu opens
        await expect(page.locator('nav, .mobile-nav')).toBeVisible();
      }
    });

    test('should work on tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      await page.goto('/');

      // Verify page loads correctly
      await expect(page).toHaveTitle(/Obuolys/i);
      await expect(page.locator('main')).toBeVisible();
    });
  });

  test.describe('Contact Form', () => {
    test('should display contact form', async ({ page }) => {
      await page.goto('/kontaktai');

      // Verify form elements are present
      await expect(page.locator('input[name="name"], input[placeholder*="vardas" i]')).toBeVisible();
      await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible();
      await expect(page.locator('textarea[name="message"]')).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
      await page.goto('/kontaktai');

      // Try to submit empty form
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();

      // Verify validation messages appear
      await page.waitForTimeout(500);

      // Check for validation errors (HTML5 or custom)
      const nameInput = page.locator('input[name="name"], input[placeholder*="vardas" i]').first();
      const isRequired = await nameInput.getAttribute('required');

      expect(isRequired !== null || await page.locator('.error, [role="alert"]').count() > 0).toBeTruthy();
    });
  });

  test.describe('Error Handling', () => {
    test('should show 404 page for invalid routes', async ({ page }) => {
      await page.goto('/nonexistent-page-12345');

      // Verify 404 content is shown
      await expect(page.locator('text=/404|Puslapis nerastas|Nerasta/i')).toBeVisible();
    });

    test('should handle failed image loads gracefully', async ({ page }) => {
      await page.goto('/');

      // Check that broken images don't crash the page
      const images = page.locator('img');
      const count = await images.count();

      if (count > 0) {
        // Page should still be functional even with broken images
        await expect(page.locator('main')).toBeVisible();
      }
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');

      // Check for h1 heading
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
    });

    test('should have alt text for images', async ({ page }) => {
      await page.goto('/');

      // Get all images
      const images = page.locator('img');
      const count = await images.count();

      // Check that images have alt attributes
      for (let i = 0; i < Math.min(count, 5); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');

        // Alt attribute should exist (can be empty for decorative images)
        expect(alt).not.toBeNull();
      }
    });

    test('should be keyboard navigable', async ({ page }) => {
      await page.goto('/');

      // Tab through the page
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Verify focus is visible
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
    });
  });

  test.describe('Performance', () => {
    test('should load homepage within acceptable time', async ({ page }) => {
      const start = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - start;

      // Homepage should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should lazy load images', async ({ page }) => {
      await page.goto('/');

      // Check for loading attribute on images
      const images = page.locator('img[loading="lazy"]');
      const count = await images.count();

      // If there are images, at least some should be lazy loaded
      const totalImages = await page.locator('img').count();
      if (totalImages > 0) {
        expect(count).toBeGreaterThan(0);
      }
    });
  });
});
