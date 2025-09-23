import { Page } from '@playwright/test';

export class AuthHelpers {
  constructor(private page: Page) {}

  async signInAsAdmin() {
    await this.page.goto('/auth');

    // Fill in admin credentials
    await this.page.fill('input[type="email"]', 'admin@ponusobuolys.lt');
    await this.page.fill('input[type="password"]', 'test-admin-password-123');

    // Click sign in button
    await this.page.click('button[type="submit"]');

    // Wait for redirect to dashboard or home
    await this.page.waitForURL('/', { timeout: 10000 });

    // Verify admin status by checking for admin navigation
    await this.page.waitForSelector('[data-testid="admin-nav"]', { timeout: 5000 });
  }

  async signInAsUser(email: string = 'user@example.com', password: string = 'test-password-123') {
    await this.page.goto('/auth');

    // Fill in user credentials
    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', password);

    // Click sign in button
    await this.page.click('button[type="submit"]');

    // Wait for redirect
    await this.page.waitForURL('/', { timeout: 10000 });
  }

  async signUp(email: string, password: string) {
    await this.page.goto('/auth');

    // Switch to sign up mode
    await this.page.click('text=Neturite paskyros?');

    // Fill in sign up form
    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', password);

    // Click sign up button
    await this.page.click('button[type="submit"]');

    // Wait for confirmation message or redirect
    await this.page.waitForSelector('text=Registracija sėkminga', { timeout: 10000 });
  }

  async signOut() {
    // Click user menu
    await this.page.click('[data-testid="user-menu"]');

    // Click sign out
    await this.page.click('text=Atsijungti');

    // Wait for redirect to home page
    await this.page.waitForURL('/', { timeout: 5000 });

    // Verify signed out state
    await this.page.waitForSelector('text=Prisijungti', { timeout: 5000 });
  }

  async isSignedIn(): Promise<boolean> {
    try {
      await this.page.waitForSelector('[data-testid="user-menu"]', { timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async isAdmin(): Promise<boolean> {
    try {
      await this.page.waitForSelector('[data-testid="admin-nav"]', { timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }
}

export class AdminHelpers extends AuthHelpers {
  async navigateToAdminDashboard() {
    if (!(await this.isAdmin())) {
      await this.signInAsAdmin();
    }

    await this.page.goto('/admin');
    await this.page.waitForSelector('text=Administravimo skydelis', { timeout: 5000 });
  }

  async createArticle(articleData: {
    title: string;
    content: string;
    excerpt: string;
    author: string;
    category: string;
  }) {
    await this.navigateToAdminDashboard();

    // Navigate to articles section
    await this.page.click('text=Straipsniai');

    // Click create new article
    await this.page.click('text=Naujas straipsnis');

    // Fill in article form
    await this.page.fill('input[name="title"]', articleData.title);
    await this.page.fill('textarea[name="excerpt"]', articleData.excerpt);
    await this.page.fill('input[name="author"]', articleData.author);
    await this.page.selectOption('select[name="category"]', articleData.category);

    // Fill in content using rich text editor
    await this.page.click('[data-testid="rich-text-editor"]');
    await this.page.fill('[data-testid="rich-text-editor"]', articleData.content);

    // Save article
    await this.page.click('button[type="submit"]');

    // Wait for success message
    await this.page.waitForSelector('text=Straipsnis sėkmingai sukurtas', { timeout: 5000 });
  }

  async createTool(toolData: {
    name: string;
    description: string;
    url: string;
    category: string;
    pricing: string;
  }) {
    await this.navigateToAdminDashboard();

    // Navigate to tools section
    await this.page.click('text=Įrankiai');

    // Click create new tool
    await this.page.click('text=Naujas įrankis');

    // Fill in tool form
    await this.page.fill('input[name="name"]', toolData.name);
    await this.page.fill('textarea[name="description"]', toolData.description);
    await this.page.fill('input[name="url"]', toolData.url);
    await this.page.selectOption('select[name="category"]', toolData.category);
    await this.page.fill('input[name="pricing"]', toolData.pricing);

    // Save tool
    await this.page.click('button[type="submit"]');

    // Wait for success message
    await this.page.waitForSelector('text=Įrankis sėkmingai sukurtas', { timeout: 5000 });
  }

  async deleteMostRecentArticle() {
    await this.navigateToAdminDashboard();

    // Navigate to articles section
    await this.page.click('text=Straipsniai');

    // Click on the first (most recent) article
    await this.page.click('[data-testid="article-item"]:first-child [data-testid="delete-button"]');

    // Confirm deletion
    await this.page.click('text=Taip, ištrinti');

    // Wait for success message
    await this.page.waitForSelector('text=Straipsnis sėkmingai ištrintas', { timeout: 5000 });
  }
}

export class NavigationHelpers {
  constructor(private page: Page) {}

  async goToHomePage() {
    await this.page.goto('/');
    await this.page.waitForSelector('text=Pono Obuolio', { timeout: 5000 });
  }

  async goToArticlesPage() {
    await this.page.goto('/articles');
    await this.page.waitForSelector('text=Straipsniai', { timeout: 5000 });
  }

  async goToToolsPage() {
    await this.page.goto('/tools');
    await this.page.waitForSelector('text=AI Įrankiai', { timeout: 5000 });
  }

  async goToCoursesPage() {
    await this.page.goto('/courses');
    await this.page.waitForSelector('text=Kursai', { timeout: 5000 });
  }

  async goToContactPage() {
    await this.page.goto('/contact');
    await this.page.waitForSelector('text=Susisiekite', { timeout: 5000 });
  }

  async searchFor(query: string) {
    // Click search button or input
    await this.page.click('[data-testid="search-input"]');
    await this.page.fill('[data-testid="search-input"]', query);
    await this.page.press('[data-testid="search-input"]', 'Enter');

    // Wait for search results
    await this.page.waitForSelector('[data-testid="search-results"]', { timeout: 5000 });
  }
}