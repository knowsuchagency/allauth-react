import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys, getAuthInvalidationKeys } from '../../../queryKeys';
import type { 
  AuthenticatedResponse, 
  AuthenticationResponse,
  WebAuthnSignupRequest,
  ErrorResponse 
} from '../../../api/types';

/**
 * Mutation hook for WebAuthn signup
 */
export function useWebAuthnSignup() {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    AuthenticatedResponse | AuthenticationResponse,
    ErrorResponse,
    WebAuthnSignupRequest
  >({
    mutationFn: (data) => client.webAuthnSignup(data),
    onSuccess: (data) => {
      if (data.status === 200) {
        queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
        queryClient.invalidateQueries({ queryKey: getAuthInvalidationKeys() });
      }
    },
  });
}