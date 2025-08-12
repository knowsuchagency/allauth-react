import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../api/client';
import { allauthQueryKeys } from '../../queryKeys';
import { useAuthTokens } from '../../api/storage';
import type { Session, SessionsResponse, ErrorResponse } from '../../api/types';

export interface UseSessionsResult {
  sessions: Session[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  end: (sessionId?: number) => Promise<void>;
  endCurrent: () => Promise<void>;
  isEnding: boolean;
  refetch: () => void;
}

/**
 * Hook for managing user sessions.
 * Provides methods to list and delete sessions.
 */
export function useSessions(): UseSessionsResult {
  const client = getClient();
  const queryClient = useQueryClient();
  const { clearTokens } = useAuthTokens();

  const query = useQuery<SessionsResponse>({
    queryKey: allauthQueryKeys.sessions(),
    queryFn: () => client.listSessions(),
  });

  const deleteSession = useMutation<
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

  return {
    sessions: query.data?.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    end: async (sessionId?: number) => {
      await deleteSession.mutateAsync(sessionId);
    },
    endCurrent: async () => {
      await deleteSession.mutateAsync(undefined);
    },
    isEnding: deleteSession.isPending,
    refetch: query.refetch,
  };
}