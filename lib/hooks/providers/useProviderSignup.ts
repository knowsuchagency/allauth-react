import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../api/client';
import { allauthQueryKeys, getAuthInvalidationKeys } from '../../queryKeys';
import type { 
  ProviderSignupResponse,
  ProviderSignupRequest,
  AuthenticatedResponse,
  AuthenticationResponse,
  ErrorResponse 
} from '../../api/types';

export interface UseProviderSignupResult {
  signupInfo: ProviderSignupResponse['data'] | null;
  isLoading: boolean;
  isError: boolean;
  error: any;
  completeSignup: (data: ProviderSignupRequest) => Promise<void>;
  isCompletingSignup: boolean;
  refetch: () => void;
}

/**
 * Hook for completing social provider signup when additional info is required.
 * This is used when a social login doesn't provide all required user data.
 */
export function useProviderSignup(): UseProviderSignupResult {
  const client = getClient();
  const queryClient = useQueryClient();

  // Query for pending provider signup info
  const query = useQuery<ProviderSignupResponse | null>({
    queryKey: allauthQueryKeys.providerSignup(),
    queryFn: async () => {
      try {
        const response = await client.getProviderSignup();
        return response;
      } catch (error) {
        // No pending provider signup
        return null;
      }
    },
    // Only fetch if we know there's a pending signup
    // This will be triggered by a 401 response with provider_signup flow
    enabled: false,
  });

  // Complete provider signup mutation
  const signupMutation = useMutation<
    AuthenticatedResponse | AuthenticationResponse,
    ErrorResponse,
    ProviderSignupRequest
  >({
    mutationFn: (data) => client.providerSignup(data),
    onSuccess: (data) => {
      if (data.status === 200) {
        // Update auth cache
        queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
        
        // Invalidate auth-related queries
        getAuthInvalidationKeys().forEach(key => {
          queryClient.invalidateQueries({ queryKey: key });
        });
        
        // Clear provider signup query
        queryClient.setQueryData(allauthQueryKeys.providerSignup(), null);
      }
    },
  });

  return {
    signupInfo: query.data?.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    completeSignup: async (data) => {
      await signupMutation.mutateAsync(data);
    },
    isCompletingSignup: signupMutation.isPending,
    refetch: query.refetch,
  };
}