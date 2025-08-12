import { useQuery } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys } from '../../../queryKeys';
import type { AuthenticatorsResponse } from '../../../api/types';

/**
 * Query hook for listing authenticators
 */
export function useAuthenticators() {
  const client = getClient();

  return useQuery<AuthenticatorsResponse>({
    queryKey: allauthQueryKeys.authenticators(),
    queryFn: () => client.listAuthenticators(),
  });
}