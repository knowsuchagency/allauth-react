import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys, getAuthInvalidationKeys } from '../../../queryKeys';
import type { 
  NotAuthenticatedResponse,
  ErrorResponse 
} from '../../../api/types';

/**
 * Mutation hook for logging out
 */
export function useLogout() {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<NotAuthenticatedResponse, ErrorResponse, void>({
    mutationFn: () => client.logout(),
    onSuccess: (data) => {
      queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
      queryClient.invalidateQueries({ queryKey: getAuthInvalidationKeys() });
    },
  });
}