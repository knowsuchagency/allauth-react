/**
 * @knowsuchagency/allauth-react
 * React hooks and components for django-allauth headless API
 */

// ============================================================================
// Provider
// ============================================================================
export { AllauthProvider } from './lib/provider/AllauthProvider';

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
// Authentication Hooks
// ============================================================================
export { useAuth, type UseAuthResult } from './lib/hooks/auth/useAuth';
export { useLogin, type UseLoginResult } from './lib/hooks/auth/useLogin';
export { useLogout, type UseLogoutResult } from './lib/hooks/auth/useLogout';
export { useSignup, type UseSignupResult } from './lib/hooks/auth/useSignup';
export { useLoginByCode } from './lib/hooks/auth/useLoginByCode';
export { useReauthenticate } from './lib/hooks/auth/useReauthenticate';

// ============================================================================
// Email Hooks
// ============================================================================
export { 
  useEmailAddresses, 
  type UseEmailAddressesResult 
} from './lib/hooks/email/useEmailAddresses';

// ============================================================================
// Phone Hooks
// ============================================================================
export { 
  usePhoneNumber, 
  type UsePhoneNumberResult 
} from './lib/hooks/phone/usePhoneNumber';

// ============================================================================
// Password Hooks
// ============================================================================
export { usePasswordReset, type UsePasswordResetResult } from './lib/hooks/password/usePasswordReset';
export { useChangePassword, type UseChangePasswordResult } from './lib/hooks/password/useChangePassword';

// ============================================================================
// Session Hooks
// ============================================================================
export { 
  useSessions, 
  type UseSessionsResult 
} from './lib/hooks/sessions/useSessions';

// ============================================================================
// Provider/Social Auth Hooks
// ============================================================================
export { 
  useProviderAccounts, 
  type UseProviderAccountsResult 
} from './lib/hooks/providers/useProviderAccounts';
export { useProviderAuth } from './lib/hooks/providers/useProviderAuth';
export { 
  useProviderSignup, 
  type UseProviderSignupResult 
} from './lib/hooks/providers/useProviderSignup';

// ============================================================================
// Configuration Hook
// ============================================================================
export { useConfig } from './lib/hooks/config/useConfig';

// ============================================================================
// Multi-Factor Authentication Hooks
// ============================================================================
export { 
  useAuthenticators, 
  type UseAuthenticatorsResult 
} from './lib/hooks/mfa/useAuthenticators';
export { 
  useMfaAuthenticate,
  useMfaReauthenticate 
} from './lib/hooks/mfa/useMfaAuthenticate';
export { 
  useRecoveryCodes, 
  type UseRecoveryCodesResult 
} from './lib/hooks/mfa/useRecoveryCodes';
export { useMfaTrust } from './lib/hooks/mfa/useMfaTrust';

// ============================================================================
// WebAuthn Hooks
// ============================================================================
export { 
  useWebAuthn, 
  type UseWebAuthnResult 
} from './lib/hooks/webauthn/useWebAuthn';

