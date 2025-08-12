import { useQuery } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys } from '../../../queryKeys';
import type { PhoneNumberResponse } from '../../../api/types';

/**
 * Query hook for getting phone number
 */
export function usePhoneNumber() {
  const client = getClient();

  return useQuery<PhoneNumberResponse>({
    queryKey: allauthQueryKeys.phoneNumber(),
    queryFn: () => client.getPhoneNumber(),
  });
}