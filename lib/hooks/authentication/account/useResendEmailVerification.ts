import { useMutation } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import type { ErrorResponse } from '../../../api/types';

/**
 * Mutation hook for resending email verification code
 */
export function useResendEmailVerification() {
  const client = getClient();

  return useMutation<{ status: 200 }, ErrorResponse, void>({
    mutationFn: () => client.resendEmailVerification(),
  });
}