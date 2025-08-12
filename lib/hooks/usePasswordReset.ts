import { useRequestPasswordReset } from './authentication/password-reset/useRequestPasswordReset';
import { useResetPassword } from './authentication/password-reset/useResetPassword';
import { getPasswordResetInfo } from './authentication/password-reset/usePasswordResetInfo';

export interface UsePasswordResetResult {
  // Actions
  requestReset: (email: string) => Promise<void>;
  confirmReset: (key: string, password: string) => Promise<void>;
  getResetInfo: (key: string) => Promise<any>;
  
  // States
  isRequesting: boolean;
  isConfirming: boolean;
  
  // Errors
  requestError: any;
  confirmError: any;
}

/**
 * High-level hook for password reset flow.
 * Handles both requesting a reset and confirming with new password.
 * 
 * @example
 * ```tsx
 * const { requestReset, confirmReset, isRequesting } = usePasswordReset();
 * 
 * // Step 1: Request reset
 * await requestReset('user@example.com');
 * 
 * // Step 2: User receives email with reset key
 * 
 * // Step 3: Confirm with new password
 * await confirmReset(resetKey, newPassword);
 * ```
 */
export function usePasswordReset(): UsePasswordResetResult {
  const requestMutation = useRequestPasswordReset();
  const confirmMutation = useResetPassword();
  
  const requestReset = async (email: string) => {
    await requestMutation.mutateAsync({ email });
  };
  
  const confirmReset = async (key: string, password: string) => {
    await confirmMutation.mutateAsync({ key, password });
  };
  
  return {
    // Actions
    requestReset,
    confirmReset,
    getResetInfo: getPasswordResetInfo,
    
    // States
    isRequesting: requestMutation.isPending,
    isConfirming: confirmMutation.isPending,
    
    // Errors
    requestError: requestMutation.error,
    confirmError: confirmMutation.error,
  };
}