import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { getClient } from '../../api/client';
import { allauthQueryKeys } from '../../queryKeys';
import type { 
  Authenticator,
  AuthenticatorsResponse,
  TOTPAuthenticatorResponse,
  NoTOTPAuthenticatorResponse,
  ErrorResponse 
} from '../../api/types';

export interface UseAuthenticatorsResult {
  authenticators: Authenticator[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  getTOTP: () => Promise<TOTPAuthenticatorResponse | NoTOTPAuthenticatorResponse>;
  setupTOTP: UseMutationResult<TOTPAuthenticatorResponse, ErrorResponse, string, unknown>;
  deactivateTOTP: UseMutationResult<{ status: 200 }, ErrorResponse, void, unknown>;
  refetch: () => void;
}

/**
 * Hook for managing authenticators (2FA/MFA).
 * Provides methods for TOTP setup and management.
 */
export function useAuthenticators(): UseAuthenticatorsResult {
  const client = getClient();
  const queryClient = useQueryClient();

  // Query for authenticators
  const query = useQuery<AuthenticatorsResponse>({
    queryKey: allauthQueryKeys.authenticators(),
    queryFn: () => client.listAuthenticators(),
  });

  // Get TOTP authenticator info (including setup secret)
  const getTOTP = async () => {
    return client.getTOTPAuthenticator();
  };

  // Setup TOTP mutation
  const setupTOTP = useMutation<TOTPAuthenticatorResponse, ErrorResponse, string>({
    mutationFn: (code) => client.activateTOTP({ code }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.authenticators() });
    },
  });

  // Deactivate TOTP mutation
  const deactivateTOTP = useMutation<{ status: 200 }, ErrorResponse, void>({
    mutationFn: () => client.deactivateTOTP(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.authenticators() });
    },
  });

  return {
    authenticators: query.data?.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    getTOTP,
    setupTOTP,
    deactivateTOTP,
    refetch: query.refetch,
  };
}