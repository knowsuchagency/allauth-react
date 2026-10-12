import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys } from '../../../queryKeys';
import type { 
  AuthenticatedResponse,
  ErrorResponse,
  WebAuthnJSON,
} from '../../../api/types';

/**
 * Mutation hook for WebAuthn reauthentication
 */
export function useWebAuthnReauthenticate(): UseMutationResult<
  AuthenticatedResponse,
  ErrorResponse,
  WebAuthnJSON | string
> {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    AuthenticatedResponse,
    ErrorResponse,
    WebAuthnJSON | string
  >({
    mutationFn: (credential) => client.webAuthnReauthenticate(credential),
    onSuccess: (data) => {
      queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.authStatus() });
    },
  });
}