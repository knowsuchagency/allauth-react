import { useMutation } from '@tanstack/react-query';
import { getClient } from '../../api/client';
import type { ErrorResponse } from '../../api/types';

export interface UseChangePasswordResult {
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isLoading: boolean;
  isError: boolean;
  error: ErrorResponse | null;
  reset: () => void;
}

/**
 * Hook for changing the current user's password.
 * Requires the user to be authenticated.
 */
export function useChangePassword(): UseChangePasswordResult {
  const client = getClient();

  const mutation = useMutation<
    { status: 200 },
    ErrorResponse,
    { currentPassword: string; newPassword: string }
  >({
    mutationFn: ({ currentPassword, newPassword }) => 
      client.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      }),
  });

  return {
    changePassword: async (currentPassword: string, newPassword: string) => {
      await mutation.mutateAsync({ currentPassword, newPassword });
    },
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error ?? null,
    reset: mutation.reset,
  };
}