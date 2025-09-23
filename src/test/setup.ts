import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { vi, beforeAll, afterAll, afterEach } from 'vitest';

// Polyfill'ai jsdom aplinkai
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Imituojame IntersectionObserver (naudojama LazyImage testuose)
global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: []
}));

// Imituojame ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn()
}));

// Imituojame HTMLCanvasElement.getContext (pvz., recharts grafikai)
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  writable: true,
  value: (function mockedGetContext(contextId: any, options?: any) {
    if (contextId === '2d') {
      return {
        canvas: document.createElement('canvas'),
        // Būtinos 2D konteksto savybės/metodai, kurių gali prireikti bibliotekoms
        measureText: vi.fn().mockReturnValue({ width: 0 }),
        fillRect: vi.fn(),
        clearRect: vi.fn(),
        getImageData: vi.fn().mockReturnValue({ data: [] }),
        putImageData: vi.fn(),
        createImageData: vi.fn(),
        setTransform: vi.fn(),
        drawImage: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
        beginPath: vi.fn(),
        closePath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn(),
        translate: vi.fn(),
        scale: vi.fn(),
        rotate: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        clip: vi.fn(),
        createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
        createPattern: vi.fn(),
        createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
        getContextAttributes: vi.fn().mockReturnValue({}),
        // Dažniausiai referencijuojamos CanvasRenderingContext2D savybės
        globalAlpha: 1,
        globalCompositeOperation: 'source-over',
        lineWidth: 1,
        lineCap: 'butt',
        lineJoin: 'miter',
        miterLimit: 10,
        shadowBlur: 0,
        shadowColor: 'transparent',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        strokeStyle: '#000',
        fillStyle: '#000',
        font: '',
        textAlign: 'start',
        textBaseline: 'alphabetic',
        direction: 'inherit',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'low'
      } as unknown as CanvasRenderingContext2D;
    }
    return null;
  }) as unknown as HTMLCanvasElement['getContext']
});

// Imituojame window.matchMedia (naudojama responsyviems komponentams)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Imituojame scrollTo su abiem parašais (options arba x,y)
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: ((..._args: any[]) => { /* tyčinis no-op */ }) as unknown as Window['scrollTo']
});

// Helmet susijusiems testams – neliečiame read-only document.head, tik prireikus imit. classList
if (typeof document !== 'undefined') {
  // Imituojame classList tik jei jo nėra
  if (document.head && !(document.head as any).classList) {
    Object.defineProperty(document.head, 'classList', {
      value: {
        add: vi.fn(),
        remove: vi.fn(),
        contains: vi.fn().mockReturnValue(false),
        toggle: vi.fn()
      },
      writable: true
    });
  }
}

// Imituojame Clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue('')
  }
});

// Nutildome console.error testų metu (išskyrus realias klaidas)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Create a more robust Supabase mock that works across different test scenarios
const createGlobalSupabaseMock = () => {
  const mockAuth = {
    onAuthStateChange: vi.fn((callback) => {
      // Don't auto-trigger callbacks in global setup
      return {
        data: { subscription: { unsubscribe: vi.fn() } }
      };
    }),
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    signInWithPassword: vi.fn().mockResolvedValue({
      data: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          role: 'authenticated'
        },
        session: {
          access_token: 'test-token',
          refresh_token: 'test-refresh',
          expires_in: 3600,
          token_type: 'bearer'
        }
      },
      error: null
    }),
    signUp: vi.fn().mockResolvedValue({
      data: {
        user: {
          id: 'test-user-id',
          email: 'new@example.com',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          role: 'authenticated'
        },
        session: null
      },
      error: null
    }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    updateUser: vi.fn().mockResolvedValue({
      data: { user: null },
      error: null
    })
  };

  const mockStorage = {
    from: vi.fn(() => ({
      upload: vi.fn().mockResolvedValue({ data: { path: 'test-path' }, error: null }),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'http://test-url' } }),
      remove: vi.fn().mockResolvedValue({ data: null, error: null })
    }))
  };

  const mockFrom = vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { is_admin: false }, error: null }),
    then: vi.fn().mockResolvedValue({ data: [], error: null })
  }));

  return {
    auth: mockAuth,
    storage: mockStorage,
    from: mockFrom,
    realtime: {
      channel: vi.fn(() => ({
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockResolvedValue('ok'),
        unsubscribe: vi.fn().mockResolvedValue('ok')
      }))
    }
  };
};

// Global Supabase mock
vi.mock('@/integrations/supabase/client', () => ({
  supabase: createGlobalSupabaseMock()
}));

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
});