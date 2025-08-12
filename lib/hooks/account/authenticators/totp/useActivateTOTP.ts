import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../../../api/client';
import { allauthQueryKeys } from '../../../../queryKeys';
import type { 
  TOTPAuthenticatorResponse,
  TOTPActivateRequest,
  ErrorResponse 
} from '../../../../api/types';

/**
 * Mutation hook for activating TOTP
 */
export function useActivateTOTP() {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    TOTPAuthenticatorResponse,
    ErrorResponse,
    TOTPActivateRequest
  >({
    mutationFn: (data) => client.activateTOTP(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.authenticators() });
    },
  });
}