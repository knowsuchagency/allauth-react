import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import type { 
  PasswordChangeRequest,
  ErrorResponse 
} from '../../../api/types';

/**
 * Mutation hook for changing password
 */
export function useChangePassword(): UseMutationResult<
  { status: 200 },
  ErrorResponse,
  PasswordChangeRequest
> {
  const client = getClient();

  return useMutation<
    { status: 200 },
    ErrorResponse,
    PasswordChangeRequest
  >({
    mutationFn: (data) => client.changePassword(data),
  });
}