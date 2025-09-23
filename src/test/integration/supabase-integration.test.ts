import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// Integration tests for Supabase operations
// These tests use a test Supabase instance and require real database setup

describe('Supabase Integration Tests', () => {
  let supabase: ReturnType<typeof createClient<Database>>;
  let testUserId: string;

  beforeEach(async () => {
    // Create test Supabase client
    // In real implementation, use test database URL and anon key
    supabase = createClient<Database>(
      process.env.VITE_SUPABASE_URL || 'http://localhost:54321',
      process.env.VITE_SUPABASE_ANON_KEY || 'test-key'
    );

    // Create test user for RLS testing
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: `test-${Date.now()}@example.com`,
      password: 'test-password-123'
    });

    if (authError) {
      throw new Error(`Failed to create test user: ${authError.message}`);
    }

    testUserId = authData.user?.id || '';
  });

  afterEach(async () => {
    // Clean up test data
    if (testUserId) {
      // Delete test user data
      await supabase.from('profiles').delete().eq('id', testUserId);
      await supabase.auth.admin.deleteUser(testUserId);
    }
  });

  describe('Articles CRUD Operations', () => {
    it('creates and retrieves articles', async () => {
      const articleData = {
        title: 'Test Article',
        content: 'Test content',
        excerpt: 'Test excerpt',
        author: 'Test Author',
        category: 'AI',
        published_at: new Date().toISOString()
      };

      // Create article
      const { data: createdArticle, error: createError } = await supabase
        .from('articles')
        .insert([articleData])
        .select()
        .single();

      expect(createError).toBeNull();
      expect(createdArticle).toBeDefined();
      expect(createdArticle?.title).toBe(articleData.title);

      // Retrieve article
      const { data: retrievedArticle, error: retrieveError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', createdArticle!.id)
        .single();

      expect(retrieveError).toBeNull();
      expect(retrievedArticle).toEqual(createdArticle);

      // Clean up
      await supabase.from('articles').delete().eq('id', createdArticle!.id);
    });

    it('updates articles correctly', async () => {
      // Create test article
      const { data: article, error: createError } = await supabase
        .from('articles')
        .insert([{
          title: 'Original Title',
          content: 'Original content',
          excerpt: 'Original excerpt',
          author: 'Test Author',
          category: 'AI'
        }])
        .select()
        .single();

      expect(createError).toBeNull();

      // Update article
      const updatedData = {
        title: 'Updated Title',
        content: 'Updated content'
      };

      const { data: updatedArticle, error: updateError } = await supabase
        .from('articles')
        .update(updatedData)
        .eq('id', article!.id)
        .select()
        .single();

      expect(updateError).toBeNull();
      expect(updatedArticle?.title).toBe(updatedData.title);
      expect(updatedArticle?.content).toBe(updatedData.content);

      // Clean up
      await supabase.from('articles').delete().eq('id', article!.id);
    });

    it('deletes articles correctly', async () => {
      // Create test article
      const { data: article, error: createError } = await supabase
        .from('articles')
        .insert([{
          title: 'Test Article to Delete',
          content: 'Test content',
          excerpt: 'Test excerpt',
          author: 'Test Author',
          category: 'AI'
        }])
        .select()
        .single();

      expect(createError).toBeNull();

      // Delete article
      const { error: deleteError } = await supabase
        .from('articles')
        .delete()
        .eq('id', article!.id);

      expect(deleteError).toBeNull();

      // Verify deletion
      const { data: retrievedArticle, error: retrieveError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', article!.id)
        .single();

      expect(retrievedArticle).toBeNull();
      expect(retrieveError?.code).toBe('PGRST116'); // No rows returned
    });
  });

  describe('Tools CRUD Operations', () => {
    it('creates and retrieves tools', async () => {
      const toolData = {
        name: 'Test Tool',
        description: 'Test tool description',
        url: 'https://example.com',
        category: 'AI Tool',
        pricing: 'Free'
      };

      const { data: createdTool, error: createError } = await supabase
        .from('tools')
        .insert([toolData])
        .select()
        .single();

      expect(createError).toBeNull();
      expect(createdTool?.name).toBe(toolData.name);

      // Clean up
      await supabase.from('tools').delete().eq('id', createdTool!.id);
    });
  });

  describe('Courses CRUD Operations', () => {
    it('creates and retrieves courses', async () => {
      const courseData = {
        title: 'Test Course',
        description: 'Test course description',
        content: 'Test course content',
        duration: '2 hours',
        difficulty: 'Beginner',
        price: 0,
        published: true,
        category: 'AI Basics'
      };

      const { data: createdCourse, error: createError } = await supabase
        .from('courses')
        .insert([courseData])
        .select()
        .single();

      expect(createError).toBeNull();
      expect(createdCourse?.title).toBe(courseData.title);

      // Clean up
      await supabase.from('courses').delete().eq('id', createdCourse!.id);
    });
  });

  describe('Contact Messages', () => {
    it('creates contact messages', async () => {
      const messageData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message content'
      };

      const { data: createdMessage, error: createError } = await supabase
        .from('contact_messages')
        .insert([messageData])
        .select()
        .single();

      expect(createError).toBeNull();
      expect(createdMessage?.name).toBe(messageData.name);

      // Clean up
      await supabase.from('contact_messages').delete().eq('id', createdMessage!.id);
    });
  });

  describe('RLS (Row Level Security) Tests', () => {
    it('enforces RLS policies for authenticated users', async () => {
      // Sign in as test user
      await supabase.auth.signInWithPassword({
        email: `test-${testUserId}@example.com`,
        password: 'test-password-123'
      });

      // Test that user can read public data
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .limit(1);

      expect(articlesError).toBeNull();
      expect(Array.isArray(articles)).toBe(true);

      // Test that user can read tools
      const { data: tools, error: toolsError } = await supabase
        .from('tools')
        .select('*')
        .limit(1);

      expect(toolsError).toBeNull();
      expect(Array.isArray(tools)).toBe(true);
    });

    it('prevents unauthorized access to admin functions', async () => {
      // Sign out to test anonymous access
      await supabase.auth.signOut();

      // Try to create article (should fail for non-admin)
      const { data, error } = await supabase
        .from('articles')
        .insert([{
          title: 'Unauthorized Article',
          content: 'Should not be created',
          excerpt: 'Test',
          author: 'Unauthorized',
          category: 'AI'
        }]);

      // Should fail due to RLS policy
      expect(error).toBeDefined();
      expect(data).toBeNull();
    });
  });

  describe('Storage Operations', () => {
    it('uploads and retrieves files', async () => {
      const fileName = `test-${Date.now()}.txt`;
      const fileContent = 'Test file content';
      const file = new Blob([fileContent], { type: 'text/plain' });

      // Upload file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      expect(uploadError).toBeNull();
      expect(uploadData?.path).toBe(fileName);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      expect(urlData.publicUrl).toContain(fileName);

      // Clean up
      await supabase.storage.from('images').remove([fileName]);
    });

    it('handles file upload errors gracefully', async () => {
      // Try to upload to non-existent bucket
      const { data, error } = await supabase.storage
        .from('non-existent-bucket')
        .upload('test.txt', new Blob(['test']));

      expect(error).toBeDefined();
      expect(data).toBeNull();
    });
  });

  describe('Real-time Subscriptions', () => {
    it('receives real-time updates', async () => {
      const updates: any[] = [];

      // Set up subscription
      const channel = supabase
        .channel('test-channel')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'articles'
        }, (payload) => {
          updates.push(payload);
        })
        .subscribe();

      // Wait for subscription to be ready
      await new Promise(resolve => setTimeout(resolve, 100));

      // Insert a new article
      const { data: article } = await supabase
        .from('articles')
        .insert([{
          title: 'Real-time Test Article',
          content: 'Test content',
          excerpt: 'Test excerpt',
          author: 'Test Author',
          category: 'AI'
        }])
        .select()
        .single();

      // Wait for real-time update
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(updates.length).toBeGreaterThan(0);
      expect(updates[0].new.title).toBe('Real-time Test Article');

      // Clean up
      await supabase.removeChannel(channel);
      if (article) {
        await supabase.from('articles').delete().eq('id', article.id);
      }
    });
  });

  describe('Performance and Pagination', () => {
    it('handles large result sets with pagination', async () => {
      // Test pagination
      const { data: page1, error: page1Error } = await supabase
        .from('articles')
        .select('*')
        .range(0, 9)
        .order('created_at', { ascending: false });

      expect(page1Error).toBeNull();
      expect(Array.isArray(page1)).toBe(true);

      const { data: page2, error: page2Error } = await supabase
        .from('articles')
        .select('*')
        .range(10, 19)
        .order('created_at', { ascending: false });

      expect(page2Error).toBeNull();
      expect(Array.isArray(page2)).toBe(true);
    });

    it('handles complex queries efficiently', async () => {
      const startTime = Date.now();

      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          profiles:author(first_name, last_name)
        `)
        .eq('category', 'AI')
        .order('published_at', { ascending: false })
        .limit(10);

      const endTime = Date.now();
      const queryTime = endTime - startTime;

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
      expect(queryTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});

// Helper function to check if integration tests should run
export const shouldRunIntegrationTests = () => {
  return process.env.NODE_ENV === 'test' &&
         process.env.INTEGRATION_TESTS === 'true' &&
         process.env.VITE_SUPABASE_URL &&
         process.env.VITE_SUPABASE_ANON_KEY;
};

// Conditional test runner
if (!shouldRunIntegrationTests()) {
  describe.skip('Supabase Integration Tests', () => {
    it.skip('Integration tests skipped - missing environment variables', () => {
      console.log('Skipping integration tests. Set INTEGRATION_TESTS=true and provide Supabase credentials to run.');
    });
  });
}