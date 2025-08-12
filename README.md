# Django Allauth React Module

A comprehensive React library for integrating with django-allauth's headless API. Features complete API coverage, TanStack Query for server state management, and Zustand for reactive token storage.

## Features

✅ **Complete API Coverage** - All django-allauth headless endpoints implemented  
✅ **TanStack Query Integration** - Automatic caching, refetching, and optimistic updates  
✅ **TypeScript First** - Full type safety with comprehensive type exports  
✅ **Reactive Token Management** - Zustand-based storage with hooks  
✅ **Tree-Shakeable** - Import only what you need  
✅ **OpenAPI-Aligned Structure** - Hooks organized to mirror django-allauth's API structure  

## Installation

```bash
npx jsr add @knowsuchagency/allauth-react
```

## Quick Start

Initialize the provider with your API configuration:

```jsx
import { AllauthProvider } from "@knowsuchagency/allauth-react";

function App() {
  return (
    <AllauthProvider
      // these arguments are optional
      baseUrl="https://api.example.com"
      csrfTokenEndpoint="/api/v1/csrf-token"
    >
      <AuthenticatedApp />
    </AllauthProvider>
  );
}
```

Then you can use the authentication hooks:

```jsx
import { useAuthStatus, useLogin, useLogout } from "@knowsuchagency/allauth-react";

function AuthenticatedApp() {
  const auth = useAuthStatus();
  const login = useLogin();
  const logout = useLogout();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (!auth.data?.meta?.is_authenticated) {
    return (
      <LoginForm
        onSubmit={(email, password) => login.mutate({ email, password })}
        isLoading={login.isPending}
      />
    );
  }

  return (
    <div>
      <h1>Welcome, {auth.data.data.user.display}!</h1>
      <button onClick={() => logout.mutate()} disabled={logout.isPending}>
        Logout
      </button>
    </div>
  );
}
```

## Hook Organization

Hooks are organized to mirror the django-allauth OpenAPI specification structure:

### Authentication Hooks

#### Current Session
- `useAuthStatus()` - Get current authentication status
- `useLogout()` - Logout current user

#### Account Management
- `useLogin()` - Login with credentials
- `useSignup()` - Register new account
- `useReauthenticate()` - Reauthenticate for sensitive operations
- `useVerifyEmail()` - Verify email address
- `useResendEmailVerification()` - Resend verification email
- `useVerifyPhone()` - Verify phone number
- `useResendPhoneVerification()` - Resend phone verification

#### Password Reset
- `useRequestPasswordReset()` - Request password reset email
- `getPasswordResetInfo()` - Get reset token info
- `useResetPassword()` - Reset password with token

#### Login by Code
- `useRequestLoginCode()` - Request login code via email
- `useConfirmLoginCode()` - Confirm code to login

#### Provider Authentication
- `useProviderRedirect()` - Redirect to OAuth provider
- `useProviderToken()` - Authenticate with provider token
- `useProviderSignupData()` - Get provider signup data
- `useProviderSignup()` - Complete provider signup

#### Two-Factor Authentication
- `useMfaAuthenticate()` - Authenticate with 2FA code
- `useMfaReauthenticate()` - Reauthenticate with 2FA
- `useMfaTrust()` - Trust current device

#### WebAuthn
- `useWebAuthnSignup()` - Register with WebAuthn
- `useWebAuthnLogin()` - Login with WebAuthn
- `useWebAuthnAuthenticate()` - Authenticate with WebAuthn
- `useWebAuthnReauthenticate()` - Reauthenticate with WebAuthn

### Account Management Hooks

#### Email Management
- `useEmailAddresses()` - List email addresses
- `useAddEmailAddress()` - Add new email
- `useRemoveEmailAddress()` - Remove email
- `useSetPrimaryEmail()` - Set primary email
- `useRequestEmailVerification()` - Request verification

#### Phone Management
- `usePhoneNumber()` - Get phone number
- `useUpdatePhoneNumber()` - Update phone number
- `useRemovePhoneNumber()` - Remove phone number

#### Password
- `useChangePassword()` - Change current password

#### Provider Accounts
- `useProviderAccounts()` - List connected providers
- `useDisconnectProvider()` - Disconnect provider

#### Authenticators (MFA)
- `useAuthenticators()` - List authenticators
- `useActivateTOTP()` - Activate TOTP authenticator
- `useDeactivateTOTP()` - Deactivate TOTP
- `useRegenerateRecoveryCodes()` - Generate new recovery codes
- `useWebAuthnCredentials()` - List WebAuthn credentials
- `useDeleteWebAuthnCredential()` - Delete WebAuthn credential

### Session Management
- `useListSessions()` - List all sessions
- `useDeleteSession()` - Delete a session

### Configuration
- `useConfig()` - Get allauth configuration

## Core Features

### Authentication Provider

The `AllauthProvider` component sets up both the authentication context and TanStack Query client:

```jsx
import { AllauthProvider } from "@knowsuchagency/allauth-react";
import { QueryClient } from "@tanstack/react-query";

// Optionally provide your own QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

function App() {
  return (
    <AllauthProvider
      baseUrl="https://api.example.com"
      queryClient={queryClient}
    >
      {/* Your app components */}
    </AllauthProvider>
  );
}
```

### Direct API Client Access

For advanced use cases, you can access the API client directly:

```jsx
import { getClient } from "@knowsuchagency/allauth-react";

function MyComponent() {
  const handleCustomAction = async () => {
    const client = getClient();
    const result = await client.getAuthenticationStatus();
    console.log(result);
  };
}
```

### Token Storage

