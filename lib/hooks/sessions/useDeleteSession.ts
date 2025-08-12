import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../api/client';
import { allauthQueryKeys } from '../../queryKeys';
import { useAuthTokens } from '../../api/storage';
import type { SessionsResponse, ErrorResponse } from '../../api/types';

/**
 * Mutation hook for deleting a session
 */
export function useDeleteSession() {
  const client = getClient();
  const queryClient = useQueryClient();
  const { clearTokens } = useAuthTokens();

  return useMutation<
    SessionsResponse,
    ErrorResponse,
    number | undefined
  >({
    mutationFn: (id) => client.deleteSession(id),
    onSuccess: (data, variables) => {
      if (!variables) {
        // Current session was deleted (logout)
        clearTokens();
        queryClient.setQueryData(allauthQueryKeys.authStatus(), {
          status: 401,
          data: { flows: [] },
          meta: { is_authenticated: false },
        });
        queryClient.invalidateQueries({ queryKey: allauthQueryKeys.all });
      } else {
        // Another session was deleted
        queryClient.setQueryData(allauthQueryKeys.sessions(), data);
        queryClient.invalidateQueries({ queryKey: allauthQueryKeys.sessions() });
      }
    },
  });
}