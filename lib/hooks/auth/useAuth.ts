import { useQuery } from '@tanstack/react-query';
import { getClient } from '../../api/client';
import { allauthQueryKeys } from '../../queryKeys';
import type { User, AuthenticatedResponse, NotAuthenticatedResponse } from '../../api/types';

export interface UseAuthResult {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  error: any;
  refetch: () => void;
}

/**
 * Hook to get the current authentication status.
 * Automatically refetches when the window regains focus.
 */
export function useAuth(): UseAuthResult {
  const client = getClient();

  const query = useQuery<AuthenticatedResponse | NotAuthenticatedResponse>({
    queryKey: allauthQueryKeys.authStatus(),
    queryFn: () => client.getAuthenticationStatus(),
    staleTime: 1000 * 60 * 2, // Consider auth data stale after 2 minutes
    refetchOnWindowFocus: true,
  });

  const user = query.data && 'data' in query.data && query.data.status === 200
    ? query.data.data.user
    : null;
  const isAuthenticated = Boolean(user);

  return {
    user,
    isAuthenticated,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}