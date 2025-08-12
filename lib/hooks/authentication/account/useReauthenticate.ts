import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys } from '../../../queryKeys';
import type { 
  AuthenticatedResponse,
  ErrorResponse 
} from '../../../api/types';

/**
 * Mutation hook for reauthentication
 */
export function useReauthenticate(): UseMutationResult<
  AuthenticatedResponse,
  ErrorResponse,
  { password: string }
> {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    AuthenticatedResponse,
    ErrorResponse,
    { password: string }
  >({
    mutationFn: (data) => client.reauthenticate(data),
    onSuccess: (data) => {
      queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.authStatus() });
    },
  });
}