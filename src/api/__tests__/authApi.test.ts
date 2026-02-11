/**
 * Unit tests for AuthApi with Supabase mocking
 */

import { AuthApi } from '../authApi';
import { SupabaseClient, User, Session } from '@supabase/supabase-js';

// Mock user and session data
const mockUser: User = {
  id: 'user-123',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2026-02-11T10:00:00Z',
} as User;

const mockSession: Session = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: mockUser,
} as Session;

// Mock Supabase client
const createMockSupabaseClient = () => {
  const mockSignUp = jest.fn();
  const mockSignInWithPassword = jest.fn();
  const mockSignOut = jest.fn();
  const mockGetUser = jest.fn();
  const mockGetSession = jest.fn();
  const mockResetPasswordForEmail = jest.fn();
  const mockUpdateUser = jest.fn();

  const mockAuth = {
    signUp: mockSignUp,
    signInWithPassword: mockSignInWithPassword,
    signOut: mockSignOut,
    getUser: mockGetUser,
    getSession: mockGetSession,
    resetPasswordForEmail: mockResetPasswordForEmail,
    updateUser: mockUpdateUser,
  };

  const mockSupabase = {
    auth: mockAuth,
  } as unknown as SupabaseClient;

  return {
    mockSupabase,
    mockAuth,
    mockSignUp,
    mockSignInWithPassword,
    mockSignOut,
    mockGetUser,
    mockGetSession,
    mockResetPasswordForEmail,
    mockUpdateUser,
  };
};

describe('AuthApi', () => {
  let authApi: AuthApi;
  let mocks: ReturnType<typeof createMockSupabaseClient>;

  beforeEach(() => {
    mocks = createMockSupabaseClient();
    authApi = new AuthApi(mocks.mockSupabase);
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should sign up a new user successfully', async () => {
      const input = { email: 'test@example.com', password: 'password123' };
      mocks.mockSignUp.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const result = await authApi.signUp(input);

      expect(mocks.mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.user).toEqual(mockUser);
      expect(result.session).toEqual(mockSession);
    });

    it('should throw error when sign up fails', async () => {
      const input = { email: 'test@example.com', password: 'weak' };
      const mockError = { message: 'Password too weak' };
      mocks.mockSignUp.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      });

      await expect(authApi.signUp(input)).rejects.toThrow('Password too weak');
    });

    it('should throw error for duplicate email', async () => {
      const input = { email: 'existing@example.com', password: 'password123' };
      const mockError = { message: 'User already registered' };
      mocks.mockSignUp.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      });

      await expect(authApi.signUp(input)).rejects.toThrow('User already registered');
    });
  });

  describe('signIn', () => {
    it('should sign in user successfully', async () => {
      const input = { email: 'test@example.com', password: 'password123' };
      mocks.mockSignInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const result = await authApi.signIn(input);

      expect(mocks.mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.user).toEqual(mockUser);
      expect(result.session).toEqual(mockSession);
    });

    it('should throw error for invalid credentials', async () => {
      const input = { email: 'test@example.com', password: 'wrongpassword' };
      const mockError = { message: 'Invalid login credentials' };
      mocks.mockSignInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      });

      await expect(authApi.signIn(input)).rejects.toThrow('Invalid login credentials');
    });

    it('should throw error for non-existent user', async () => {
      const input = { email: 'nonexistent@example.com', password: 'password123' };
      const mockError = { message: 'Invalid login credentials' };
      mocks.mockSignInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      });

      await expect(authApi.signIn(input)).rejects.toThrow('Invalid login credentials');
    });
  });

  describe('signOut', () => {
    it('should sign out user successfully', async () => {
      mocks.mockSignOut.mockResolvedValue({ error: null });

      await authApi.signOut();

      expect(mocks.mockSignOut).toHaveBeenCalled();
    });

    it('should throw error when sign out fails', async () => {
      const mockError = { message: 'Sign out failed' };
      mocks.mockSignOut.mockResolvedValue({ error: mockError });

      await expect(authApi.signOut()).rejects.toThrow('Sign out failed');
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      mocks.mockGetUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await authApi.getCurrentUser();

      expect(mocks.mockGetUser).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should return null when no user is logged in', async () => {
      mocks.mockGetUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await authApi.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should throw error when getting user fails', async () => {
      const mockError = { message: 'Failed to get user' };
      mocks.mockGetUser.mockResolvedValue({
        data: { user: null },
        error: mockError,
      });

      await expect(authApi.getCurrentUser()).rejects.toThrow('Failed to get user');
    });
  });

  describe('getCurrentSession', () => {
    it('should get current session successfully', async () => {
      mocks.mockGetSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const result = await authApi.getCurrentSession();

      expect(mocks.mockGetSession).toHaveBeenCalled();
      expect(result).toEqual(mockSession);
    });

    it('should return null when no session exists', async () => {
      mocks.mockGetSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const result = await authApi.getCurrentSession();

      expect(result).toBeNull();
    });

    it('should throw error when getting session fails', async () => {
      const mockError = { message: 'Failed to get session' };
      mocks.mockGetSession.mockResolvedValue({
        data: { session: null },
        error: mockError,
      });

      await expect(authApi.getCurrentSession()).rejects.toThrow('Failed to get session');
    });
  });

  describe('resetPassword', () => {
    it('should send password reset email successfully', async () => {
      mocks.mockResetPasswordForEmail.mockResolvedValue({ error: null });

      await authApi.resetPassword('test@example.com');

      expect(mocks.mockResetPasswordForEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should throw error when reset fails', async () => {
      const mockError = { message: 'Failed to send reset email' };
      mocks.mockResetPasswordForEmail.mockResolvedValue({ error: mockError });

      await expect(authApi.resetPassword('test@example.com')).rejects.toThrow('Failed to send reset email');
    });
  });

  describe('updatePassword', () => {
    it('should update password successfully', async () => {
      mocks.mockUpdateUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      await authApi.updatePassword('newpassword123');

      expect(mocks.mockUpdateUser).toHaveBeenCalledWith({
        password: 'newpassword123',
      });
    });

    it('should throw error when password update fails', async () => {
      const mockError = { message: 'Failed to update password' };
      mocks.mockUpdateUser.mockResolvedValue({
        data: { user: null },
        error: mockError,
      });

      await expect(authApi.updatePassword('newpassword123')).rejects.toThrow('Failed to update password');
    });
  });
});
