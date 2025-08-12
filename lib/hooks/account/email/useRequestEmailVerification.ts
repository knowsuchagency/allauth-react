import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys } from '../../../queryKeys';
import type { 
  EmailAddressRequest,
  ErrorResponse 
} from '../../../api/types';

/**
 * Mutation hook for requesting email verification
 */
export function useRequestEmailVerification() {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    { status: 200 },
    ErrorResponse,
    EmailAddressRequest
  >({
    mutationFn: (data) => client.requestEmailVerification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.emailAddresses() });
    },
  });
}