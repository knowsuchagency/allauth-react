import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../api/client';
import { allauthQueryKeys, getAllInvalidationKeys } from '../../queryKeys';
import { useAuthTokens } from '../../api/storage';
import type { ErrorResponse, NotAuthenticatedResponse } from '../../api/types';

export interface UseLogoutResult {
  logout: () => Promise<void>;
  isLoading: boolean;
  isError: boolean;
  error: ErrorResponse | null;
  reset: () => void;
}

/**
 * Hook for user logout.
 * Clears all auth-related caches and tokens.
 */
export function useLogout(): UseLogoutResult {
  const client = getClient();
  const queryClient = useQueryClient();
  const { clearTokens } = useAuthTokens();

  const mutation = useMutation<NotAuthenticatedResponse, ErrorResponse>({
    mutationFn: () => client.logout(),
    onSuccess: () => {
      // Clear auth tokens from storage
      clearTokens();
      
      // Clear auth cache
      queryClient.setQueryData(allauthQueryKeys.authStatus(), {
        status: 401,
        data: { flows: [] },
        meta: { is_authenticated: false },
      });
      
      // Invalidate all queries
      getAllInvalidationKeys().forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });

  return {
    logout: async () => {
      await mutation.mutateAsync();
    },
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error ?? null,
    reset: mutation.reset,
  };
}