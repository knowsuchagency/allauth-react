import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../api/client';
import { allauthQueryKeys } from '../../queryKeys';
import type { ReauthenticateRequest, AuthenticatedResponse, ErrorResponse } from '../../api/types';

/**
 * Hook for reauthentication for sensitive operations.
 */
export function useReauthenticate() {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    AuthenticatedResponse,
    ErrorResponse,
    ReauthenticateRequest
  >({
    mutationFn: (data) => client.reauthenticate(data),
    onSuccess: (data) => {
      // Update auth status
      queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.authStatus() });
    },
  });
}