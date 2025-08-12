import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys, getAuthInvalidationKeys } from '../../../queryKeys';
import type { 
  AuthenticatedResponse, 
  AuthenticationResponse,
  EmailVerificationRequest,
  ErrorResponse 
} from '../../../api/types';

/**
 * Mutation hook for verifying email address
 */
export function useVerifyEmail() {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    AuthenticatedResponse | AuthenticationResponse,
    ErrorResponse,
    EmailVerificationRequest
  >({
    mutationFn: (data) => client.verifyEmail(data),
    onSuccess: (data) => {
      if (data.status === 200) {
        queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
        queryClient.invalidateQueries({ queryKey: getAuthInvalidationKeys() });
      }
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.emailAddresses() });
    },
  });
}