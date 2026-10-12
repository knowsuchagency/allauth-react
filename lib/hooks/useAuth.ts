import { useMemo } from 'react';
import { useAuthStatus } from './authentication/current-session/useAuthStatus';
import { useLogout } from './authentication/current-session/useLogout';
import { useLogin } from './authentication/account/useLogin';
import { useSignup } from './authentication/account/useSignup';
import type {
  User,
  Flow,
  LoginRequest,
  SignupRequest,
  AuthenticatedResponse,
  AuthenticationResponse,
  ErrorResponse,
} from '../api/types';

export interface UseAuthResult {
  // Authentication state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: any;

  /**
   * Flows reported by the latest authentication response (auth status,
   * login or signup). Empty when authenticated without pending steps.
   */
  flows: Flow[];
  /**
   * The flow that must be completed next, if any. For example, after a
   * password login on an account with 2FA, this is
   * `{ id: "mfa_authenticate", is_pending: true, types: [...] }`.
   * django-allauth signals this with a 401 response that has no `errors`,
   * so it is not surfaced as `loginError`.
   */
  pendingFlow: Flow | null;

  // Auth actions. They resolve with the server's response (a 200 when
  // authenticated, a 401 with `flows` when another step is pending) and
  // reject with an ErrorResponse on invalid input.
  login: (credentials: LoginRequest) => Promise<AuthenticatedResponse | AuthenticationResponse>;
  logout: () => Promise<void>;
  signup: (credentials: SignupRequest) => Promise<AuthenticatedResponse | AuthenticationResponse>;

  // Mutation states
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isSigningUp: boolean;

  // Mutation errors
  loginError: ErrorResponse | null;
  logoutError: any;
  signupError: ErrorResponse | null;

  // Utilities
  refetch: () => void;
}

/**
 * High-level authentication hook that combines auth status with common mutations.
 * Provides an intuitive API for authentication operations.
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, pendingFlow, login, logout } = useAuth();
 *
 * if (pendingFlow?.id === 'mfa_authenticate') {
 *   return <TwoFactorForm types={pendingFlow.types} />;
 * }
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

  const flows = useMemo<Flow[]>(() => {
    return authQuery.data?.data?.flows ?? [];
  }, [authQuery.data]);

  const pendingFlow = useMemo<Flow | null>(() => {
    return flows.find((flow) => flow.is_pending) ?? null;
  }, [flows]);

  // Wrap mutations with simpler API. The mutations update the auth status
  // cache themselves (on success and on pending flows).
  const login = (credentials: LoginRequest) => loginMutation.mutateAsync(credentials);

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const signup = (credentials: SignupRequest) => signupMutation.mutateAsync(credentials);

  return {
    // State
    user,
    isAuthenticated,
    isLoading: authQuery.isLoading,
    error: authQuery.error,
    flows,
    pendingFlow,

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
