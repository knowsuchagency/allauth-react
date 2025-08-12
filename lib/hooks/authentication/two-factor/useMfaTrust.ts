import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys } from '../../../queryKeys';
import type { 
  AuthenticatedResponse,
  MFATrustRequest,
  ErrorResponse 
} from '../../../api/types';

/**
 * Mutation hook for trusting MFA device
 */
export function useMfaTrust(): UseMutationResult<
  AuthenticatedResponse,
  ErrorResponse,
  MFATrustRequest
> {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    AuthenticatedResponse,
    ErrorResponse,
    MFATrustRequest
  >({
    mutationFn: (data) => client.mfaTrust(data),
    onSuccess: (data) => {
      queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.authStatus() });
    },
  });
}