import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../api/client';
import { allauthQueryKeys, getAuthInvalidationKeys } from '../../queryKeys';
import type { LoginRequest, AuthenticatedResponse, AuthenticationResponse, ErrorResponse } from '../../api/types';

export interface UseLoginResult {
  login: (data: LoginRequest) => Promise<AuthenticatedResponse | AuthenticationResponse>;
  isLoading: boolean;
  isError: boolean;
  error: ErrorResponse | null;
  reset: () => void;
}

/**
 * Hook for user login.
 * Automatically updates the auth cache on successful login.
 */
export function useLogin(): UseLoginResult {
  const client = getClient();
  const queryClient = useQueryClient();

  const mutation = useMutation<
    AuthenticatedResponse | AuthenticationResponse,
    ErrorResponse,
    LoginRequest
  >({
    mutationFn: (data) => client.login(data),
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
    login: (data: LoginRequest) => mutation.mutateAsync(data),
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error ?? null,
    reset: mutation.reset,
  };
}