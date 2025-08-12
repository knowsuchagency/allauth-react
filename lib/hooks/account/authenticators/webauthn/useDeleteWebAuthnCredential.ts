import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../../../api/client';
import { allauthQueryKeys } from '../../../../queryKeys';
import type { 
  AuthenticatorsResponse,
  ErrorResponse 
} from '../../../../api/types';

/**
 * Mutation hook for deleting a WebAuthn credential
 */
export function useDeleteWebAuthnCredential() {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    AuthenticatorsResponse,
    ErrorResponse,
    string
  >({
    mutationFn: (id) => client.deleteWebAuthnCredential(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.webauthn() });
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.authenticators() });
    },
  });
}