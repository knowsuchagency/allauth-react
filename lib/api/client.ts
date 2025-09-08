import type {
  ClientType,
  StorageInterface,
  ConfigurationResponse,
  AuthenticatedResponse,
  AuthenticationResponse,
  NotAuthenticatedResponse,
  EmailAddressesResponse,
  EmailVerificationInfoResponse,
  PhoneNumberResponse,
  PasswordResetInfoResponse,
  ProviderAccountsResponse,
  ProviderSignupResponse,
  AuthenticatorsResponse,
  SensitiveRecoveryCodesAuthenticatorResponse,
  TOTPAuthenticatorResponse,
  NoTOTPAuthenticatorResponse,
  WebAuthnCredentialCreationOptions,
  WebAuthnCredentialRequestOptions,
  SessionsResponse,
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
} from './types';
import { getStorage } from './storage';

// Singleton instance
let clientInstance: AllauthClient | null = null;

/**
 * AllauthClient provides methods to interact with the django-allauth headless API.
 * It supports both browser and app clients with automatic token management.
 */
export class AllauthClient {
  private storage: StorageInterface;
  private csrfTokenUrl: string;
  private clientPath: string;
  private browserPath: string;

  constructor(
    apiBaseUrl: string = "",
    csrfTokenEndpoint?: string,
    clientType: ClientType = "browser",
    storage?: StorageInterface
  ) {
    this.clientPath = apiBaseUrl ? `${apiBaseUrl}/_allauth/${clientType}/v1` : `/_allauth/${clientType}/v1`;
    this.browserPath = apiBaseUrl ? `${apiBaseUrl}/_allauth/browser/v1` : `/_allauth/browser/v1`;
    this.storage = storage || getStorage(clientType, apiBaseUrl);
    this.csrfTokenUrl = csrfTokenEndpoint
      ? (apiBaseUrl ? `${apiBaseUrl}${csrfTokenEndpoint}` : csrfTokenEndpoint)
      : "";
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private async fetchCSRFToken(): Promise<string | null> {
    if (!this.csrfTokenUrl) {
      return null;
    }

    try {
      const response = await fetch(this.csrfTokenUrl, {
        method: "GET",
        credentials: "include",
        mode: "cors",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch CSRF token:", response.status);
        return null;
      }

      const data = await response.json();
      if (data && data.token) {
        return data.token;
      } else if (data) {
        return data;
      }

      const cookieToken = await this.storage.getCSRFToken();
      if (cookieToken) {
        return cookieToken;
      }
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
      return null;
    }

    return null;
  }

  private async fetch(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const headers = new Headers(options.headers || {});

    // Set default content type if not form data and not already set
    if (!options.body || !(options.body instanceof FormData)) {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
    }

    // Handle CSRF token for non-GET requests
    if (options.method !== "GET" && options.method !== undefined) {
      let csrfToken: string | null = null;
      
      // If CSRF endpoint is provided, fetch from there
      if (this.csrfTokenUrl) {
        csrfToken = await this.fetchCSRFToken();
      } else {
        // Otherwise, try to get it from cookies (for Django-served frontends)
        csrfToken = await this.storage.getCSRFToken();
      }
      
      if (csrfToken) {
        headers.set("X-CSRFToken", csrfToken);
        await this.storage.setCSRFToken(csrfToken);
      }
    }

    // Add session token if available
    const sessionToken = await this.storage.getSessionToken();
    if (sessionToken) {
      headers.set("X-Session-Token", sessionToken);
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: options.credentials || "include",
      mode: options.mode || "cors",
    });

    // Handle session token from response
    if (response.ok) {
      try {
        const clonedResponse = response.clone();
        const data = await clonedResponse.json();
        if (data?.meta?.session_token) {
          await this.storage.setSessionToken(data.meta.session_token);
        }
      } catch {
        // Response might not be JSON
      }
    }

    // Handle 410 Gone (session expired)
    if (response.status === 410) {
      await this.storage.setSessionToken(null);
    }

    return response;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = path.startsWith('http') ? path : `${this.clientPath}${path}`;
    const response = await this.fetch(url, options);
    const data = await response.json();
    
    // For error responses, throw the error so TanStack Query treats it as a failure
    if (!response.ok && data.errors) {
      throw data;
    }
    
    return data as T;
  }

  // ============================================================================
  // Configuration
  // ============================================================================

  async getConfiguration(): Promise<ConfigurationResponse> {
    return this.request<ConfigurationResponse>('/config');
  }

  // ============================================================================
  // Authentication - Core
  // ============================================================================

  async getAuthenticationStatus(): Promise<
    AuthenticatedResponse | NotAuthenticatedResponse
  > {
    return this.request<AuthenticatedResponse | NotAuthenticatedResponse>(
      '/auth/session'
    );
  }

  async login(data: LoginRequest): Promise<
    AuthenticatedResponse | AuthenticationResponse
  > {
    return this.request<AuthenticatedResponse | AuthenticationResponse>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async logout(): Promise<NotAuthenticatedResponse> {
    return this.request<NotAuthenticatedResponse>('/auth/session', {
      method: 'DELETE',
    });
  }

  async signup(data: SignupRequest): Promise<
    AuthenticatedResponse | AuthenticationResponse
  > {
    return this.request<AuthenticatedResponse | AuthenticationResponse>(
      '/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async reauthenticate(data: ReauthenticateRequest): Promise<
    AuthenticatedResponse > {
    return this.request<AuthenticatedResponse>(
      '/auth/reauthenticate',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  // ============================================================================
  // Authentication - Login by Code
  // ============================================================================

  async requestLoginCode(data: LoginByCodeRequest): Promise<
    AuthenticationResponse
  > {
    return this.request<AuthenticationResponse>(
      '/auth/code/request',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async confirmLoginCode(data: ConfirmLoginCodeRequest): Promise<
    AuthenticatedResponse | AuthenticationResponse
  > {
    return this.request<AuthenticatedResponse | AuthenticationResponse>(
      '/auth/code/confirm',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  // ============================================================================
  // Email Management
  // ============================================================================

  async listEmailAddresses(): Promise<EmailAddressesResponse > {
    return this.request<EmailAddressesResponse>('/account/email');
  }

  async addEmailAddress(data: EmailAddressRequest): Promise<
    EmailAddressesResponse > {
    return this.request<EmailAddressesResponse>(
      '/account/email',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async removeEmailAddress(data: EmailAddressRequest): Promise<
    EmailAddressesResponse > {
    return this.request<EmailAddressesResponse>(
      '/account/email',
      {
        method: 'DELETE',
        body: JSON.stringify(data),
      }
    );
  }

  async changePrimaryEmailAddress(data: EmailPrimaryRequest): Promise<
    EmailAddressesResponse > {
    return this.request<EmailAddressesResponse>(
      '/account/email',
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
  }

  async requestEmailVerification(data: EmailAddressRequest): Promise<
    { status: 200 } > {
    return this.request<{ status: 200 }>(
      '/account/email',
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  async getEmailVerificationInfo(key: string): Promise<
    EmailVerificationInfoResponse > {
    return this.request<EmailVerificationInfoResponse>(
      `/auth/email/verify?key=${encodeURIComponent(key)}`
    );
  }

  async verifyEmail(data: EmailVerificationRequest): Promise<
    AuthenticatedResponse | AuthenticationResponse
  > {
    return this.request<AuthenticatedResponse | AuthenticationResponse>(
      '/auth/email/verify',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async resendEmailVerification(): Promise<{ status: 200 } > {
    return this.request<{ status: 200 }>(
      '/auth/email/verify/resend',
      {
        method: 'POST',
      }
    );
  }

  // ============================================================================
  // Phone Management
  // ============================================================================

  async getPhoneNumber(): Promise<PhoneNumberResponse > {
    return this.request<PhoneNumberResponse>('/account/phone');
  }

  async updatePhoneNumber(phone: string): Promise<
    PhoneNumberResponse > {
    return this.request<PhoneNumberResponse>(
      '/account/phone',
      {
        method: 'PUT',
        body: JSON.stringify({ phone }),
      }
    );
  }

  async removePhoneNumber(): Promise<{ status: 200 } > {
    return this.request<{ status: 200 }>(
      '/account/phone',
      {
        method: 'DELETE',
      }
    );
  }

  async verifyPhone(data: PhoneVerificationRequest): Promise<
    AuthenticatedResponse | AuthenticationResponse
  > {
    return this.request<AuthenticatedResponse | AuthenticationResponse>(
      '/auth/phone/verify',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async resendPhoneVerification(): Promise<{ status: 200 } > {
    return this.request<{ status: 200 }>(
      '/auth/phone/verify/resend',
      {
        method: 'POST',
      }
    );
  }

  // ============================================================================
  // Password Management
  // ============================================================================

  async requestPassword(data: PasswordResetRequest): Promise<
    { status: 200 } | AuthenticationResponse
  > {
    return this.request<{ status: 200 } | AuthenticationResponse>(
      '/auth/password/request',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async getPasswordResetInfo(key: string): Promise<
    PasswordResetInfoResponse > {
    return this.request<PasswordResetInfoResponse>(
      `/auth/password/reset?key=${encodeURIComponent(key)}`
    );
  }

  async resetPassword(data: PasswordResetConfirmRequest): Promise<
    AuthenticatedResponse | AuthenticationResponse
  > {
    return this.request<AuthenticatedResponse | AuthenticationResponse>(
      '/auth/password/reset',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async changePassword(data: PasswordChangeRequest): Promise<
    { status: 200 } > {
    return this.request<{ status: 200 }>(
      '/account/password/change',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  // ============================================================================
  // Social/Provider Authentication
  // ============================================================================

  async listProviderAccounts(): Promise<ProviderAccountsResponse> {
    return this.request<ProviderAccountsResponse>('/account/providers');
  }

  async disconnectProviderAccount(data: ProviderDisconnectRequest): Promise<
    ProviderAccountsResponse > {
    return this.request<ProviderAccountsResponse>(
      '/account/providers',
      {
        method: 'DELETE',
        body: JSON.stringify(data),
      }
    );
  }

  async providerRedirect(
    provider: string,
    callbackUrl: string,
    process: 'login' | 'connect' = 'login'
  ): Promise<void> {
    const url = `${this.browserPath}/auth/provider/redirect`;
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    
    const fields = { provider, callback_url: callbackUrl, process };
    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });
    
    document.body.appendChild(form);
    form.submit();
  }

  async providerToken(data: ProviderTokenRequest): Promise<
    AuthenticatedResponse | AuthenticationResponse
  > {
    return this.request<AuthenticatedResponse | AuthenticationResponse>(
      '/auth/provider/token',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async getProviderSignup(): Promise<ProviderSignupResponse > {
    return this.request<ProviderSignupResponse>(
      '/auth/provider/signup'
    );
  }

  async providerSignup(data: ProviderSignupRequest): Promise<
    AuthenticatedResponse | AuthenticationResponse
  > {
    return this.request<AuthenticatedResponse | AuthenticationResponse>(
      '/auth/provider/signup',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  // ============================================================================
  // Multi-Factor Authentication
  // ============================================================================

  async listAuthenticators(): Promise<AuthenticatorsResponse> {
    return this.request<AuthenticatorsResponse>('/account/authenticators');
  }

  async getTOTPAuthenticator(): Promise<
    TOTPAuthenticatorResponse | NoTOTPAuthenticatorResponse
  > {
    return this.request<TOTPAuthenticatorResponse | NoTOTPAuthenticatorResponse>(
      '/account/authenticators/totp'
    );
  }

  async activateTOTP(data: TOTPActivateRequest): Promise<
    TOTPAuthenticatorResponse > {
    return this.request<TOTPAuthenticatorResponse>(
      '/account/authenticators/totp',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async deactivateTOTP(): Promise<{ status: 200 } > {
    return this.request<{ status: 200 }>(
      '/account/authenticators/totp',
      {
        method: 'DELETE',
      }
    );
  }

  async listRecoveryCodes(): Promise<
    SensitiveRecoveryCodesAuthenticatorResponse | { status: 404 }
  > {
    return this.request<
      SensitiveRecoveryCodesAuthenticatorResponse | { status: 404 }
    >('/account/authenticators/recovery-codes');
  }

  async regenerateRecoveryCodes(): Promise<
    SensitiveRecoveryCodesAuthenticatorResponse > {
    return this.request<SensitiveRecoveryCodesAuthenticatorResponse>(
      '/account/authenticators/recovery-codes',
      {
        method: 'POST',
      }
    );
  }

  async mfaAuthenticate(data: MFAAuthenticateRequest): Promise<
    AuthenticatedResponse | AuthenticationResponse
  > {
    return this.request<AuthenticatedResponse | AuthenticationResponse>(
      '/auth/2fa/authenticate',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async mfaReauthenticate(): Promise<AuthenticatedResponse > {
    return this.request<AuthenticatedResponse>(
      '/auth/2fa/reauthenticate',
      {
        method: 'POST',
      }
    );
  }

  async mfaTrust(data: MFATrustRequest): Promise<
    AuthenticatedResponse
  > {
    const url = `${this.browserPath}/auth/2fa/trust`;
    const response = await this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const result = await response.json();
    
    // For error responses, throw the error so TanStack Query treats it as a failure
    if (!response.ok && result.errors) {
      throw result;
    }
    
    return result as AuthenticatedResponse;
  }

  // ============================================================================
  // WebAuthn
  // ============================================================================

  async getWebAuthnSignupOptions(): Promise<
    WebAuthnCredentialCreationOptions > {
    return this.request<WebAuthnCredentialCreationOptions>(
      '/auth/webauthn/signup'
    );
  }

  async webAuthnSignup(data: WebAuthnSignupRequest): Promise<
    AuthenticatedResponse | AuthenticationResponse
  > {
    return this.request<AuthenticatedResponse | AuthenticationResponse>(
      '/auth/webauthn/signup',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async getWebAuthnLoginOptions(): Promise<
    WebAuthnCredentialRequestOptions > {
    return this.request<WebAuthnCredentialRequestOptions>(
      '/auth/webauthn/login'
    );
  }

  async webAuthnLogin(data: WebAuthnLoginRequest): Promise<
    AuthenticatedResponse | AuthenticationResponse
  > {
    return this.request<AuthenticatedResponse | AuthenticationResponse>(
      '/auth/webauthn/login',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async getWebAuthnAuthenticateOptions(): Promise<
    WebAuthnCredentialRequestOptions > {
    return this.request<WebAuthnCredentialRequestOptions>(
      '/auth/webauthn/authenticate'
    );
  }

  async webAuthnAuthenticate(credential: string): Promise<
    AuthenticatedResponse | AuthenticationResponse
  > {
    return this.request<AuthenticatedResponse | AuthenticationResponse>(
      '/auth/webauthn/authenticate',
      {
        method: 'POST',
        body: JSON.stringify({ credential }),
      }
    );
  }

  async getWebAuthnReauthenticateOptions(): Promise<
    WebAuthnCredentialRequestOptions > {
    return this.request<WebAuthnCredentialRequestOptions>(
      '/auth/webauthn/reauthenticate'
    );
  }

  async webAuthnReauthenticate(credential: string): Promise<
    AuthenticatedResponse > {
    return this.request<AuthenticatedResponse>(
      '/auth/webauthn/reauthenticate',
      {
        method: 'POST',
        body: JSON.stringify({ credential }),
      }
    );
  }

  async listWebAuthnCredentials(): Promise<AuthenticatorsResponse> {
    return this.request<AuthenticatorsResponse>(
      '/account/authenticators/webauthn'
    );
  }

  async deleteWebAuthnCredential(id: string): Promise<
    AuthenticatorsResponse > {
    return this.request<AuthenticatorsResponse>(
      `/account/authenticators/webauthn`,
      {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      }
    );
  }

  // ============================================================================
  // Session Management
  // ============================================================================

  async listSessions(): Promise<SessionsResponse> {
    return this.request<SessionsResponse>('/auth/sessions');
  }

  async deleteSession(id?: number): Promise<SessionsResponse > {
    const path = id ? `/auth/sessions` : '/auth/session';
    return this.request<SessionsResponse>(path, {
      method: 'DELETE',
      body: id ? JSON.stringify({ id }) : undefined,
    });
  }
}

// ============================================================================
// Singleton Management
// ============================================================================

export function initializeClient(config: {
  baseUrl?: string;
  csrfTokenEndpoint?: string;
  clientType?: ClientType;
  storage?: StorageInterface;
}): AllauthClient {
  if (!clientInstance) {
    const { baseUrl = '', csrfTokenEndpoint, clientType = 'browser', storage } = config;
    clientInstance = new AllauthClient(
      baseUrl,
      csrfTokenEndpoint,
      clientType,
      storage || getStorage(clientType, baseUrl)
    );
  }
  return clientInstance;
}

export function getClient(): AllauthClient {
  if (!clientInstance) {
    throw new Error(
      'AllauthClient not initialized. Please wrap your app with AllauthProvider or call initializeClient first.'
    );
  }
  return clientInstance;
}