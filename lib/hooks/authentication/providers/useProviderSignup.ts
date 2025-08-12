import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys, getAuthInvalidationKeys } from '../../../queryKeys';
import type { 
  AuthenticatedResponse, 
  AuthenticationResponse,
  ProviderSignupRequest,
  ErrorResponse 
} from '../../../api/types';

/**
 * Mutation hook for completing provider signup
 */
export function useProviderSignup() {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    AuthenticatedResponse | AuthenticationResponse,
    ErrorResponse,
    ProviderSignupRequest
  >({
    mutationFn: (data) => client.providerSignup(data),
    onSuccess: (data) => {
      if (data.status === 200) {
        queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
        queryClient.invalidateQueries({ queryKey: getAuthInvalidationKeys() });
      }
    },
  });
}