/**
 * @knowsuchagency/allauth-react
 * React hooks and components for django-allauth headless API
 */

// ============================================================================
// Provider
// ============================================================================
export { AllauthProvider } from './lib/provider/AllauthProvider';

// ============================================================================
// High-Level Hooks (Recommended)
// ============================================================================
export { useAuth, type UseAuthResult } from './lib/hooks/useAuth';
export { useEmailManagement, type UseEmailManagementResult } from './lib/hooks/useEmailManagement';
export { usePasswordReset, type UsePasswordResetResult } from './lib/hooks/usePasswordReset';
export { useSocialAuth, type UseSocialAuthResult } from './lib/hooks/useSocialAuth';

// ============================================================================
// Query Keys
// ============================================================================
export { 
  allauthQueryKeys, 
  getAuthInvalidationKeys, 
  getAllInvalidationKeys 
} from './lib/queryKeys';

// ============================================================================
// API and Storage
// ============================================================================
export { AllauthClient, initializeClient, getClient } from './lib/api/client';
export { 
  ZustandStorage, 
  CookieStorage, 
  HybridStorage,
  useAuthTokens,
  useAuthTokenStore,
  getStorage 
} from './lib/api/storage';

// ============================================================================
// Types
// ============================================================================
export type {
  // Core Types
  ClientType,
  AuthenticatorType,
  AuthenticationMethod,
  FlowId,
  StorageInterface,
  
  // User and Authentication
  User,
  Flow,
  Provider,
  AuthenticationMethodDetails,
  AuthMethod,
  
  // Configuration
  ConfigurationResponse,
  
  // Authentication Responses
  AuthenticationResponse,
  AuthenticatedResponse,
  NotAuthenticatedResponse,
  
  // Email Management
  EmailAddress,
  EmailAddressesResponse,
  EmailVerificationInfoResponse,
  
  // Phone Management
  PhoneNumber,
  PhoneNumberResponse,
  
  // Password Management
  PasswordResetInfoResponse,
  
  // Provider/Social Accounts
  ProviderAccount,
  ProviderAccountsResponse,
  ProviderSignupResponse,
  
  // Multi-Factor Authentication
  TOTPAuthenticator,
  RecoveryCodesAuthenticator,
  WebAuthnAuthenticator,
  Authenticator,
  AuthenticatorsResponse,
  SensitiveRecoveryCodesAuthenticator,
  SensitiveRecoveryCodesAuthenticatorResponse,
  TOTPAuthenticatorResponse,
  NoTOTPAuthenticatorResponse,
  
  // WebAuthn
  WebAuthnCredentialCreationOptions,
  WebAuthnCredentialRequestOptions,
  
  // Sessions
  Session,
  SessionsResponse,
  
  // Error Responses
  ErrorDetail,
  ErrorResponse,
  ForbiddenResponse,
  ConflictResponse,
  GoneResponse,
  TooManyRequestsResponse,
  
  // Request Types
  LoginRequest,
  SignupRequest,
  LoginByCodeRequest,
  ConfirmLoginCodeRequest,
  EmailVerificationRequest,
  PhoneVerificationRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  PasswordChangeRequest,
  ReauthenticateRequest,
  EmailAddressRequest,
  EmailPrimaryRequest,
  ProviderTokenRequest,
  ProviderSignupRequest,
  MFAAuthenticateRequest,
  MFATrustRequest,
  TOTPActivateRequest,
  WebAuthnLoginRequest,
  WebAuthnSignupRequest,
  ProviderDisconnectRequest,
  
  // Response Union Types
  AuthResponse,
  APIResponse,
} from './lib/api/types';

// ============================================================================
// Granular Hooks (Advanced Usage)
// ============================================================================

// Authentication Hooks - Current Session
export { useAuthStatus } from './lib/hooks/authentication/current-session/useAuthStatus';
export { useLogout } from './lib/hooks/authentication/current-session/useLogout';

// ============================================================================
// Authentication Hooks - Account
// ============================================================================
export { useLogin } from './lib/hooks/authentication/account/useLogin';
export { useSignup } from './lib/hooks/authentication/account/useSignup';
export { useReauthenticate } from './lib/hooks/authentication/account/useReauthenticate';
export { getEmailVerificationInfo } from './lib/hooks/authentication/account/useEmailVerificationInfo';
export { useVerifyEmail } from './lib/hooks/authentication/account/useVerifyEmail';
export { useResendEmailVerification } from './lib/hooks/authentication/account/useResendEmailVerification';
export { useVerifyPhone } from './lib/hooks/authentication/account/useVerifyPhone';
export { useResendPhoneVerification } from './lib/hooks/authentication/account/useResendPhoneVerification';

// ============================================================================
// Authentication Hooks - Password Reset
// ============================================================================
export { useRequestPasswordReset } from './lib/hooks/authentication/password-reset/useRequestPasswordReset';
export { getPasswordResetInfo } from './lib/hooks/authentication/password-reset/usePasswordResetInfo';
export { useResetPassword } from './lib/hooks/authentication/password-reset/useResetPassword';

