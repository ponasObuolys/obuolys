import { chromium, FullConfig } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting E2E test global setup...');

  // Initialize Supabase client for test data setup
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL || '',
    process.env.VITE_SUPABASE_ANON_KEY || ''
  );

  try {
    // Create test admin user if it doesn't exist
    const testAdminEmail = 'admin@ponusobuolys.lt';
    const testAdminPassword = 'test-admin-password-123';

    const { data: existingUser, error: getUserError } = await supabase.auth.admin.getUserByEmail(testAdminEmail);

    if (!existingUser.user) {
      console.log('Creating test admin user...');
      const { data: newUser, error: createUserError } = await supabase.auth.admin.createUser({
        email: testAdminEmail,
        password: testAdminPassword,
        email_confirm: true
      });

      if (createUserError) {
        console.warn('Could not create test admin user:', createUserError.message);
      } else {
        console.log('✅ Test admin user created successfully');
      }
    } else {
      console.log('✅ Test admin user already exists');
    }

    // Create test data for E2E tests
    await setupTestData(supabase);

    console.log('✅ Global setup completed successfully');

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    // Don't fail the tests if setup fails - they should be resilient
  }
}

async function setupTestData(supabase: any) {
  console.log('Setting up test data...');

  // Create test articles
  const testArticles = [
    {
      title: 'E2E Test Article 1',
      content: 'This is a test article for E2E testing',
      excerpt: 'Test excerpt 1',
      author: 'Test Author',
      category: 'AI',
      published_at: new Date().toISOString(),
      slug: 'e2e-test-article-1'
    },
    {
      title: 'E2E Test Article 2',
      content: 'This is another test article for E2E testing',
      excerpt: 'Test excerpt 2',
      author: 'Test Author',
      category: 'Tech',
      published_at: new Date().toISOString(),
      slug: 'e2e-test-article-2'
    }
  ];

  // Insert test articles (ignore conflicts)
  for (const article of testArticles) {
    await supabase
      .from('articles')
      .upsert(article, { onConflict: 'slug' })
      .select();
  }

  // Create test tools
  const testTools = [
    {
      name: 'E2E Test Tool 1',
      description: 'Test tool for E2E testing',
      url: 'https://example.com/tool1',
      category: 'AI Tool',
      pricing: 'Free',
      tags: ['test', 'ai']
    },
    {
      name: 'E2E Test Tool 2',
      description: 'Another test tool for E2E testing',
      url: 'https://example.com/tool2',
      category: 'Productivity',
      pricing: 'Paid',
      tags: ['test', 'productivity']
    }
  ];

  // Insert test tools
  for (const tool of testTools) {
    await supabase
      .from('tools')
      .upsert(tool, { onConflict: 'name' })
      .select();
  }

  // Create test courses
  const testCourses = [
    {
      title: 'E2E Test Course 1',
      description: 'Test course for E2E testing',
      content: 'Course content for testing',
      duration: '1 hour',
      difficulty: 'Beginner',
      price: 0,
      published: true,
      category: 'AI Basics'
    }
  ];

  // Insert test courses
  for (const course of testCourses) {
    await supabase
      .from('courses')
      .upsert(course, { onConflict: 'title' })
      .select();
  }

  console.log('✅ Test data setup completed');
}

export default globalSetup;