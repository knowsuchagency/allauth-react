import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys } from '../../../queryKeys';
import type { 
  ProviderAccountsResponse,
  ProviderDisconnectRequest,
  ErrorResponse 
} from '../../../api/types';

/**
 * Mutation hook for disconnecting a provider account
 */
export function useDisconnectProvider() {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    ProviderAccountsResponse,
    ErrorResponse,
    ProviderDisconnectRequest
  >({
    mutationFn: (data) => client.disconnectProviderAccount(data),
    onSuccess: (data) => {
      queryClient.setQueryData(allauthQueryKeys.providerAccounts(), data);
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.providerAccounts() });
    },
  });
}