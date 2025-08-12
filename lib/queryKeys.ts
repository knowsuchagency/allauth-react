/**
 * Query keys factory for all allauth-related queries.
 * This provides a centralized, hierarchical structure for cache management.
 */
export const allauthQueryKeys = {
  // Root key for all allauth queries
  all: ['allauth'] as const,
  
  // Configuration
  config: (): readonly ["allauth", "config"] => [...allauthQueryKeys.all, 'config'] as const,
  
  // Authentication
  auth: (): readonly ["allauth", "auth"] => [...allauthQueryKeys.all, 'auth'] as const,
  authStatus: (): readonly ["allauth", "auth", "status"] => [...allauthQueryKeys.auth(), 'status'] as const,
  
  // Email addresses
  emails: (): readonly ["allauth", "emails"] => [...allauthQueryKeys.all, 'emails'] as const,
  emailAddresses: (): readonly ["allauth", "emails"] => [...allauthQueryKeys.all, 'emails'] as const, // Alias for backwards compatibility
  emailVerificationInfo: (key: string): readonly ["allauth", "emails", "verify", string] => [...allauthQueryKeys.emails(), 'verify', key] as const,
  
  // Phone number
  phone: (): readonly ["allauth", "phone"] => [...allauthQueryKeys.all, 'phone'] as const,
  phoneNumber: (): readonly ["allauth", "phone"] => [...allauthQueryKeys.all, 'phone'] as const, // Alias for backwards compatibility
  
  // Password reset
  passwordReset: (): readonly ["allauth", "password-reset"] => [...allauthQueryKeys.all, 'password-reset'] as const,
  passwordResetInfo: (key: string): readonly ["allauth", "password-reset", string] => [...allauthQueryKeys.passwordReset(), key] as const,
  
  // Provider accounts
  providers: (): readonly ["allauth", "providers"] => [...allauthQueryKeys.all, 'providers'] as const,
  providerAccounts: (): readonly ["allauth", "providers"] => [...allauthQueryKeys.all, 'providers'] as const, // Alias for backwards compatibility
  providerSignup: (): readonly ["allauth", "providers", "signup"] => [...allauthQueryKeys.providers(), 'signup'] as const,
  
  // Authenticators (MFA)
  authenticators: (): readonly ["allauth", "authenticators"] => [...allauthQueryKeys.all, 'authenticators'] as const,
  totp: (): readonly ["allauth", "authenticators", "totp"] => [...allauthQueryKeys.authenticators(), 'totp'] as const,
  recoveryCodes: (): readonly ["allauth", "authenticators", "recovery-codes"] => [...allauthQueryKeys.authenticators(), 'recovery-codes'] as const,
  webauthn: (): readonly ["allauth", "authenticators", "webauthn"] => [...allauthQueryKeys.authenticators(), 'webauthn'] as const,
  
  // Sessions
  sessions: (): readonly ["allauth", "sessions"] => [...allauthQueryKeys.all, 'sessions'] as const,
} as const;

/**
 * Helper function to invalidate all queries related to authentication
 */
export function getAuthInvalidationKeys(): readonly (readonly string[])[] {
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
export function getAllInvalidationKeys(): readonly (readonly string[])[] {
  return [allauthQueryKeys.all];
}