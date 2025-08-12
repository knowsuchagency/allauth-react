import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys, getAuthInvalidationKeys } from '../../../queryKeys';
import type { 
  AuthenticatedResponse, 
  AuthenticationResponse,
  WebAuthnLoginRequest,
  ErrorResponse 
} from '../../../api/types';

/**
 * Mutation hook for WebAuthn login
 */
export function useWebAuthnLogin(): UseMutationResult<
  AuthenticatedResponse | AuthenticationResponse,
  ErrorResponse,
  WebAuthnLoginRequest
> {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    AuthenticatedResponse | AuthenticationResponse,
    ErrorResponse,
    WebAuthnLoginRequest
  >({
    mutationFn: (data) => client.webAuthnLogin(data),
    onSuccess: (data) => {
      if (data.status === 200) {
        queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
        queryClient.invalidateQueries({ queryKey: getAuthInvalidationKeys() });
      }
    },
  });
}