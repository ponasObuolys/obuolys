import { vi } from 'vitest';
import type { User, Session } from '@supabase/supabase-js';

// Mock data generators for Supabase types
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'test-user-id',
  app_metadata: {},
  user_metadata: {
    name: 'Test User',
    email: 'test@example.com'
  },
  aud: 'authenticated',
  confirmation_sent_at: new Date().toISOString(),
  recovery_sent_at: new Date().toISOString(),
  email_change_sent_at: new Date().toISOString(),
  new_email: undefined,
  new_phone: undefined,
  invited_at: undefined,
  action_link: undefined,
  email: 'test@example.com',
  phone: undefined,
  created_at: new Date().toISOString(),
  confirmed_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString(),
  phone_confirmed_at: undefined,
  last_sign_in_at: new Date().toISOString(),
  role: 'authenticated',
  updated_at: new Date().toISOString(),
  identities: [],
  is_anonymous: false,
  factors: [],
  ...overrides
});

export const createMockSession = (user?: User): Session => ({
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: 'bearer',
  user: user || createMockUser()
});

// Mock Supabase client builder with fluent API
export class MockSupabaseQueryBuilder {
  private _data: any[] = [];
  private _error: any = null;
  private _count: number | null = null;

  constructor(data: any[] = [], error: any = null) {
    this._data = data;
    this._error = error;
  }

  // Query methods
  select = vi.fn().mockReturnThis();
  insert = vi.fn().mockReturnThis();
  update = vi.fn().mockReturnThis();
  delete = vi.fn().mockReturnThis();
  upsert = vi.fn().mockReturnThis();

  // Filter methods
  eq = vi.fn().mockReturnThis();
  neq = vi.fn().mockReturnThis();
  gt = vi.fn().mockReturnThis();
  gte = vi.fn().mockReturnThis();
  lt = vi.fn().mockReturnThis();
  lte = vi.fn().mockReturnThis();
  like = vi.fn().mockReturnThis();
  ilike = vi.fn().mockReturnThis();
  is = vi.fn().mockReturnThis();
  in = vi.fn().mockReturnThis();
  not = vi.fn().mockReturnThis();
  or = vi.fn().mockReturnThis();
  and = vi.fn().mockReturnThis();
  textSearch = vi.fn().mockReturnThis();
  match = vi.fn().mockReturnThis();

  // Modifier methods
  order = vi.fn().mockReturnThis();
  limit = vi.fn().mockReturnThis();
  range = vi.fn().mockReturnThis();
  abortSignal = vi.fn().mockReturnThis();

  // Execution methods
  single = vi.fn().mockResolvedValue({
    data: this._data[0] || null,
    error: this._error
  });

  maybeSingle = vi.fn().mockResolvedValue({
    data: this._data[0] || null,
    error: this._error
  });

  then = vi.fn().mockImplementation((resolve) => {
    const result = {
      data: this._data,
      error: this._error,
      count: this._count,
      status: this._error ? 400 : 200,
      statusText: this._error ? 'Bad Request' : 'OK'
    };
    return Promise.resolve(result).then(resolve);
  });

  // Helper methods to configure mock behavior
  mockData(data: any[]) {
    this._data = data;
    return this;
  }

  mockError(error: any) {
    this._error = error;
    return this;
  }

  mockCount(count: number) {
    this._count = count;
    return this;
  }
}

