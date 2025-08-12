import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys } from '../../../queryKeys';
import type { 
  EmailAddressesResponse,
  EmailAddressRequest,
  ErrorResponse 
} from '../../../api/types';

/**
 * Mutation hook for removing an email address
 */
export function useRemoveEmailAddress(): UseMutationResult<
  EmailAddressesResponse,
  ErrorResponse,
  EmailAddressRequest
> {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    EmailAddressesResponse,
    ErrorResponse,
    EmailAddressRequest
  >({
    mutationFn: (data) => client.removeEmailAddress(data),
    onSuccess: (data) => {
      queryClient.setQueryData(allauthQueryKeys.emailAddresses(), data);
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.emailAddresses() });
    },
  });
}