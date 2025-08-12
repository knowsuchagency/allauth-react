import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../api/client';
import { allauthQueryKeys, getAuthInvalidationKeys } from '../../queryKeys';
import type { 
  MFAAuthenticateRequest,
  AuthenticatedResponse,
  AuthenticationResponse,
  ErrorResponse 
} from '../../api/types';

/**
 * Hook for MFA authentication during login flow.
 */
export function useMfaAuthenticate() {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    AuthenticatedResponse | AuthenticationResponse,
    ErrorResponse,
    string
  >({
    mutationFn: (code) => client.mfaAuthenticate({ code }),
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
}

/**
 * Hook for MFA reauthentication for sensitive operations.
 */
export function useMfaReauthenticate() {
  const client = getClient();
  const queryClient = useQueryClient();

  return useMutation<
    AuthenticatedResponse,
    ErrorResponse,
    void
  >({
    mutationFn: () => client.mfaReauthenticate(),
    onSuccess: (data) => {
      // Update auth status
      queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.authStatus() });
    },
  });
}