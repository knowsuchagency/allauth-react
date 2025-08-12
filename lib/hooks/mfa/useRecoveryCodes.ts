import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../api/client';
import { allauthQueryKeys } from '../../queryKeys';
import type { 
  SensitiveRecoveryCodesAuthenticator,
  SensitiveRecoveryCodesAuthenticatorResponse,
  ErrorResponse 
} from '../../api/types';

export interface UseRecoveryCodesResult {
  recoveryCodes: SensitiveRecoveryCodesAuthenticator | null;
  isLoading: boolean;
  isError: boolean;
  error: any;
  regenerateCodes: () => Promise<void>;
  isRegenerating: boolean;
  refetch: () => void;
}

/**
 * Hook for managing recovery codes.
 * Provides methods for viewing and regenerating recovery codes.
 */
export function useRecoveryCodes(): UseRecoveryCodesResult {
  const client = getClient();
  const queryClient = useQueryClient();

  // Query for recovery codes
  const query = useQuery({
    queryKey: allauthQueryKeys.recoveryCodes(),
    queryFn: async () => {
      try {
        const response = await client.listRecoveryCodes();
        
        if ('status' in response && response.status === 404) {
          return null;
        }
        
        return (response as SensitiveRecoveryCodesAuthenticatorResponse).data;
      } catch (error) {
        return null;
      }
    },
  });

  // Regenerate recovery codes mutation
  const regenerateMutation = useMutation<
    SensitiveRecoveryCodesAuthenticatorResponse,
    ErrorResponse,
    void
  >({
    mutationFn: () => client.regenerateRecoveryCodes(),
    onSuccess: (data) => {
      queryClient.setQueryData(allauthQueryKeys.recoveryCodes(), data.data);
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.recoveryCodes() });
    },
  });

  return {
    recoveryCodes: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    regenerateCodes: async () => {
      await regenerateMutation.mutateAsync();
    },
    isRegenerating: regenerateMutation.isPending,
    refetch: query.refetch,
  };
}