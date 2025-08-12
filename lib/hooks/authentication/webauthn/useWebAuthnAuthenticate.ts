import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys, getAuthInvalidationKeys } from '../../../queryKeys';
import type { 
  AuthenticatedResponse, 
  AuthenticationResponse,
  ErrorResponse 
} from '../../../api/types';

/**
 * Mutation hook for WebAuthn authentication
 */
export function useWebAuthnAuthenticate(): UseMutationResult<
  AuthenticatedResponse | AuthenticationResponse,
  ErrorResponse,
  string
> {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    AuthenticatedResponse | AuthenticationResponse,
    ErrorResponse,
    string
  >({
    mutationFn: (credential) => client.webAuthnAuthenticate(credential),
    onSuccess: (data) => {
      if (data.status === 200) {
        queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
        queryClient.invalidateQueries({ queryKey: getAuthInvalidationKeys() });
      }
    },
  });
}