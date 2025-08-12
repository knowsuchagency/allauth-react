import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys } from '../../../queryKeys';
import type { PhoneNumberResponse } from '../../../api/types';

/**
 * Query hook for getting phone number
 */
export function usePhoneNumber(): UseQueryResult<PhoneNumberResponse, Error> {
  const client = getClient();

  return useQuery<PhoneNumberResponse>({
    queryKey: allauthQueryKeys.phoneNumber(),
    queryFn: () => client.getPhoneNumber(),
  });
}