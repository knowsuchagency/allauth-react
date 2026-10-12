// ============================================================================
// Core Types
// ============================================================================

export type ClientType = "app" | "browser";

export type AuthenticatorType = "recovery_codes" | "totp" | "webauthn";

export type AuthenticationMethod = "email" | "username" | "username_email";

export type LoginMethod = "email" | "username" | "phone";

export type FlowId = 
  | "verify_email"
  | "verify_phone"
  | "login"
  | "login_by_code"
  | "signup"
  | "provider_redirect"
  | "provider_signup"
  | "provider_token"
  | "mfa_authenticate"
  | "mfa_login_webauthn"
  | "mfa_signup_webauthn"
  | "mfa_trust"
  | "reauthenticate"
  | "mfa_reauthenticate"
  | "webauthn_login"
  | "webauthn_signup"
  | "webauthn_authenticate"
  | "webauthn_reauthenticate"
  | "password_reset"
  | "password_reset_by_code";

// ============================================================================
// User and Authentication
// ============================================================================

export interface User {
  id: number | string;
  display: string;
  has_usable_password: boolean;
  email?: string;
  username?: string;
  phone?: string;
}

export interface Flow {
  id: FlowId;
  provider?: Provider;
  is_pending?: boolean;
  types?: AuthenticatorType[];
}

export interface Provider {
  id: string;
  name: string;
  client_id?: string;
  openid_configuration_url?: string;
  flows: ("provider_redirect" | "provider_token")[];
}

export interface AuthenticationMethodDetails {
  at: number;
  email?: string;
  username?: string;
  phone?: string;
  reauthenticated?: boolean;
  provider?: string;
  uid?: string;
  type?: AuthenticatorType;
}

export interface AuthMethod extends AuthenticationMethodDetails {
  method: "password" | "password_reset" | "code" | "socialaccount" | "mfa" | "webauthn";
}

// ============================================================================
// Configuration
// ============================================================================

export interface AccountConfiguration {
  login_methods?: LoginMethod[];
  is_open_for_signup: boolean;
  email_verification_by_code_enabled: boolean;
  login_by_code_enabled: boolean;
  password_reset_by_code_enabled?: boolean;
  /**
   * @deprecated Sent by django-allauth for backwards compatibility only;
   * use `login_methods`.
   */
  authentication_method?: AuthenticationMethod;
}

export interface SocialAccountConfiguration {
  providers: Provider[];
}

export interface MFAConfiguration {
  supported_types: AuthenticatorType[];
  passkey_login_enabled?: boolean;
}

export interface UserSessionsConfiguration {
  track_activity: boolean;
}

/**
 * `socialaccount`, `mfa` and `usersessions` are only present when the
 * matching Django app is installed and enabled on the server.
 */
export interface ConfigurationResponse {
  status: 200;
  data: {
    account: AccountConfiguration;
    socialaccount?: SocialAccountConfiguration;
    mfa?: MFAConfiguration;
    usersessions?: UserSessionsConfiguration;
  };
}

// ============================================================================
// Authentication Responses
// ============================================================================

export interface AuthenticationResponse {
  status: 401;
  data: {
    flows: Flow[];
  };
  meta: {
    is_authenticated: boolean;
    session_token?: string;
    access_token?: string;
  };
}

export interface AuthenticatedResponse {
  status: 200;
  data: {
    user: User;
    methods: AuthMethod[];
    flows?: Flow[];
  };
  meta: {
    is_authenticated: true;
    session_token?: string;
    access_token?: string;
  };
}

/**
 * Returned with a 401 when an authenticated user must reauthenticate before
 * a sensitive action. `flows` lists the available reauthentication flows.
 */
export interface ReauthenticationResponse {
  status: 401;
  data: {
    flows: Flow[];
    user: User;
    methods: AuthMethod[];
  };
  meta: {
    is_authenticated: true;
    session_token?: string;
    access_token?: string;
  };
}

export interface NotAuthenticatedResponse {
  status: 401;
  data: {
    flows: Flow[];
  };
  meta: {
    is_authenticated: false;
    session_token?: string;
    access_token?: string;
  };
}

// ============================================================================
// Email Management
// ============================================================================

