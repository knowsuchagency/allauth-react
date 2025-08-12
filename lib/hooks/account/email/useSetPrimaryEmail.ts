import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys } from '../../../queryKeys';
import type { 
  EmailAddressesResponse,
  EmailPrimaryRequest,
  ErrorResponse 
} from '../../../api/types';

/**
 * Mutation hook for setting primary email address
 */
export function useSetPrimaryEmail() {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    EmailAddressesResponse,
    ErrorResponse,
    EmailPrimaryRequest
  >({
    mutationFn: (data) => client.changePrimaryEmailAddress(data),
    onSuccess: (data) => {
      queryClient.setQueryData(allauthQueryKeys.emailAddresses(), data);
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.emailAddresses() });
    },
  });
}