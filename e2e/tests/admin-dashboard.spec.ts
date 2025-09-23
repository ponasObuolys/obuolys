import { test, expect } from '@playwright/test';
import { AdminHelpers } from '../utils/auth-helpers';

test.describe('Admin Dashboard', () => {
  let adminHelpers: AdminHelpers;

  test.beforeEach(async ({ page }) => {
    adminHelpers = new AdminHelpers(page);
  });

  test('admin can access dashboard', async ({ page }) => {
    await adminHelpers.signInAsAdmin();
    await adminHelpers.navigateToAdminDashboard();

    // Verify dashboard elements are present
    await expect(page.locator('text=Administravimo skydelis')).toBeVisible();
    await expect(page.locator('text=Statistikos')).toBeVisible();
    await expect(page.locator('text=Straipsniai')).toBeVisible();
    await expect(page.locator('text=Įrankiai')).toBeVisible();
    await expect(page.locator('text=Kursai')).toBeVisible();
  });

  test('admin can create a new article', async ({ page }) => {
    const articleData = {
      title: 'E2E Test Article - ' + Date.now(),
      content: 'This is test content for the E2E test article. It contains multiple paragraphs and demonstrates the rich text editing capabilities.',
      excerpt: 'Test excerpt for E2E article',
      author: 'E2E Test Author',
      category: 'AI'
    };

    await adminHelpers.createArticle(articleData);

    // Verify article was created by checking the articles list
    await page.click('text=Straipsniai');
    await expect(page.locator(`text=${articleData.title}`)).toBeVisible();
  });

  test('admin can edit an existing article', async ({ page }) => {
    await adminHelpers.navigateToAdminDashboard();
    await page.click('text=Straipsniai');

    // Click edit on the first article
    await page.click('[data-testid="article-item"]:first-child [data-testid="edit-button"]');

    // Update the title
    const newTitle = 'Updated E2E Test Article - ' + Date.now();
    await page.fill('input[name="title"]', newTitle);

    // Save changes
    await page.click('button[type="submit"]');

    // Verify success message
    await expect(page.locator('text=Straipsnis sėkmingai atnaujintas')).toBeVisible();

    // Verify the updated title appears in the list
    await page.click('text=Straipsniai');
    await expect(page.locator(`text=${newTitle}`)).toBeVisible();
  });

  test('admin can create a new tool', async ({ page }) => {
    const toolData = {
      name: 'E2E Test Tool - ' + Date.now(),
      description: 'This is a test tool created during E2E testing',
      url: 'https://example.com/test-tool',
      category: 'AI Tool',
      pricing: 'Free'
    };

    await adminHelpers.createTool(toolData);

    // Verify tool was created
    await page.click('text=Įrankiai');
    await expect(page.locator(`text=${toolData.name}`)).toBeVisible();
  });

  test('admin can upload and manage images', async ({ page }) => {
    await adminHelpers.navigateToAdminDashboard();
    await page.click('text=Straipsniai');
    await page.click('text=Naujas straipsnis');

    // Test file upload component
    const fileUploadInput = page.locator('input[type="file"]');
    await expect(fileUploadInput).toBeVisible();

    // Create a test file (mock image)
    const testImageBuffer = Buffer.from('test image content');

    // Upload file
    await fileUploadInput.setInputFiles({
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: testImageBuffer
    });

    // Wait for upload to complete
    await expect(page.locator('text=Paveikslėlis įkeltas')).toBeVisible({ timeout: 10000 });

    // Verify image preview appears
    await expect(page.locator('[data-testid="image-preview"]')).toBeVisible();
  });

  test('admin can manage contact messages', async ({ page }) => {
    await adminHelpers.navigateToAdminDashboard();

    // Navigate to contact messages
    await page.click('text=Žinutės');

    // Verify contact messages list is visible
    await expect(page.locator('text=Kontaktinės žinutės')).toBeVisible();

    // Check if there are any messages and mark one as read
    const messageCount = await page.locator('[data-testid="contact-message"]').count();

    if (messageCount > 0) {
      // Click on first message
      await page.click('[data-testid="contact-message"]:first-child');

      // Mark as read
      await page.click('text=Pažymėti kaip perskaitytą');

      // Verify message status changed
      await expect(page.locator('text=Žinutė pažymėta kaip perskaityta')).toBeVisible();
    }
  });

  test('admin dashboard shows statistics correctly', async ({ page }) => {
    await adminHelpers.navigateToAdminDashboard();

    // Check that statistics are displayed
    await expect(page.locator('[data-testid="stats-articles"]')).toBeVisible();
    await expect(page.locator('[data-testid="stats-tools"]')).toBeVisible();
    await expect(page.locator('[data-testid="stats-courses"]')).toBeVisible();
    await expect(page.locator('[data-testid="stats-messages"]')).toBeVisible();

    // Verify statistics contain numbers
    const articleCount = await page.locator('[data-testid="stats-articles"] .stat-number').textContent();
    const toolCount = await page.locator('[data-testid="stats-tools"] .stat-number').textContent();

    expect(articleCount).toMatch(/^\d+$/);
    expect(toolCount).toMatch(/^\d+$/);
  });

  test('admin can delete content with confirmation', async ({ page }) => {
    // First create a test article to delete
    const articleData = {
      title: 'Article to Delete - ' + Date.now(),
      content: 'This article will be deleted',
      excerpt: 'Delete test',
      author: 'Test Author',
      category: 'AI'
    };

    await adminHelpers.createArticle(articleData);

    // Navigate back to articles list
    await page.click('text=Straipsniai');

    // Find and delete the created article
    await page.click(`text=${articleData.title}`);
    await page.click('[data-testid="delete-button"]');

    // Verify confirmation dialog appears
    await expect(page.locator('text=Ar tikrai norite ištrinti')).toBeVisible();

    // Confirm deletion
    await page.click('text=Taip, ištrinti');

    // Verify deletion success
    await expect(page.locator('text=Straipsnis sėkmingai ištrintas')).toBeVisible();

    // Verify article no longer appears in list
    await expect(page.locator(`text=${articleData.title}`)).not.toBeVisible();
  });

  test('admin can preview content before publishing', async ({ page }) => {
    await adminHelpers.navigateToAdminDashboard();
    await page.click('text=Straipsniai');
    await page.click('text=Naujas straipsnis');

    // Fill in article form
    await page.fill('input[name="title"]', 'Preview Test Article');
    await page.fill('textarea[name="excerpt"]', 'Preview excerpt');
    await page.fill('input[name="author"]', 'Preview Author');

    // Click preview button instead of save
    await page.click('text=Peržiūrėti');

    // Verify preview modal/page opens
    await expect(page.locator('[data-testid="preview-modal"]')).toBeVisible();
    await expect(page.locator('text=Preview Test Article')).toBeVisible();

    // Close preview
    await page.click('[data-testid="close-preview"]');

    // Verify we're back to the edit form
    await expect(page.locator('input[name="title"]')).toHaveValue('Preview Test Article');
  });

  test('admin dashboard is responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await adminHelpers.signInAsAdmin();
    await adminHelpers.navigateToAdminDashboard();

    // Verify mobile menu works
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

    // Verify navigation items are accessible
    await expect(page.locator('text=Straipsniai')).toBeVisible();
    await expect(page.locator('text=Įrankiai')).toBeVisible();

    // Test navigation on mobile
    await page.click('text=Straipsniai');
    await expect(page.locator('text=Straipsnių sąrašas')).toBeVisible();
  });
});