// Mock Supabase client
export const createMockSupabaseClient = (config: {
  user?: User | null;
  session?: Session | null;
  authError?: any;
  queryData?: any[];
  queryError?: any;
} = {}) => {
  const {
    user = null,
    session = null,
    authError = null,
    queryData = [],
    queryError = null
  } = config;

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user },
        error: authError
      }),
      getSession: vi.fn().mockResolvedValue({
        data: { session },
        error: authError
      }),
      signUp: vi.fn().mockResolvedValue({
        data: { user, session },
        error: authError
      }),
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user, session },
        error: authError
      }),
      signInWithOAuth: vi.fn().mockResolvedValue({
        data: { provider: 'google', url: 'https://accounts.google.com/oauth' },
        error: authError
      }),
      signOut: vi.fn().mockResolvedValue({
        error: authError
      }),
      resetPasswordForEmail: vi.fn().mockResolvedValue({
        data: {},
        error: authError
      }),
      updateUser: vi.fn().mockResolvedValue({
        data: { user },
        error: authError
      }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      })
    },
    from: vi.fn(() => new MockSupabaseQueryBuilder(queryData, queryError)),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({
          data: { path: 'test-path', id: 'test-id', fullPath: 'test/test-path' },
          error: null
        }),
        download: vi.fn().mockResolvedValue({
          data: new Blob(['test content'], { type: 'text/plain' }),
          error: null
        }),
        remove: vi.fn().mockResolvedValue({
          data: [{ name: 'test-file.jpg', id: 'test-id' }],
          error: null
        }),
        list: vi.fn().mockResolvedValue({
          data: [{ name: 'test-file.jpg', id: 'test-id', updated_at: new Date().toISOString() }],
          error: null
        }),
        createSignedUrl: vi.fn().mockResolvedValue({
          data: { signedUrl: 'https://example.com/signed-url' },
          error: null
        }),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/public-url' }
        }),
        move: vi.fn().mockResolvedValue({
          data: { message: 'Successfully moved' },
          error: null
        }),
        copy: vi.fn().mockResolvedValue({
          data: { path: 'copied-path' },
          error: null
        })
      }))
    },
    realtime: {
      channel: vi.fn(() => ({
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockResolvedValue('ok'),
        unsubscribe: vi.fn().mockResolvedValue('ok'),
        send: vi.fn().mockResolvedValue('ok')
      })),
      removeChannel: vi.fn(),
      removeAllChannels: vi.fn(),
      getChannels: vi.fn().mockReturnValue([])
    },
    rpc: vi.fn().mockResolvedValue({
      data: null,
      error: null
    })
  };
};

// Database table test data factories
export const createMockProfile = (overrides = {}) => ({
  id: 'test-profile-id',
  first_name: 'Test',
  last_name: 'User',
  email: 'test@example.com',
  role: 'user',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});

export const createMockArticle = (overrides = {}) => ({
  id: 'test-article-id',
  title: 'Test Article',
  content: 'Test article content',
  excerpt: 'Test excerpt',
  author: 'Test Author',
  image_url: 'https://example.com/article.jpg',
  published_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  category: 'AI',
  tags: ['test', 'ai'],
  slug: 'test-article',
  meta_description: 'Test meta description',
  ...overrides
});

export const createMockTool = (overrides = {}) => ({
  id: 'test-tool-id',
  name: 'Test Tool',
  description: 'Test tool description',
  url: 'https://example.com/tool',
  category: 'AI Tool',
  image_url: 'https://example.com/tool.jpg',
  pricing: 'Free',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  tags: ['ai', 'productivity'],
  featured: false,
  ...overrides
});

export const createMockCourse = (overrides = {}) => ({
  id: 'test-course-id',
  title: 'Test Course',
  description: 'Test course description',
  content: 'Test course content',
  image_url: 'https://example.com/course.jpg',
  duration: '2 hours',
  difficulty: 'Beginner',
  price: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  published: true,
  category: 'AI Basics',
  instructor: 'Test Instructor',
  ...overrides
});

export const createMockContactMessage = (overrides = {}) => ({
  id: 'test-message-id',
  name: 'Test User',
  email: 'test@example.com',
  subject: 'Test Subject',
  message: 'Test message content',
  created_at: new Date().toISOString(),
  read: false,
  ...overrides
});

// Error factories for testing error states
export const createSupabaseError = (message: string, code?: string) => ({
  message,
  code: code || 'PGRST116',
  details: null,
  hint: null
});

export const createAuthError = (message: string, status?: number) => ({
  message,
  status: status || 400,
  code: undefined
});

// Test helpers for async operations
export const waitFor = (condition: () => boolean, timeout = 1000): Promise<void> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for condition'));
      } else {
        setTimeout(check, 10);
      }
    };
    check();
  });
};

// Helper to create mock RLS context
export const createMockRLSContext = (userId: string, isAdmin = false) => ({
  user_id: userId,
  role: isAdmin ? 'admin' : 'user',
  email: 'test@example.com'
});