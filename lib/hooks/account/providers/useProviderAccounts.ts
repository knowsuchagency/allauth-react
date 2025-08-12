import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys } from '../../../queryKeys';
import type { ProviderAccountsResponse } from '../../../api/types';

/**
 * Query hook for listing provider accounts
 */
export function useProviderAccounts(): UseQueryResult<ProviderAccountsResponse, Error> {
  const client = getClient();

  return useQuery<ProviderAccountsResponse>({
    queryKey: allauthQueryKeys.providerAccounts(),
    queryFn: () => client.listProviderAccounts(),
  });
}