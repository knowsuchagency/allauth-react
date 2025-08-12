import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys } from '../../../queryKeys';
import type { ProviderSignupResponse } from '../../../api/types';

/**
 * Query hook for provider signup data
 */
export function useProviderSignupData(): UseQueryResult<ProviderSignupResponse> {
  const client = getClient();

  return useQuery<ProviderSignupResponse>({
    queryKey: allauthQueryKeys.providerSignup(),
    queryFn: () => client.getProviderSignup(),
    enabled: false, // Only fetch when explicitly requested
  });
}