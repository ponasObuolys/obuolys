import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import {
  createMockSupabaseClient,
  createMockUser,
  createMockSession,
  MockSupabaseQueryBuilder,
} from "@/test/utils/supabase-test-utils";

// Create stable mock that persists across tests
const mockSupabaseClient = createMockSupabaseClient();

// Mock the toast hook
vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
}));

// Mock the Supabase client module with persistent mock
vi.mock("@/integrations/supabase/client", () => ({
  supabase: mockSupabaseClient,
}));

// Import components after mocks are set up
const { AuthProvider, useAuth } = await import("@/context/AuthContext");

describe("AuthContext", () => {
  beforeEach(() => {
    // Reset auth state change callback to prevent cross-test interference
    mockSupabaseClient.auth.onAuthStateChange.mockImplementation(_callback => {
      // Store callback for potential use
      return {
        data: { subscription: { unsubscribe: vi.fn() } },
      };
    });

    // Reset session mock to return null by default
    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    // Clear profiles query mock
    mockSupabaseClient.from.mockReturnValue(new MockSupabaseQueryBuilder([{ is_admin: false }]));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it("initializes with loading state", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.isAdmin).toBe(false);
  });

  it("loads user session on mount", async () => {
    const mockUser = createMockUser({ id: "test-user" });
    const mockSession = createMockSession(mockUser);

    mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
      data: { session: mockSession },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(mockSupabaseClient.auth.getSession).toHaveBeenCalled();
  });

  it("handles sign in successfully", async () => {
    const mockUser = createMockUser({ email: "test@example.com" });
    const mockSession = createMockSession(mockUser);

    let authStateChangeCallback: (event: any, session: any) => void;
    mockSupabaseClient.auth.onAuthStateChange.mockImplementation(callback => {
      authStateChangeCallback = callback;
      return {
        data: { subscription: { unsubscribe: vi.fn() } },
      };
    });

    mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    // Mock the profiles query
    mockSupabaseClient.from.mockReturnValue(new MockSupabaseQueryBuilder([{ is_admin: false }]));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn("test@example.com", "password123");
      // Simulate the auth state change that would happen after successful sign in
      authStateChangeCallback("SIGNED_IN", mockSession);
    });

    expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it("handles sign in error", async () => {
    const authError = { message: "Invalid credentials" };

    mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: authError,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await expect(
      act(async () => {
        await result.current.signIn("test@example.com", "wrongpassword");
      })
    ).rejects.toThrow("Invalid credentials");

    expect(result.current.user).toBeNull();
  });

  it("handles sign up successfully", async () => {
    const mockUser = createMockUser({ email: "new@example.com" });

    mockSupabaseClient.auth.signUp.mockResolvedValueOnce({
      data: { user: mockUser, session: null },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signUp("new@example.com", "password123", "testuser");
    });

    expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
      email: "new@example.com",
      password: "password123",
      options: {
        data: {
          username: "testuser",
        },
      },
    });
  });

  it("handles sign up error", async () => {
    const authError = { message: "Email already registered" };

    mockSupabaseClient.auth.signUp.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: authError,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await expect(
      act(async () => {
        await result.current.signUp("existing@example.com", "password123", "testuser");
      })
    ).rejects.toThrow("Email already registered");
  });

  it("handles Google sign in successfully", async () => {
    mockSupabaseClient.auth.signInWithOAuth.mockResolvedValueOnce({
      data: { provider: "google", url: "https://accounts.google.com/..." },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signInWithGoogle();
    });

    expect(mockSupabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  });

  it("handles Google sign in error", async () => {
    const authError = { message: "OAuth provider error" };

    mockSupabaseClient.auth.signInWithOAuth.mockResolvedValueOnce({
      data: { provider: null, url: null },
      error: authError,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await expect(
      act(async () => {
        await result.current.signInWithGoogle();
      })
    ).rejects.toThrow("OAuth provider error");
  });

  it("handles sign out successfully", async () => {
    const mockUser = createMockUser();
    let authStateChangeCallback: (event: any, session: any) => void;

    mockSupabaseClient.auth.onAuthStateChange.mockImplementation(callback => {
      authStateChangeCallback = callback;
      return {
        data: { subscription: { unsubscribe: vi.fn() } },
      };
    });

    // Set up initial authenticated state
    mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
      data: { session: createMockSession(mockUser) },
      error: null,
    });

    // Mock the profiles query
    mockSupabaseClient.from.mockReturnValue(new MockSupabaseQueryBuilder([{ is_admin: false }]));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });

    // Mock sign out
    mockSupabaseClient.auth.signOut.mockResolvedValueOnce({
      error: null,
    });

    await act(async () => {
      await result.current.signOut();
      // Simulate the auth state change that would happen after sign out
      authStateChangeCallback("SIGNED_OUT", null);
    });

    expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();

    await waitFor(() => {
      expect(result.current.user).toBeNull();
    });
  });

  it("determines admin status correctly", async () => {
    const adminUser = createMockUser({
      email: "admin@ponusobuolys.lt",
    });
    const mockSession = createMockSession(adminUser);

    mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
      data: { session: mockSession },
      error: null,
    });

    // Mock the profiles query to return admin status
    mockSupabaseClient.from.mockReturnValue(new MockSupabaseQueryBuilder([{ is_admin: true }]));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isAdmin).toBe(true);
    });
  });

  it("determines non-admin status correctly", async () => {
    const regularUser = createMockUser({
      email: "user@example.com",
    });
    const mockSession = createMockSession(regularUser);

    mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
      data: { session: mockSession },
      error: null,
    });

    // Mock the profiles query to return non-admin status
    mockSupabaseClient.from.mockReturnValue(new MockSupabaseQueryBuilder([{ is_admin: false }]));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isAdmin).toBe(false);
    });
  });

  it("handles auth state changes", async () => {
    let authStateChangeCallback: (event: any, session: any) => void;

    mockSupabaseClient.auth.onAuthStateChange.mockImplementation(callback => {
      authStateChangeCallback = callback;
      return {
        data: { subscription: { unsubscribe: vi.fn() } },
      };
    });

    // Mock the profiles query
    mockSupabaseClient.from.mockReturnValue(new MockSupabaseQueryBuilder([{ is_admin: false }]));

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newUser = createMockUser({
      id: "test-user-id",
      email: "changed@example.com",
      user_metadata: { email: "changed@example.com" },
    });
    const newSession = createMockSession(newUser);

    // Simulate auth state change with proper timing
    await act(async () => {
      if (authStateChangeCallback) {
        authStateChangeCallback("SIGNED_IN", newSession);
      }
      // Allow for async state updates
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    await waitFor(
      () => {
        expect(result.current.user).toEqual(newUser);
      },
      { timeout: 2000 }
    );

    // Simulate sign out
    await act(async () => {
      if (authStateChangeCallback) {
        authStateChangeCallback("SIGNED_OUT", null);
      }
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    await waitFor(
      () => {
        expect(result.current.user).toBeNull();
      },
      { timeout: 2000 }
    );
  });

  it("cleans up auth state listener on unmount", () => {
    const mockUnsubscribe = vi.fn();
    mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });

    const { unmount } = renderHook(() => useAuth(), { wrapper });

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it("throws error when useAuth is used outside AuthProvider", () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow("useAuth must be used within an AuthProvider");
  });
});
