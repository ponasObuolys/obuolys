import { FullConfig } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting E2E test global teardown...');

  // Initialize Supabase client for cleanup
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL || '',
    process.env.VITE_SUPABASE_ANON_KEY || ''
  );

  try {
    // Clean up test data
    await cleanupTestData(supabase);

    console.log('✅ Global teardown completed successfully');

  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't fail if cleanup fails
  }
}

async function cleanupTestData(supabase: any) {
  console.log('Cleaning up test data...');

  // Clean up test articles
  await supabase
    .from('articles')
    .delete()
    .like('title', 'E2E Test%');

  // Clean up test tools
  await supabase
    .from('tools')
    .delete()
    .like('name', 'E2E Test%');

  // Clean up test courses
  await supabase
    .from('courses')
    .delete()
    .like('title', 'E2E Test%');

  // Clean up test contact messages
  await supabase
    .from('contact_messages')
    .delete()
    .like('subject', 'E2E Test%');

  console.log('✅ Test data cleanup completed');
}

export default globalTeardown;