import { useMemo } from 'react';
import { useAuthStatus } from './authentication/current-session/useAuthStatus';
import { useLogout } from './authentication/current-session/useLogout';
import { useLogin } from './authentication/account/useLogin';
import { useSignup } from './authentication/account/useSignup';
import type { User, LoginRequest, SignupRequest } from '../api/types';

export interface UseAuthResult {
  // Authentication state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: any;
  
  // Auth actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  signup: (credentials: SignupRequest) => Promise<void>;
  
  // Mutation states
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isSigningUp: boolean;
  
  // Mutation errors
  loginError: any;
  logoutError: any;
  signupError: any;
  
  // Utilities
  refetch: () => void;
}

/**
 * High-level authentication hook that combines auth status with common mutations.
 * Provides an intuitive API for authentication operations.
 * 
 * @example
 * ```tsx
 * const { user, isAuthenticated, login, logout } = useAuth();
 * 
 * if (!isAuthenticated) {
 *   return <LoginForm onSubmit={login} />;
 * }
 * 
 * return <Dashboard user={user} onLogout={logout} />;
 * ```
 */
export function useAuth(): UseAuthResult {
  const authQuery = useAuthStatus();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const signupMutation = useSignup();
  
  // Extract user and auth status
  const user = useMemo(() => {
    if (authQuery.data && authQuery.data.status === 200) {
      return authQuery.data.data.user;
    }
    return null;
  }, [authQuery.data]);
  
  const isAuthenticated = useMemo(() => {
    return authQuery.data?.status === 200 && authQuery.data.meta.is_authenticated;
  }, [authQuery.data]);
  
  // Wrap mutations with simpler API
  const login = async (credentials: LoginRequest) => {
    const result = await loginMutation.mutateAsync(credentials);
    // The mutation already handles cache updates
  };
  
  const logout = async () => {
    await logoutMutation.mutateAsync();
  };
  
  const signup = async (credentials: SignupRequest) => {
    const result = await signupMutation.mutateAsync(credentials);
    // The mutation already handles cache updates
  };
  
  return {
    // State
    user,
    isAuthenticated,
    isLoading: authQuery.isLoading,
    error: authQuery.error,
    
    // Actions
    login,
    logout,
    signup,
    
    // Mutation states
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isSigningUp: signupMutation.isPending,
    
    // Mutation errors
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
    signupError: signupMutation.error,
    
    // Utilities
    refetch: authQuery.refetch,
  };
}