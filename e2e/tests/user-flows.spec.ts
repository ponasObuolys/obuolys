import { test, expect } from '@playwright/test';
import { AuthHelpers, NavigationHelpers } from '../utils/auth-helpers';

test.describe('User Flows', () => {
  let authHelpers: AuthHelpers;
  let navHelpers: NavigationHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    navHelpers = new NavigationHelpers(page);
  });

  test('user can browse homepage and navigate to different sections', async ({ page }) => {
    await navHelpers.goToHomePage();

    // Verify homepage sections are visible
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="featured-articles"]')).toBeVisible();
    await expect(page.locator('[data-testid="ai-tools"]')).toBeVisible();
    await expect(page.locator('[data-testid="courses"]')).toBeVisible();

    // Test navigation to articles
    await page.click('text=Skaityti daugiau straipsnių');
    await expect(page).toHaveURL(/.*\/articles/);

    // Navigate back and test tools section
    await navHelpers.goToHomePage();
    await page.click('text=Peržiūrėti visus įrankius');
    await expect(page).toHaveURL(/.*\/tools/);

    // Navigate to courses
    await navHelpers.goToHomePage();
    await page.click('text=Žiūrėti visus kursus');
    await expect(page).toHaveURL(/.*\/courses/);
  });

  test('user can read articles and navigate between them', async ({ page }) => {
    await navHelpers.goToArticlesPage();

    // Verify articles are displayed
    await expect(page.locator('[data-testid="article-card"]')).toHaveCount.greaterThan(0);

    // Click on first article
    await page.click('[data-testid="article-card"]:first-child a');

    // Verify article detail page
    await expect(page.locator('[data-testid="article-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="article-content"]')).toBeVisible();
    await expect(page.locator('[data-testid="article-author"]')).toBeVisible();

    // Test sharing functionality
    await page.click('[data-testid="share-button"]');
    await expect(page.locator('[data-testid="share-options"]')).toBeVisible();

    // Test navigation to related articles
    const relatedArticles = page.locator('[data-testid="related-articles"] [data-testid="article-card"]');
    const relatedCount = await relatedArticles.count();

    if (relatedCount > 0) {
      await relatedArticles.first().click();
      await expect(page.locator('[data-testid="article-title"]')).toBeVisible();
    }
  });

  test('user can browse and filter AI tools', async ({ page }) => {
    await navHelpers.goToToolsPage();

    // Verify tools are displayed
    await expect(page.locator('[data-testid="tool-card"]')).toHaveCount.greaterThan(0);

    // Test category filtering
    await page.click('[data-testid="category-filter"]');
    await page.click('text=AI Tool');

    // Verify filtered results
    await expect(page.locator('[data-testid="tool-card"]')).toHaveCount.greaterThan(0);

    // Test search functionality
    await page.fill('[data-testid="search-input"]', 'test');
    await page.press('[data-testid="search-input"]', 'Enter');

    // Wait for search results
    await page.waitForTimeout(1000);

    // Test tool detail view
    await page.click('[data-testid="tool-card"]:first-child');
    await expect(page.locator('[data-testid="tool-detail"]')).toBeVisible();
    await expect(page.locator('[data-testid="tool-description"]')).toBeVisible();
    await expect(page.locator('[data-testid="tool-url"]')).toBeVisible();
  });

  test('user can browse courses and view course details', async ({ page }) => {
    await navHelpers.goToCoursesPage();

    // Verify courses are displayed
    await expect(page.locator('[data-testid="course-card"]')).toHaveCount.greaterThan(0);

    // Test course filtering by difficulty
    await page.click('[data-testid="difficulty-filter"]');
    await page.click('text=Beginner');

    // Click on first course
    await page.click('[data-testid="course-card"]:first-child a');

    // Verify course detail page
    await expect(page.locator('[data-testid="course-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="course-description"]')).toBeVisible();
    await expect(page.locator('[data-testid="course-duration"]')).toBeVisible();
    await expect(page.locator('[data-testid="course-difficulty"]')).toBeVisible();

    // Test course content sections
    await expect(page.locator('[data-testid="course-content"]')).toBeVisible();
  });

  test('user can submit contact form', async ({ page }) => {
    await navHelpers.goToContactPage();

    // Fill in contact form
    await page.fill('input[name="name"]', 'E2E Test User');
    await page.fill('input[name="email"]', 'e2etest@example.com');
    await page.fill('input[name="subject"]', 'E2E Test Subject - ' + Date.now());
    await page.fill('textarea[name="message"]', 'This is a test message from E2E testing. Please ignore.');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify success message
    await expect(page.locator('text=Žinutė sėkmingai išsiųsta')).toBeVisible({ timeout: 10000 });

    // Verify form is reset
    await expect(page.locator('input[name="name"]')).toHaveValue('');
    await expect(page.locator('input[name="email"]')).toHaveValue('');
  });

  test('user can sign up and sign in', async ({ page }) => {
    const testEmail = `e2etest${Date.now()}@example.com`;
    const testPassword = 'testpassword123';

    // Test sign up
    await authHelpers.signUp(testEmail, testPassword);

    // Test sign in with new account
    await authHelpers.signInAsUser(testEmail, testPassword);

    // Verify signed in state
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();

    // Test sign out
    await authHelpers.signOut();

    // Verify signed out state
    await expect(page.locator('text=Prisijungti')).toBeVisible();
  });

  test('user can search across the site', async ({ page }) => {
    await navHelpers.goToHomePage();

    // Test global search
    await navHelpers.searchFor('AI');

    // Verify search results page
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
    await expect(page.locator('[data-testid="search-result-item"]')).toHaveCount.greaterThan(0);

    // Test different content types in results
    await expect(page.locator('text=Straipsniai')).toBeVisible();
    await expect(page.locator('text=Įrankiai')).toBeVisible();

    // Test clicking on search result
    await page.click('[data-testid="search-result-item"]:first-child a');

    // Should navigate to the selected content
    await expect(page).toHaveURL(/.*\/(articles|tools|courses)\/.*/);
  });

  test('site is responsive across different viewports', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 }, // iPhone SE
      { width: 768, height: 1024 }, // iPad
      { width: 1920, height: 1080 } // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await navHelpers.goToHomePage();

      // Verify key elements are visible and functional
      await expect(page.locator('[data-testid="header"]')).toBeVisible();
      await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();

      if (viewport.width < 768) {
        // Mobile menu should be present
        await page.click('[data-testid="mobile-menu-button"]');
        await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
      } else {
        // Desktop navigation should be visible
        await expect(page.locator('[data-testid="desktop-nav"]')).toBeVisible();
      }

      // Test navigation works in this viewport
      await navHelpers.goToArticlesPage();
      await expect(page.locator('[data-testid="article-card"]')).toBeVisible();
    }
  });

  test('site loads quickly and performs well', async ({ page }) => {
    // Measure page load time
    const startTime = Date.now();
    await navHelpers.goToHomePage();
    const loadTime = Date.now() - startTime;

    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);

    // Test lazy loading of images
    const images = page.locator('img[data-src]');
    const imageCount = await images.count();

    if (imageCount > 0) {
      // Scroll to trigger lazy loading
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      // Wait for images to load
      await page.waitForTimeout(2000);

      // Check that images have loaded
      const loadedImages = page.locator('img[src]:not([src=""])');
      const loadedCount = await loadedImages.count();

      expect(loadedCount).toBeGreaterThan(0);
    }
  });

  test('accessibility features work correctly', async ({ page }) => {
    await navHelpers.goToHomePage();

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Verify focus is managed correctly
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Test skip links
    await page.keyboard.press('Tab');
    const skipLink = page.locator('[data-testid="skip-link"]');
    if (await skipLink.isVisible()) {
      await skipLink.click();
      // Should jump to main content
      await expect(page.locator('main')).toBeFocused();
    }

    // Test alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const image = images.nth(i);
      const altText = await image.getAttribute('alt');
      expect(altText).toBeTruthy();
    }
  });
});