import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../../../api/client';
import { allauthQueryKeys } from '../../../../queryKeys';
import type { ErrorResponse } from '../../../../api/types';

/**
 * Mutation hook for deactivating TOTP
 */
export function useDeactivateTOTP() {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    { status: 200 },
    ErrorResponse,
    void
  >({
    mutationFn: () => client.deactivateTOTP(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.authenticators() });
    },
  });
}