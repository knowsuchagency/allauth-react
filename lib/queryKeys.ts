/**
 * Query keys factory for all allauth-related queries.
 * This provides a centralized, hierarchical structure for cache management.
 */
export const allauthQueryKeys = {
  // Root key for all allauth queries
  all: ['allauth'] as const,
  
  // Configuration
  config: () => [...allauthQueryKeys.all, 'config'] as const,
  
  // Authentication
  auth: () => [...allauthQueryKeys.all, 'auth'] as const,
  authStatus: () => [...allauthQueryKeys.auth(), 'status'] as const,
  
  // Email addresses
  emails: () => [...allauthQueryKeys.all, 'emails'] as const,
  emailAddresses: () => [...allauthQueryKeys.all, 'emails'] as const, // Alias for backwards compatibility
  emailVerificationInfo: (key: string) => [...allauthQueryKeys.emails(), 'verify', key] as const,
  
  // Phone number
  phone: () => [...allauthQueryKeys.all, 'phone'] as const,
  phoneNumber: () => [...allauthQueryKeys.all, 'phone'] as const, // Alias for backwards compatibility
  
  // Password reset
  passwordReset: () => [...allauthQueryKeys.all, 'password-reset'] as const,
  passwordResetInfo: (key: string) => [...allauthQueryKeys.passwordReset(), key] as const,
  
  // Provider accounts
  providers: () => [...allauthQueryKeys.all, 'providers'] as const,
  providerAccounts: () => [...allauthQueryKeys.all, 'providers'] as const, // Alias for backwards compatibility
  providerSignup: () => [...allauthQueryKeys.providers(), 'signup'] as const,
  
  // Authenticators (MFA)
  authenticators: () => [...allauthQueryKeys.all, 'authenticators'] as const,
  totp: () => [...allauthQueryKeys.authenticators(), 'totp'] as const,
  recoveryCodes: () => [...allauthQueryKeys.authenticators(), 'recovery-codes'] as const,
  webauthn: () => [...allauthQueryKeys.authenticators(), 'webauthn'] as const,
  
  // Sessions
  sessions: () => [...allauthQueryKeys.all, 'sessions'] as const,
} as const;

/**
 * Helper function to invalidate all queries related to authentication
 */
export function getAuthInvalidationKeys() {
  return [
    allauthQueryKeys.auth(),
    allauthQueryKeys.emails(),
    allauthQueryKeys.providers(),
    allauthQueryKeys.authenticators(),
    allauthQueryKeys.sessions(),
  ];
}

/**
 * Helper function to invalidate all queries
 */
export function getAllInvalidationKeys() {
  return [allauthQueryKeys.all];
}