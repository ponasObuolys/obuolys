import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { createMockSupabaseClient, createMockUser, createMockSession } from '@/test/utils/supabase-test-utils';

// Mock Supabase client
const mockSupabaseClient = createMockSupabaseClient();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseClient
}));

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('initializes with loading state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.isAdmin).toBe(false);
  });

  it('loads user session on mount', async () => {
    const mockUser = createMockUser({ id: 'test-user' });
    const mockSession = createMockSession(mockUser);

    mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
      data: { session: mockSession },
      error: null
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(mockSupabaseClient.auth.getSession).toHaveBeenCalled();
  });

  it('handles sign in successfully', async () => {
    const mockUser = createMockUser({ email: 'test@example.com' });
    const mockSession = createMockSession(mockUser);

    mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: mockUser, session: mockSession },
      error: null
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn('test@example.com', 'password123');
    });

    expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it('handles sign in error', async () => {
    const authError = { message: 'Invalid credentials' };

    mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: authError
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await expect(
      act(async () => {
        await result.current.signIn('test@example.com', 'wrongpassword');
      })
    ).rejects.toThrow('Invalid credentials');

    expect(result.current.user).toBeNull();
  });

  it('handles sign up successfully', async () => {
    const mockUser = createMockUser({ email: 'new@example.com' });

    mockSupabaseClient.auth.signUp.mockResolvedValueOnce({
      data: { user: mockUser, session: null },
      error: null
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signUp('new@example.com', 'password123');
    });

    expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'password123'
    });
  });

  it('handles sign up error', async () => {
    const authError = { message: 'Email already registered' };

    mockSupabaseClient.auth.signUp.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: authError
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await expect(
      act(async () => {
        await result.current.signUp('existing@example.com', 'password123');
      })
    ).rejects.toThrow('Email already registered');
  });

  it('handles sign out successfully', async () => {
    const mockUser = createMockUser();

    // Set up initial authenticated state
    mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
      data: { session: createMockSession(mockUser) },
      error: null
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });

    // Mock sign out
    mockSupabaseClient.auth.signOut.mockResolvedValueOnce({
      error: null
    });

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
  });

  it('determines admin status correctly', async () => {
    const adminUser = createMockUser({
      email: 'admin@ponusobuolys.lt'
    });
    const mockSession = createMockSession(adminUser);

    mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
      data: { session: mockSession },
      error: null
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isAdmin).toBe(true);
    });
  });

  it('determines non-admin status correctly', async () => {
    const regularUser = createMockUser({
      email: 'user@example.com'
    });
    const mockSession = createMockSession(regularUser);

    mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
      data: { session: mockSession },
      error: null
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isAdmin).toBe(false);
    });
  });

  it('handles auth state changes', async () => {
    let authStateChangeCallback: (event: any, session: any) => void;

    mockSupabaseClient.auth.onAuthStateChange.mockImplementation((callback) => {
      authStateChangeCallback = callback;
      return {
        data: { subscription: { unsubscribe: vi.fn() } }
      };
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    const newUser = createMockUser({ email: 'changed@example.com' });
    const newSession = createMockSession(newUser);

    // Simulate auth state change
    act(() => {
      authStateChangeCallback('SIGNED_IN', newSession);
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(newUser);
      expect(result.current.loading).toBe(false);
    });

    // Simulate sign out
    act(() => {
      authStateChangeCallback('SIGNED_OUT', null);
    });

    await waitFor(() => {
      expect(result.current.user).toBeNull();
    });
  });

  it('cleans up auth state listener on unmount', () => {
    const mockUnsubscribe = vi.fn();
    mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } }
    });

    const { unmount } = renderHook(() => useAuth(), { wrapper });

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('throws error when useAuth is used outside AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
  });
});