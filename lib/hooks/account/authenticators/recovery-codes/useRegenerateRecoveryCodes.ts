import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../../../api/client';
import { allauthQueryKeys } from '../../../../queryKeys';
import type { 
  SensitiveRecoveryCodesAuthenticatorResponse,
  ErrorResponse 
} from '../../../../api/types';

/**
 * Mutation hook for regenerating recovery codes
 */
export function useRegenerateRecoveryCodes() {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    SensitiveRecoveryCodesAuthenticatorResponse,
    ErrorResponse,
    void
  >({
    mutationFn: () => client.regenerateRecoveryCodes(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.authenticators() });
    },
  });
}