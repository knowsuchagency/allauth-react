import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../api/client';
import { allauthQueryKeys, getAuthInvalidationKeys } from '../../queryKeys';
import type { SignupRequest, AuthenticatedResponse, AuthenticationResponse, ErrorResponse } from '../../api/types';

export interface UseSignupResult {
  signup: (data: SignupRequest) => Promise<AuthenticatedResponse | AuthenticationResponse>;
  isLoading: boolean;
  isError: boolean;
  error: ErrorResponse | null;
  reset: () => void;
}

/**
 * Hook for user signup/registration.
 * Automatically updates the auth cache on successful signup.
 */
export function useSignup(): UseSignupResult {
  const client = getClient();
  const queryClient = useQueryClient();

  const mutation = useMutation<
    AuthenticatedResponse | AuthenticationResponse,
    ErrorResponse,
    SignupRequest
  >({
    mutationFn: (data) => client.signup(data),
    onSuccess: (data) => {
      if (data.status === 200) {
        // Update auth cache immediately
        queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
        
        // Invalidate all auth-related queries
        getAuthInvalidationKeys().forEach(key => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
    },
  });

  return {
    signup: (data: SignupRequest) => mutation.mutateAsync(data),
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error ?? null,
    reset: mutation.reset,
  };
}