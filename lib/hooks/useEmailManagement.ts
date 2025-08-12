import { useMemo } from 'react';
import { useEmailAddresses } from './account/email/useEmailAddresses';
import { useAddEmailAddress } from './account/email/useAddEmailAddress';
import { useRemoveEmailAddress } from './account/email/useRemoveEmailAddress';
import { useSetPrimaryEmail } from './account/email/useSetPrimaryEmail';
import { useRequestEmailVerification } from './account/email/useRequestEmailVerification';
import { useVerifyEmail } from './authentication/account/useVerifyEmail';
import { useResendEmailVerification } from './authentication/account/useResendEmailVerification';
import { getEmailVerificationInfo } from './authentication/account/useEmailVerificationInfo';
import type { EmailAddress } from '../api/types';

export interface UseEmailManagementResult {
  // Email data
  emails: EmailAddress[];
  primaryEmail: string | null;
  verifiedEmails: string[];
  unverifiedEmails: string[];
  isLoading: boolean;
  error: any;
  
  // Actions
  addEmail: (email: string) => Promise<void>;
  removeEmail: (email: string) => Promise<void>;
  setPrimary: (email: string) => Promise<void>;
  requestVerification: (email: string) => Promise<void>;
  verifyEmail: (key: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  getVerificationInfo: (key: string) => Promise<any>;
  
  // Mutation states
  isAdding: boolean;
  isRemoving: boolean;
  isSettingPrimary: boolean;
  isRequestingVerification: boolean;
  isVerifying: boolean;
  isResending: boolean;
  
  // Utilities
  refetch: () => void;
}

/**
 * High-level hook for complete email address management.
 * Combines all email-related queries and mutations into a single interface.
 * 
 * @example
 * ```tsx
 * const { emails, primaryEmail, addEmail, setPrimary } = useEmailManagement();
 * 
 * // Add new email
 * await addEmail('new@example.com');
 * 
 * // Make it primary
 * await setPrimary('new@example.com');
 * ```
 */
export function useEmailManagement(): UseEmailManagementResult {
  const emailsQuery = useEmailAddresses();
  const addMutation = useAddEmailAddress();
  const removeMutation = useRemoveEmailAddress();
  const setPrimaryMutation = useSetPrimaryEmail();
  const requestVerificationMutation = useRequestEmailVerification();
  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendEmailVerification();
  
  // Process email data
  const emails = emailsQuery.data?.data || [];
  
  const primaryEmail = useMemo(() => {
    const primary = emails.find(e => e.primary);
    return primary?.email || null;
  }, [emails]);
  
  const verifiedEmails = useMemo(() => {
    return emails.filter(e => e.verified).map(e => e.email);
  }, [emails]);
  
  const unverifiedEmails = useMemo(() => {
    return emails.filter(e => !e.verified).map(e => e.email);
  }, [emails]);
  
  // Wrap mutations with simpler API
  const addEmail = async (email: string) => {
    await addMutation.mutateAsync({ email });
  };
  
  const removeEmail = async (email: string) => {
    await removeMutation.mutateAsync({ email });
  };
  
  const setPrimary = async (email: string) => {
    await setPrimaryMutation.mutateAsync({ email, primary: true });
  };
  
  const requestVerification = async (email: string) => {
    await requestVerificationMutation.mutateAsync({ email });
  };
  
  const verifyEmail = async (key: string) => {
    await verifyMutation.mutateAsync({ key });
  };
  
  const resendVerification = async () => {
    await resendMutation.mutateAsync();
  };
  
  return {
    // Data
    emails,
    primaryEmail,
    verifiedEmails,
    unverifiedEmails,
    isLoading: emailsQuery.isLoading,
    error: emailsQuery.error,
    
    // Actions
    addEmail,
    removeEmail,
    setPrimary,
    requestVerification,
    verifyEmail,
    resendVerification,
    getVerificationInfo: getEmailVerificationInfo,
    
    // Mutation states
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    isSettingPrimary: setPrimaryMutation.isPending,
    isRequestingVerification: requestVerificationMutation.isPending,
    isVerifying: verifyMutation.isPending,
    isResending: resendMutation.isPending,
    
    // Utilities
    refetch: emailsQuery.refetch,
  };
}