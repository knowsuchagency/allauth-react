import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../api/client';
import { allauthQueryKeys, getAuthInvalidationKeys } from '../../queryKeys';
import type { 
  ProviderTokenRequest,
  AuthenticatedResponse, 
  AuthenticationResponse, 
  ErrorResponse 
} from '../../api/types';

/**
 * Hook for social provider authentication.
 * Provides methods for redirect-based and token-based flows.
 */
export function useProviderAuth() {
  const client = getClient();
  const queryClient = useQueryClient();

  const redirect = useMutation<
    void,
    Error,
    { provider: string; callbackUrl: string; process?: 'login' | 'connect' }
  >({
    mutationFn: async ({ provider, callbackUrl, process = 'login' }) => {
      // Provider redirect uses form submission, not fetch
      client.providerRedirect(provider, callbackUrl, process);
    },
  });

  const token = useMutation<
    AuthenticatedResponse | AuthenticationResponse,
    ErrorResponse,
    ProviderTokenRequest
  >({
    mutationFn: (data) => client.providerToken(data),
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
    redirect,
    token,
  };
}