import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { getClient } from '../../api/client';
import { allauthQueryKeys } from '../../queryKeys';
import type { 
  PhoneNumber,
  PhoneNumberResponse,
  AuthenticatedResponse,
  AuthenticationResponse,
  ErrorResponse 
} from '../../api/types';

export interface UsePhoneNumberResult {
  phoneNumber: PhoneNumber | null;
  isLoading: boolean;
  isError: boolean;
  error: any;
  updatePhone: UseMutationResult<PhoneNumberResponse, ErrorResponse, string, unknown>;
  removePhone: UseMutationResult<{ status: 200 }, ErrorResponse, void, unknown>;
  verifyPhone: UseMutationResult<AuthenticatedResponse | AuthenticationResponse, ErrorResponse, string, unknown>;
  resendVerification: UseMutationResult<{ status: 200 }, ErrorResponse, void, unknown>;
  refetch: () => void;
}

/**
 * Hook for managing phone number.
 * Provides methods for updating, removing, and verifying phone numbers.
 */
export function usePhoneNumber(): UsePhoneNumberResult {
  const client = getClient();
  const queryClient = useQueryClient();

  // Query for phone number
  const query = useQuery({
    queryKey: allauthQueryKeys.phone(),
    queryFn: async () => {
      try {
        const response = await client.getPhoneNumber();
        return response.data;
      } catch (error) {
        // No phone number set
        return null;
      }
    },
  });

  // Update phone number mutation
  const updatePhone = useMutation<PhoneNumberResponse, ErrorResponse, string>({
    mutationFn: (phone) => client.updatePhoneNumber(phone),
    onSuccess: (data) => {
      queryClient.setQueryData(allauthQueryKeys.phone(), data.data);
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.phone() });
    },
  });

  // Remove phone number mutation
  const removePhone = useMutation<{ status: 200 }, ErrorResponse, void>({
    mutationFn: () => client.removePhoneNumber(),
    onSuccess: () => {
      queryClient.setQueryData(allauthQueryKeys.phone(), null);
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.phone() });
    },
  });

  // Verify phone number mutation
  const verifyPhone = useMutation<
    AuthenticatedResponse | AuthenticationResponse,
    ErrorResponse,
    string
  >({
    mutationFn: (code) => client.verifyPhone({ code }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.phone() });
      
      if (data.status === 200) {
        // Update auth status if authenticated
        queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
        queryClient.invalidateQueries({ queryKey: allauthQueryKeys.authStatus() });
      }
    },
  });

  // Resend verification code mutation
  const resendVerification = useMutation<{ status: 200 }, ErrorResponse, void>({
    mutationFn: () => client.resendPhoneVerification(),
  });

  return {
    phoneNumber: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    updatePhone,
    removePhone,
    verifyPhone,
    resendVerification,
    refetch: query.refetch,
  };
}