The library provides reactive token storage with Zustand:

```jsx
import { useAuthTokens } from "@knowsuchagency/allauth-react";

function TokenInfo() {
  const { sessionToken, csrfToken, clearTokens } = useAuthTokens();
  
  return (
    <div>
      <p>Session Token: {sessionToken}</p>
      <button onClick={clearTokens}>Clear Tokens</button>
    </div>
  );
}
```

## Example: Complete Authentication Flow

```jsx
import {
  useAuthStatus,
  useLogin,
  useSignup,
  useRequestPasswordReset,
  useResetPassword,
} from "@knowsuchagency/allauth-react";

function AuthFlow() {
  const auth = useAuthStatus();
  const login = useLogin();
  const signup = useSignup();
  const requestReset = useRequestPasswordReset();
  const resetPassword = useResetPassword();

  // Check authentication
  if (auth.data?.meta?.is_authenticated) {
    return <Dashboard user={auth.data.data.user} />;
  }

  // Login
  const handleLogin = async (email, password) => {
    try {
      await login.mutateAsync({ email, password });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Signup
  const handleSignup = async (email, password) => {
    try {
      await signup.mutateAsync({ email, password });
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  // Password reset
  const handlePasswordReset = async (email) => {
    try {
      await requestReset.mutateAsync({ email });
      // Show "Check your email" message
    } catch (error) {
      console.error("Reset request failed:", error);
    }
  };

  // Confirm password reset
  const handleResetConfirm = async (key, password) => {
    try {
      await resetPassword.mutateAsync({ key, password });
    } catch (error) {
      console.error("Password reset failed:", error);
    }
  };

  return (
    <AuthenticationForm
      onLogin={handleLogin}
      onSignup={handleSignup}
      onPasswordReset={handlePasswordReset}
      onResetConfirm={handleResetConfirm}
    />
  );
}
```

## Example: Email Management

```jsx
import {
  useEmailAddresses,
  useAddEmailAddress,
  useSetPrimaryEmail,
  useRemoveEmailAddress,
} from "@knowsuchagency/allauth-react";

function EmailManager() {
  const emails = useEmailAddresses();
  const addEmail = useAddEmailAddress();
  const setPrimary = useSetPrimaryEmail();
  const removeEmail = useRemoveEmailAddress();

  const handleAddEmail = async (email) => {
    await addEmail.mutateAsync({ email });
  };

  const handleSetPrimary = async (email) => {
    await setPrimary.mutateAsync({ email, primary: true });
  };

  const handleRemoveEmail = async (email) => {
    await removeEmail.mutateAsync({ email });
  };

  if (emails.isLoading) return <div>Loading...</div>;

  return (
    <div>
      {emails.data?.data.map((emailObj) => (
        <div key={emailObj.email}>
          <span>{emailObj.email}</span>
          {emailObj.primary && <span>(Primary)</span>}
          {emailObj.verified && <span>✓ Verified</span>}
          {!emailObj.primary && (
            <button onClick={() => handleSetPrimary(emailObj.email)}>
              Make Primary
            </button>
          )}
          {!emailObj.primary && (
            <button onClick={() => handleRemoveEmail(emailObj.email)}>
              Remove
            </button>
          )}
        </div>
      ))}
      <button onClick={() => handleAddEmail("new@example.com")}>
        Add Email
      </button>
    </div>
  );
}
```

## Example: Two-Factor Authentication

```jsx
import {
  useAuthenticators,
  useActivateTOTP,
  useDeactivateTOTP,
  getTOTPAuthenticator,
} from "@knowsuchagency/allauth-react";

function TwoFactorSetup() {
  const authenticators = useAuthenticators();
  const activateTOTP = useActivateTOTP();
  const deactivateTOTP = useDeactivateTOTP();

  const setupTOTP = async () => {
    // Get TOTP secret
    const totpData = await getTOTPAuthenticator();
    
    // Show QR code to user
    displayQRCode(totpData.data.totp_url);
    
    // User enters code from authenticator app
    const code = await promptForCode();
    
    // Activate TOTP
    await activateTOTP.mutateAsync({ code });
  };

  const removeTOTP = async () => {
    await deactivateTOTP.mutateAsync();
  };

  const hasTOTP = authenticators.data?.data.some(
    auth => auth.type === 'totp'
  );

  return (
    <div>
      {hasTOTP ? (
        <button onClick={removeTOTP}>Disable 2FA</button>
      ) : (
        <button onClick={setupTOTP}>Enable 2FA</button>
      )}
    </div>
  );
}
```

## TypeScript

The library is written in TypeScript and exports all types:

```typescript
import type {
  User,
  AuthenticatedResponse,
  LoginRequest,
  EmailAddress,
  ProviderAccount,
} from "@knowsuchagency/allauth-react";
```

## Query Key Management

For cache invalidation and manual queries:

```jsx
import { allauthQueryKeys } from "@knowsuchagency/allauth-react";
import { useQueryClient } from "@tanstack/react-query";

function RefreshAuth() {
  const queryClient = useQueryClient();

  const refreshAll = () => {
    // Invalidate all auth-related queries
    queryClient.invalidateQueries({ 
      queryKey: allauthQueryKeys.all 
    });
  };

  const refreshEmails = () => {
    // Invalidate only email queries
    queryClient.invalidateQueries({ 
      queryKey: allauthQueryKeys.emailAddresses() 
    });
  };

  return (
    <>
      <button onClick={refreshAll}>Refresh All</button>
      <button onClick={refreshEmails}>Refresh Emails</button>
    </>
  );
}
```

## License

MIT