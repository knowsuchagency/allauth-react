import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys } from '../../../queryKeys';
import type { 
  PhoneNumberResponse,
  ErrorResponse 
} from '../../../api/types';

/**
 * Mutation hook for updating phone number
 */
export function useUpdatePhoneNumber() {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    PhoneNumberResponse,
    ErrorResponse,
    string
  >({
    mutationFn: (phone) => client.updatePhoneNumber(phone),
    onSuccess: (data) => {
      queryClient.setQueryData(allauthQueryKeys.phoneNumber(), data);
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.phoneNumber() });
    },
  });
}