export interface EmailAddress {
  email: string;
  primary: boolean;
  verified: boolean;
}

export interface EmailAddressesResponse {
  status: 200;
  data: EmailAddress[];
}

export interface EmailVerificationInfoResponse {
  status: 200;
  data: {
    email: string;
    user: User;
  };
  meta: {
    is_authenticating: boolean;
  };
}

// ============================================================================
// Phone Management
// ============================================================================

export interface PhoneNumber {
  phone: string;
  verified: boolean;
}

/**
 * GET /account/phone answers 200; changing the number answers 202 while the
 * new number awaits verification. `data` is empty when no phone is set.
 */
export interface PhoneNumberResponse {
  status: 200 | 202;
  data: PhoneNumber[];
}

export type PhoneNumbersResponse = PhoneNumberResponse;

// ============================================================================
// Password Management
// ============================================================================

export interface PasswordResetInfoResponse {
  status: 200;
  data: {
    user?: User;
  };
}

// ============================================================================
// Provider/Social Accounts
// ============================================================================

export interface ProviderAccount {
  uid: string;
  display: string;
  provider: Provider;
}

export interface ProviderAccountsResponse {
  status: 200;
  data: ProviderAccount[];
}

export interface ProviderSignupResponse {
  status: 200;
  data: {
    account: ProviderAccount;
    email: EmailAddress[];
    user: User;
  };
}

// ============================================================================
// Multi-Factor Authentication
// ============================================================================

export interface TOTPAuthenticator {
  type: "totp";
  last_used_at: number | null;
  created_at: number;
}

export interface RecoveryCodesAuthenticator {
  type: "recovery_codes";
  last_used_at: number | null;
  created_at: number;
  total_code_count: number;
  unused_code_count: number;
}

export interface WebAuthnAuthenticator {
  type: "webauthn";
  id: number;
  last_used_at: number | null;
  created_at: number;
  name: string;
  /** Omitted when the server cannot tell. */
  is_passwordless?: boolean;
}

export type Authenticator = TOTPAuthenticator | RecoveryCodesAuthenticator | WebAuthnAuthenticator;

export interface AuthenticatorsResponse {
  status: 200;
  data: Authenticator[];
}

export interface SensitiveRecoveryCodesAuthenticator extends RecoveryCodesAuthenticator {
  unused_codes: string[];
}

export interface SensitiveRecoveryCodesAuthenticatorResponse {
  status: 200;
  data: SensitiveRecoveryCodesAuthenticator;
}

export interface TOTPAuthenticatorResponse {
  status: 200;
  data: TOTPAuthenticator;
  meta?: {
    recovery_codes_generated?: boolean;
  };
}

/** No TOTP authenticator yet: `meta` holds the secret to set one up. */
export interface NoTOTPAuthenticatorResponse {
  status: 404;
  meta: {
    secret: string;
    totp_url: string;
  };
}

// ============================================================================
// WebAuthn
// ============================================================================

/**
 * A WebAuthn options or credential object in its JSON form, as used by
 * `PublicKeyCredential.parseCreationOptionsFromJSON()`,
 * `parseRequestOptionsFromJSON()` and `credential.toJSON()`.
 */
export type WebAuthnJSON = Record<string, any>;

export interface WebAuthnCredentialCreationOptions {
  status: 200;
  data: {
    creation_options: WebAuthnJSON;
  };
}

export interface WebAuthnCredentialRequestOptions {
  status: 200;
  data: {
    request_options: WebAuthnJSON;
  };
}

// ============================================================================
// Sessions
// ============================================================================

export interface Session {
  id: number;
  user_agent: string;
  ip: string;
  created_at: number;
  last_seen_at?: number;
  is_current: boolean;
}

export interface SessionsResponse {
  status: 200;
  data: Session[];
}

// ============================================================================
// Error Responses
// ============================================================================

export interface ErrorDetail {
  code: string;
  param?: string;
  message: string;
}

export interface ErrorResponse {
  status: 400 | 401 | 403 | 404 | 409 | 410 | 429 | 500;
  errors: ErrorDetail[];
}

export interface ForbiddenResponse {
  status: 403;
}

export interface ConflictResponse {
  status: 409;
}

