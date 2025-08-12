import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys, getAuthInvalidationKeys } from '../../../queryKeys';
import type { 
  AuthenticatedResponse, 
  AuthenticationResponse,
  PhoneVerificationRequest,
  ErrorResponse 
} from '../../../api/types';

/**
 * Mutation hook for verifying phone number
 */
export function useVerifyPhone(): UseMutationResult<
  AuthenticatedResponse | AuthenticationResponse,
  ErrorResponse,
  PhoneVerificationRequest
> {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    AuthenticatedResponse | AuthenticationResponse,
    ErrorResponse,
    PhoneVerificationRequest
  >({
    mutationFn: (data) => client.verifyPhone(data),
    onSuccess: (data) => {
      if (data.status === 200) {
        queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
        queryClient.invalidateQueries({ queryKey: getAuthInvalidationKeys() });
      }
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.phoneNumber() });
    },
  });
}