import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys } from '../../../queryKeys';
import type { ErrorResponse } from '../../../api/types';

/**
 * Mutation hook for removing phone number
 */
export function useRemovePhoneNumber(): UseMutationResult<
  { status: 200 },
  ErrorResponse,
  void
> {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    { status: 200 },
    ErrorResponse,
    void
  >({
    mutationFn: () => client.removePhoneNumber(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.phoneNumber() });
    },
  });
}