import { useQuery } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys } from '../../../queryKeys';
import type { ProviderSignupResponse } from '../../../api/types';

/**
 * Query hook for provider signup data
 */
export function useProviderSignupData() {
  const client = getClient();

  return useQuery<ProviderSignupResponse>({
    queryKey: allauthQueryKeys.providerSignup(),
    queryFn: () => client.getProviderSignup(),
    enabled: false, // Only fetch when explicitly requested
  });
}