import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../api/client';
import { allauthQueryKeys, getAuthInvalidationKeys } from '../../queryKeys';
import type { 
  LoginByCodeRequest,
  ConfirmLoginCodeRequest,
  AuthenticatedResponse,
  AuthenticationResponse,
  ErrorResponse 
} from '../../api/types';

/**
 * Hook for passwordless login via email code.
 */
export function useLoginByCode() {
  const client = getClient();
  const queryClient = useQueryClient();

  const requestCode = useMutation<
    AuthenticationResponse,
    ErrorResponse,
    LoginByCodeRequest
  >({
    mutationFn: (data) => client.requestLoginCode(data),
  });

  const confirmCode = useMutation<
    AuthenticatedResponse | AuthenticationResponse,
    ErrorResponse,
    ConfirmLoginCodeRequest
  >({
    mutationFn: (data) => client.confirmLoginCode(data),
    onSuccess: (data) => {
      if (data.status === 200) {
        // Update auth cache
        queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
        
        // Invalidate auth-related queries
        getAuthInvalidationKeys().forEach(key => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
    },
  });

  return {
    requestCode,
    confirmCode,
  };
}