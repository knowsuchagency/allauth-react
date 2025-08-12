import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import type { 
  AuthenticationResponse,
  PasswordResetRequest,
  ErrorResponse 
} from '../../../api/types';

/**
 * Mutation hook for requesting a password reset
 */
export function useRequestPasswordReset(): UseMutationResult<
  { status: 200 } | AuthenticationResponse,
  ErrorResponse,
  PasswordResetRequest
> {
  const client = getClient();

  return useMutation<
    { status: 200 } | AuthenticationResponse,
    ErrorResponse,
    PasswordResetRequest
  >({
    mutationFn: (data) => client.requestPassword(data),
  });
}