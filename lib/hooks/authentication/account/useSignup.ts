import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys, getAuthInvalidationKeys } from '../../../queryKeys';
import type { 
  AuthenticatedResponse, 
  AuthenticationResponse,
  SignupRequest,
  ErrorResponse 
} from '../../../api/types';

/**
 * Mutation hook for signing up new users
 */
export function useSignup(): UseMutationResult<
  AuthenticatedResponse | AuthenticationResponse,
  ErrorResponse,
  SignupRequest
> {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    AuthenticatedResponse | AuthenticationResponse,
    ErrorResponse,
    SignupRequest
  >({
    mutationFn: (data) => client.signup(data),
    onSuccess: (data) => {
      if (data.status === 200) {
        queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
        queryClient.invalidateQueries({ queryKey: getAuthInvalidationKeys() });
      } else if (data.status === 401) {
        // Not an error: another step is pending (e.g. mfa_authenticate or
        // verify_email). The session endpoint would return this same payload,
        // so store it to expose the pending flow through the auth status.
        queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
      }
    },
  });
}