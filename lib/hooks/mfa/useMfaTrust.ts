import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../api/client';
import { allauthQueryKeys } from '../../queryKeys';
import type { AuthenticatedResponse, ErrorResponse } from '../../api/types';

/**
 * Hook for managing MFA browser trust.
 * Allows users to skip MFA on trusted browsers for a period of time.
 */
export function useMfaTrust() {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    AuthenticatedResponse,
    ErrorResponse,
    boolean
  >({
    mutationFn: (trust) => client.mfaTrust({ trust }),
    onSuccess: (data) => {
      // Update auth status
      queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
      queryClient.invalidateQueries({ 
        queryKey: allauthQueryKeys.authStatus() 
      });
    },
  });
}