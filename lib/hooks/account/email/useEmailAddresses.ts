import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys } from '../../../queryKeys';
import type { EmailAddressesResponse } from '../../../api/types';

/**
 * Query hook for listing email addresses
 */
export function useEmailAddresses(): UseQueryResult<EmailAddressesResponse, Error> {
  const client = getClient();

  return useQuery<EmailAddressesResponse>({
    queryKey: allauthQueryKeys.emailAddresses(),
    queryFn: () => client.listEmailAddresses(),
  });
}