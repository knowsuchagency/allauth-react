import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys } from '../../../queryKeys';
import type { 
  AuthenticatedResponse,
  ErrorResponse 
} from '../../../api/types';

/**
 * Mutation hook for MFA reauthentication
 */
export function useMfaReauthenticate() {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<AuthenticatedResponse, ErrorResponse, void>({
    mutationFn: () => client.mfaReauthenticate(),
    onSuccess: (data) => {
      queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.authStatus() });
    },
  });
}