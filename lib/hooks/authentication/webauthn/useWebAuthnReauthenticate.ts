import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys } from '../../../queryKeys';
import type { 
  AuthenticatedResponse,
  ErrorResponse 
} from '../../../api/types';

/**
 * Mutation hook for WebAuthn reauthentication
 */
export function useWebAuthnReauthenticate() {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    AuthenticatedResponse,
    ErrorResponse,
    string
  >({
    mutationFn: (credential) => client.webAuthnReauthenticate(credential),
    onSuccess: (data) => {
      queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.authStatus() });
    },
  });
}