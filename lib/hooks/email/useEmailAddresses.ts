import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../api/client';
import { allauthQueryKeys } from '../../queryKeys';
import type { 
  EmailAddress, 
  EmailAddressesResponse, 
  EmailVerificationInfoResponse,
  AuthenticatedResponse,
  AuthenticationResponse,
  ErrorResponse 
} from '../../api/types';

export interface UseEmailAddressesResult {
  emailAddresses: EmailAddress[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  add: (email: string) => Promise<EmailAddressesResponse>;
  remove: (email: string) => Promise<EmailAddressesResponse>;
  setPrimary: (email: string) => Promise<EmailAddressesResponse>;
  requestVerification: (email: string) => Promise<void>;
  verify: (key: string) => Promise<AuthenticatedResponse | AuthenticationResponse>;
  resendVerification: () => Promise<void>;
  getVerificationInfo: (key: string) => Promise<EmailVerificationInfoResponse | ErrorResponse>;
  isAdding: boolean;
  isRemoving: boolean;
  isSettingPrimary: boolean;
  isRequestingVerification: boolean;
  isVerifying: boolean;
  isResendingVerification: boolean;
  refetch: () => void;
}

/**
 * Hook for managing email addresses.
 * Provides methods for adding, removing, verifying, and managing primary email.
 */
export function useEmailAddresses(): UseEmailAddressesResult {
  const client = getClient();
  const queryClient = useQueryClient();

  // Query for email addresses
  const query = useQuery({
    queryKey: allauthQueryKeys.emails(),
    queryFn: () => client.listEmailAddresses(),
  });

  // Add email mutation
  const addEmail = useMutation<EmailAddressesResponse, ErrorResponse, string>({
    mutationFn: (email) => client.addEmailAddress({ email }),
    onSuccess: (data) => {
      queryClient.setQueryData(allauthQueryKeys.emails(), data);
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.emails() });
    },
  });

  // Remove email mutation
  const removeEmail = useMutation<EmailAddressesResponse, ErrorResponse, string>({
    mutationFn: (email) => client.removeEmailAddress({ email }),
    onSuccess: (data) => {
      queryClient.setQueryData(allauthQueryKeys.emails(), data);
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.emails() });
    },
  });

  // Set primary email mutation
  const setPrimaryEmail = useMutation<EmailAddressesResponse, ErrorResponse, string>({
    mutationFn: (email) => client.changePrimaryEmailAddress({ 
      email, 
      primary: true 
    }),
    onSuccess: (data) => {
      queryClient.setQueryData(allauthQueryKeys.emails(), data);
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.emails() });
      // Also refresh auth status as primary email might affect user display
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.authStatus() });
    },
  });

  // Request email verification mutation
  const requestVerification = useMutation<{ status: 200 }, ErrorResponse, string>({
    mutationFn: (email) => client.requestEmailVerification({ email }),
  });

  // Verify email with key mutation
  const verifyEmail = useMutation<
    AuthenticatedResponse | AuthenticationResponse,
    ErrorResponse,
    string
  >({
    mutationFn: (key) => client.verifyEmail({ key }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.emails() });
      
      if (data.status === 200) {
        // User is now authenticated, update auth status
        queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
        queryClient.invalidateQueries({ queryKey: allauthQueryKeys.authStatus() });
      }
    },
  });

  // Resend verification email mutation (for current pending verification)
  const resendVerification = useMutation<{ status: 200 }, ErrorResponse, void>({
    mutationFn: () => client.resendEmailVerification(),
  });

  // Function to get verification info
  const getVerificationInfo = async (key: string) => {
    return client.getEmailVerificationInfo(key);
  };

  return {
    emailAddresses: query.data?.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    add: (email: string) => addEmail.mutateAsync(email),
    remove: (email: string) => removeEmail.mutateAsync(email),
    setPrimary: (email: string) => setPrimaryEmail.mutateAsync(email),
    requestVerification: async (email: string) => {
      await requestVerification.mutateAsync(email);
    },
    verify: (key: string) => verifyEmail.mutateAsync(key),
    resendVerification: async () => {
      await resendVerification.mutateAsync();
    },
    getVerificationInfo,
    isAdding: addEmail.isPending,
    isRemoving: removeEmail.isPending,
    isSettingPrimary: setPrimaryEmail.isPending,
    isRequestingVerification: requestVerification.isPending,
    isVerifying: verifyEmail.isPending,
    isResendingVerification: resendVerification.isPending,
    refetch: query.refetch,
  };
}