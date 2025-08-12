import { useMutation, useQueryClient } from '@tanstack/react-query';
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
export function useSignup() {
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
      }
    },
  });
}