// ============================================================================
// Authentication Hooks - Login by Code
// ============================================================================
export { useRequestLoginCode } from './lib/hooks/authentication/login-by-code/useRequestLoginCode';
export { useConfirmLoginCode } from './lib/hooks/authentication/login-by-code/useConfirmLoginCode';

// ============================================================================
// Authentication Hooks - Providers
// ============================================================================
export { useProviderRedirect } from './lib/hooks/authentication/providers/useProviderRedirect';
export { useProviderToken } from './lib/hooks/authentication/providers/useProviderToken';
export { useProviderSignupData } from './lib/hooks/authentication/providers/useProviderSignupData';
export { useProviderSignup } from './lib/hooks/authentication/providers/useProviderSignup';

// ============================================================================
// Authentication Hooks - Two-Factor
// ============================================================================
export { useMfaAuthenticate } from './lib/hooks/authentication/two-factor/useMfaAuthenticate';
export { useMfaReauthenticate } from './lib/hooks/authentication/two-factor/useMfaReauthenticate';
export { useMfaTrust } from './lib/hooks/authentication/two-factor/useMfaTrust';

// ============================================================================
// Authentication Hooks - WebAuthn
// ============================================================================
export { getWebAuthnSignupOptions } from './lib/hooks/authentication/webauthn/useWebAuthnSignupOptions';
export { useWebAuthnSignup } from './lib/hooks/authentication/webauthn/useWebAuthnSignup';
export { getWebAuthnLoginOptions } from './lib/hooks/authentication/webauthn/useWebAuthnLoginOptions';
export { useWebAuthnLogin } from './lib/hooks/authentication/webauthn/useWebAuthnLogin';
export { getWebAuthnAuthenticateOptions } from './lib/hooks/authentication/webauthn/useWebAuthnAuthenticateOptions';
export { useWebAuthnAuthenticate } from './lib/hooks/authentication/webauthn/useWebAuthnAuthenticate';
export { getWebAuthnReauthenticateOptions } from './lib/hooks/authentication/webauthn/useWebAuthnReauthenticateOptions';
export { useWebAuthnReauthenticate } from './lib/hooks/authentication/webauthn/useWebAuthnReauthenticate';

// ============================================================================
// Account Hooks - Email
// ============================================================================
export { useEmailAddresses } from './lib/hooks/account/email/useEmailAddresses';
export { useAddEmailAddress } from './lib/hooks/account/email/useAddEmailAddress';
export { useRemoveEmailAddress } from './lib/hooks/account/email/useRemoveEmailAddress';
export { useSetPrimaryEmail } from './lib/hooks/account/email/useSetPrimaryEmail';
export { useRequestEmailVerification } from './lib/hooks/account/email/useRequestEmailVerification';

// ============================================================================
// Account Hooks - Phone
// ============================================================================
export { usePhoneNumber } from './lib/hooks/account/phone/usePhoneNumber';
export { useUpdatePhoneNumber } from './lib/hooks/account/phone/useUpdatePhoneNumber';
export { useRemovePhoneNumber } from './lib/hooks/account/phone/useRemovePhoneNumber';

// ============================================================================
// Account Hooks - Password
// ============================================================================
export { useChangePassword } from './lib/hooks/account/password/useChangePassword';

// ============================================================================
// Account Hooks - Providers
// ============================================================================
export { useProviderAccounts } from './lib/hooks/account/providers/useProviderAccounts';
export { useDisconnectProvider } from './lib/hooks/account/providers/useDisconnectProvider';

// ============================================================================
// Account Hooks - Authenticators
// ============================================================================
export { useAuthenticators } from './lib/hooks/account/authenticators/useAuthenticators';

// TOTP
export { getTOTPAuthenticator } from './lib/hooks/account/authenticators/totp/useTOTPAuthenticator';
export { useActivateTOTP } from './lib/hooks/account/authenticators/totp/useActivateTOTP';
export { useDeactivateTOTP } from './lib/hooks/account/authenticators/totp/useDeactivateTOTP';

// Recovery Codes
export { getRecoveryCodes } from './lib/hooks/account/authenticators/recovery-codes/useRecoveryCodes';
export { useRegenerateRecoveryCodes } from './lib/hooks/account/authenticators/recovery-codes/useRegenerateRecoveryCodes';

// WebAuthn
export { useWebAuthnCredentials } from './lib/hooks/account/authenticators/webauthn/useWebAuthnCredentials';
export { useDeleteWebAuthnCredential } from './lib/hooks/account/authenticators/webauthn/useDeleteWebAuthnCredential';

// ============================================================================
// Sessions Hooks
// ============================================================================
export { useListSessions } from './lib/hooks/sessions/useListSessions';
export { useDeleteSession } from './lib/hooks/sessions/useDeleteSession';

// ============================================================================
// Configuration Hook
// ============================================================================
export { useConfig } from './lib/hooks/config/useConfig';