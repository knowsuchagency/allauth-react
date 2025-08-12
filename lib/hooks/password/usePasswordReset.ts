import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../api/client';
import { allauthQueryKeys } from '../../queryKeys';
import type { 
  AuthenticatedResponse, 
  AuthenticationResponse, 
  PasswordResetInfoResponse,
  ErrorResponse 
} from '../../api/types';

export interface UsePasswordResetResult {
  request: (email: string) => Promise<void>;
  confirm: (key: string, password: string) => Promise<AuthenticatedResponse | AuthenticationResponse>;
  getInfo: (key: string) => Promise<PasswordResetInfoResponse | ErrorResponse>;
  isRequesting: boolean;
  isConfirming: boolean;
  requestError: ErrorResponse | null;
  confirmError: ErrorResponse | null;
}

/**
 * Hook for password reset flow.
 * Provides methods to request reset and confirm with new password.
 */
export function usePasswordReset(): UsePasswordResetResult {
  const client = getClient();
  const queryClient = useQueryClient();

  const requestMutation = useMutation<
    { status: 200 } | AuthenticationResponse,
    ErrorResponse,
    string
  >({
    mutationFn: (email) => client.requestPassword({ email }),
  });

  const confirmMutation = useMutation<
    AuthenticatedResponse | AuthenticationResponse,
    ErrorResponse,
    { key: string; password: string }
  >({
    mutationFn: ({ key, password }) => client.resetPassword({ key, password }),
    onSuccess: (data) => {
      if (data.status === 200) {
        // User is logged in after reset
        queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
        queryClient.invalidateQueries({ queryKey: allauthQueryKeys.authStatus() });
      }
    },
  });

  return {
    request: async (email: string) => {
      await requestMutation.mutateAsync(email);
    },
    confirm: (key: string, password: string) => 
      confirmMutation.mutateAsync({ key, password }),
    getInfo: (key: string) => client.getPasswordResetInfo(key),
    isRequesting: requestMutation.isPending,
    isConfirming: confirmMutation.isPending,
    requestError: requestMutation.error ?? null,
    confirmError: confirmMutation.error ?? null,
  };
}