export interface NotFoundResponse {
  status: 404;
}

export interface GoneResponse {
  status: 410;
}

/** The session expired or was ended (410). */
export interface SessionGoneResponse {
  status: 410;
  data: Record<string, never>;
  meta: {
    is_authenticated: boolean;
    session_token?: string;
    access_token?: string;
  };
}

export interface TooManyRequestsResponse {
  status: 429;
  data?: {
    attempt: number;
    max_attempts: number;
  };
}

// ============================================================================
// Request Types
// ============================================================================

export interface LoginRequest {
  email?: string;
  username?: string;
  phone?: string;
  password: string;
  code?: string; // For 2FA
}

export interface SignupRequest {
  email?: string;
  username?: string;
  phone?: string;
  password: string;
  [key: string]: any; // For custom signup fields
}

/** Provide either `email` or `phone`. */
export interface LoginByCodeRequest {
  email?: string;
  phone?: string;
}

export interface ConfirmLoginCodeRequest {
  code: string;
}

export interface EmailVerificationRequest {
  key: string;
}

export interface PhoneVerificationRequest {
  code: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  key: string;
  password: string;
}

export interface PasswordChangeRequest {
  /** Omit when the user has no usable password yet. */
  current_password?: string;
  new_password: string;
}

export interface ReauthenticateRequest {
  password: string;
}

export interface EmailAddressRequest {
  email: string;
}

export interface EmailPrimaryRequest {
  email: string;
  primary: boolean;
}

export interface ProviderTokenRequest {
  provider: string;
  process: "login" | "connect";
  token: {
    client_id: string;
    id_token?: string;
    access_token?: string;
    code?: string;
  };
}

export interface ProviderSignupRequest {
  email?: string;
  username?: string;
  [key: string]: any;
}

export interface MFAAuthenticateRequest {
  code: string;
}

export interface MFATrustRequest {
  trust: boolean;
}

export interface TOTPActivateRequest {
  code: string;
}

export interface WebAuthnLoginRequest {
  /** The credential as JSON (`credential.toJSON()`), or that JSON serialized to a string. */
  credential: WebAuthnJSON | string;
}

export interface WebAuthnSignupRequest {
  /** The credential as JSON (`credential.toJSON()`), or that JSON serialized to a string. */
  credential: WebAuthnJSON | string;
  name?: string;
  email?: string;
  username?: string;
}

export interface ProviderDisconnectRequest {
  provider: string;
  account: string;
}

// ============================================================================
// Storage Interface
// ============================================================================

/**
 * The HTTP function the client uses for every request. It has the shape of
 * the standard `fetch`, so any fetch implementation works, and other HTTP
 * clients (Axios, XHR, ...) can be plugged in with a small adapter that
 * returns a `Response`.
 */
export type FetchFunction = (input: string, init: RequestInit) => Promise<Response>;

export interface StorageInterface {
  getSessionToken(): Promise<string | null>;
  setSessionToken(value: string | null): Promise<void>;
  getCSRFToken(): Promise<string | null>;
  setCSRFToken(value: string | null): Promise<void>;
}

// ============================================================================
// Response Union Types
// ============================================================================

export type AuthResponse =
  | AuthenticatedResponse
  | AuthenticationResponse
  | NotAuthenticatedResponse
  | ReauthenticationResponse;
export type APIResponse = 
  | AuthenticatedResponse 
  | AuthenticationResponse 
  | NotAuthenticatedResponse
  | ReauthenticationResponse
  | ConfigurationResponse
  | EmailAddressesResponse
  | EmailVerificationInfoResponse
  | PhoneNumberResponse
  | PasswordResetInfoResponse
  | ProviderAccountsResponse
  | ProviderSignupResponse
  | AuthenticatorsResponse
  | SensitiveRecoveryCodesAuthenticatorResponse
  | TOTPAuthenticatorResponse
  | NoTOTPAuthenticatorResponse
  | WebAuthnCredentialCreationOptions
  | WebAuthnCredentialRequestOptions
  | SessionsResponse
  | ErrorResponse
  | ForbiddenResponse
  | ConflictResponse
  | NotFoundResponse
  | GoneResponse
  | SessionGoneResponse
  | TooManyRequestsResponse;