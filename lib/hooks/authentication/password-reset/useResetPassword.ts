import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys } from '../../../queryKeys';
import type { 
  AuthenticatedResponse, 
  AuthenticationResponse,
  PasswordResetConfirmRequest,
  ErrorResponse 
} from '../../../api/types';

/**
 * Mutation hook for resetting password with key
 */
export function useResetPassword(): UseMutationResult<
  AuthenticatedResponse | AuthenticationResponse,
  ErrorResponse,
  PasswordResetConfirmRequest
> {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    AuthenticatedResponse | AuthenticationResponse,
    ErrorResponse,
    PasswordResetConfirmRequest
  >({
    mutationFn: (data) => client.resetPassword(data),
    onSuccess: (data) => {
      if (data.status === 200) {
        queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
        queryClient.invalidateQueries({ queryKey: allauthQueryKeys.authStatus() });
      }
    },
  });
}