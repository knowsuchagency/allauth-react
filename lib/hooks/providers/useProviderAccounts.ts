import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../api/client';
import { allauthQueryKeys } from '../../queryKeys';
import type { ProviderAccount, ProviderAccountsResponse, ErrorResponse } from '../../api/types';

export interface UseProviderAccountsResult {
  accounts: ProviderAccount[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  disconnect: (provider: string, account: string) => Promise<void>;
  isDisconnecting: boolean;
  refetch: () => void;
}

/**
 * Hook for managing connected social provider accounts.
 */
export function useProviderAccounts(): UseProviderAccountsResult {
  const client = getClient();
  const queryClient = useQueryClient();

  const query = useQuery<ProviderAccountsResponse>({
    queryKey: allauthQueryKeys.providers(),
    queryFn: () => client.listProviderAccounts(),
  });

  const disconnectAccount = useMutation<
    ProviderAccountsResponse,
    ErrorResponse,
    { provider: string; account: string }
  >({
    mutationFn: ({ provider, account }) => 
      client.disconnectProviderAccount({ provider, account }),
    onSuccess: (data) => {
      queryClient.setQueryData(allauthQueryKeys.providers(), data.data);
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.providers() });
    },
  });

  return {
    accounts: query.data?.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    disconnect: async (provider: string, account: string) => {
      await disconnectAccount.mutateAsync({ provider, account });
    },
    isDisconnecting: disconnectAccount.isPending,
    refetch: query.refetch,
  };
}