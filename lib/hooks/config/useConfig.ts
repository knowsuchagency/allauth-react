import { useQuery } from '@tanstack/react-query';
import { getClient } from '../../api/client';
import { allauthQueryKeys } from '../../queryKeys';
import type { ConfigurationResponse } from '../../api/types';

/**
 * Hook to fetch the django-allauth configuration.
 */
export function useConfig() {
  const client = getClient();

  return useQuery<ConfigurationResponse>({
    queryKey: allauthQueryKeys.config(),
    queryFn: () => client.getConfiguration(),
    staleTime: 1000 * 60 * 60, // Cache config for 1 hour
  });
}