# Django Allauth React Module

A comprehensive React library for integrating with django-allauth's headless API. Features complete API coverage, TanStack Query for server state management, and Zustand for reactive token storage.

## Features

✅ **Complete API Coverage** - All django-allauth headless endpoints implemented
✅ **TanStack Query Integration** - Automatic caching, refetching, and optimistic updates
✅ **TypeScript First** - Full type safety with comprehensive type exports
✅ **Reactive Token Management** - Zustand-based storage with hooks
✅ **Tree-Shakeable** - Import only what you need
✅ **Simple API** - Clean, intuitive hooks that wrap complexity

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
function AuthenticatedApp() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { login, isLoading: isLoggingIn } = useLogin();
  const { logout, isLoading: isLoggingOut } = useLogout();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <LoginForm
        onSubmit={(email, password) => login({ email, password })}
        isLoading={isLoggingIn}
      />
    );
  }

  return (
    <div>
      <h1>Welcome, {user.display}!</h1>
      <button onClick={logout} disabled={isLoggingOut}>
        Logout
      </button>
    </div>
  );
}
```

## Core Features

### Authentication Provider

The `AllauthProvider` component sets up both the authentication context and TanStack Query client for your application.

```jsx
import { AllauthProvider } from "@knowsuchagency/allauth-react";
import { QueryClient } from "@tanstack/react-query";

// Optionally provide your own QueryClient with custom configuration
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

### Authentication Hooks

#### `useAuth()` - Query hook for authentication status
```jsx
const { user, isAuthenticated, isLoading, isError, error, refetch } = useAuth();
```

#### `useLogin()` - Hook for user login
```jsx
const { login, isLoading, error } = useLogin();

// Usage
await login({ 
  email: "user@example.com", 
  password: "password" 
});
```

#### `useLogout()` - Hook for user logout
```jsx
const { logout, isLoading } = useLogout();

// Usage
await logout();
```

#### `useSignup()` - Hook for user registration
```jsx
const { signup, isLoading, error } = useSignup();

// Usage
await signup({
  email: "user@example.com",
  password: "password",
});
```

### Email Management

Use the `useEmailAddresses` hook to manage email addresses:

```jsx
const {
  emailAddresses,
  isLoading,
  add,
  remove,
  setPrimary,
  verify,
  requestVerification,
  getVerificationInfo,
  refetch,
} = useEmailAddresses();

// Add new email
await add("new@example.com");

// Set primary email
await setPrimary("primary@example.com");

// Request verification for an email
await requestVerification("email@example.com");

// Get information about an email verification key
const info = await getVerificationInfo("verification-key");
console.log(info.data.email); // Email being verified

// Verify email with key
await verify("verification-key");

// Resend verification for pending email verification flow
await resendVerification();
```

### Passwordless Authentication

```jsx
const { requestCode, confirmCode } = useLoginByCode();

// Request a login code via email
await requestCode.mutateAsync({ email: "user@example.com" });

// Confirm the code to log in
await confirmCode.mutateAsync({ code: "123456" });
```

### Reauthentication

```jsx
// Password reauthentication for sensitive operations
const reauthenticate = useReauthenticate();
await reauthenticate.mutateAsync({ password: "current-password" });

// MFA reauthentication
const mfaReauth = useMfaReauthenticate();
await mfaReauth.mutateAsync();

// WebAuthn reauthentication
const { getReauthenticateOptions, reauthenticate: webauthnReauth } = useWebAuthn();
const options = await getReauthenticateOptions();
const assertion = await navigator.credentials.get(JSON.parse(options.data.request_options));
await webauthnReauth(JSON.stringify(assertion));
```

### Social Provider Accounts

Use the `useProviderAccounts` hook to manage connected social accounts:

```jsx
const {
  accounts,
  isLoading,
  disconnect,
  refetch,
} = useProviderAccounts();

// Disconnect a social account
await disconnect("google", "account123");
```

For social authentication flows:

```jsx
const { redirect, token } = useProviderAuth();

// Redirect-based flow
await redirect.mutateAsync({
  provider: "google",
  callbackUrl: "/auth/callback",
  process: "login", // or "connect"
});

// Token-based flow (for mobile apps)
await token.mutateAsync({
  provider: "google",
  process: "login",
  token: {
    client_id: "your-client-id",
    id_token: "oauth-id-token",
    access_token: "oauth-access-token"
  }
});
```

### Password Management

```jsx
// Password reset flow
const { request, confirm, getInfo } = usePasswordReset();

// Request password reset
await request("user@example.com");

// Confirm password reset with key
await confirm("reset-key", "new-password");

// Change password for authenticated user
const { changePassword } = useChangePassword();
await changePassword("old-password", "new-password");

// Get information about a password reset key
const info = await getInfo("reset-key");
console.log(info.data.user); // User associated with this reset key
```

### Session Management

```jsx
const {
  sessions,
  isLoading,
  end,
  endCurrent,
  refetch,
} = useSessions();

// Delete current session (logout)
await endCurrent();

// Delete a specific session by ID
await end(sessionId);

// View active sessions
sessions.forEach(session => {
  console.log(session.ip, session.created_at);
  console.log(session.is_current); // Is this the current session?
});
```

## Advanced Usage

### Query Keys

The library exports query keys for advanced cache management:

```jsx
import { allauthQueryKeys } from "@knowsuchagency/allauth-react";
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

// Invalidate specific queries
queryClient.invalidateQueries({ 
  queryKey: allauthQueryKeys.authStatus() 
});

// Invalidate all email-related queries
queryClient.invalidateQueries({ 
  queryKey: allauthQueryKeys.emails() 
});

// Helper functions for bulk invalidation
import { getAuthInvalidationKeys, getAllInvalidationKeys } from "@knowsuchagency/allauth-react";

// Invalidate all auth-related queries
getAuthInvalidationKeys().forEach(key => {
  queryClient.invalidateQueries({ queryKey: key });
});
```

### Error Handling

All hooks provide consistent error handling:

```jsx
const { login, isLoading, error } = useLogin();

const handleLogin = async (email, password) => {
  try {
    await login({ email, password });
  } catch (error) {
    switch (error.code) {
      case "invalid_credentials":
        setError("Invalid email or password");
        break;
      case "email_verification_required":
        navigate("/verify-email");
        break;
      default:
        setError("An unexpected error occurred");
    }
  }
};

// Or use the error state directly
{error && (
  <div>Error: {error.message}</div>
)}
```

### Optimistic Updates

The library implements optimistic updates for better UX:

- Login/signup immediately updates auth status
- Email operations update the list optimistically
- Social account disconnection reflects immediately

### Background Refetching

Authentication status is automatically refetched in the background to keep the session fresh. Configure this behavior via the QueryClient:

```jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});
```

## TypeScript Support

The library is written in TypeScript and provides full type definitions:

```typescript
import type {
  User,
  EmailAddress,
  ProviderAccount,
  Session,
  ErrorResponse,
  AuthenticatedResponse,
  ConfigurationResponse,
} from "@knowsuchagency/allauth-react";

// All hooks are fully typed
const { user }: { user: User | null } = useAuth();

// Mutation results include proper error types
const loginMutation = useLogin();
if (loginMutation.error) {
  const error: ErrorResponse = loginMutation.error;
  console.log(error.errors[0].message);
}
```

## API Coverage

### ✅ Implemented Features

#### Authentication
- Login (username/email + password)
- Logout
- Signup/Registration
- Passwordless login via email code
- Reauthentication for sensitive operations
- Session management (list, delete)

#### Email Management
- Add/remove email addresses
- Set primary email
- Email verification with keys
- Request verification
- Resend verification
- Get verification info

#### Phone Number Management
- Update phone number
- Remove phone number
- Phone verification with SMS codes
- Resend verification codes

#### Password Management
- Password reset flow (request, confirm)
- Change password
- Get reset key info

#### Social Authentication
- Provider redirect flow
- Token-based flow (mobile)
- List connected accounts
- Disconnect accounts
- Complete provider signup (when additional info required)

#### Multi-Factor Authentication (MFA)
- TOTP authenticator setup and management
- Recovery codes generation and regeneration
- MFA authentication during login
- MFA reauthentication for sensitive operations
- Browser trust (skip MFA temporarily)

#### WebAuthn / Passkeys
- Passwordless login with biometrics
- WebAuthn credential registration
- Passkey authentication
- WebAuthn for 2FA
- Credential management

#### Configuration
- Fetch django-allauth settings
- Available providers
- Authentication methods
- MFA configuration

### Phone Number Management

```jsx
const {
  phoneNumber,
  isLoading,
  updatePhone,
  removePhone,
  verifyPhone,
  resendVerification,
} = usePhoneNumber();

// Update phone number
await updatePhone.mutateAsync("+1234567890");

// Verify with SMS code
await verifyPhone.mutateAsync("123456");

// Remove phone number
await removePhone.mutateAsync();
```

### Multi-Factor Authentication (MFA)

#### TOTP Authenticator Setup

```jsx
const { authenticators, getTOTP, setupTOTP, deactivateTOTP } = useAuthenticators();

// Get TOTP setup info (includes secret and QR code URL)
const totpInfo = await getTOTP();
if (totpInfo.status === 404) {
  // Show QR code: totpInfo.data.meta.totp_url
  // User scans with authenticator app, then:
  await setupTOTP.mutateAsync("123456");
}

// Deactivate TOTP
await deactivateTOTP.mutateAsync();
```

#### Recovery Codes

```jsx
const { recoveryCodes, regenerateCodes, isRegenerating } = useRecoveryCodes();

// Display recovery codes (save these securely!)
if (recoveryCodes) {
  recoveryCodes.unused_codes.forEach(code => console.log(code));
}

// Generate new recovery codes
await regenerateCodes();
```

#### MFA During Login

```jsx
// When login returns 401 with mfa_authenticate flow
const mfaAuth = useMfaAuthenticate();
await mfaAuth.mutateAsync("123456"); // TOTP or recovery code

// For MFA reauthentication
const mfaReauth = useMfaReauthenticate();
await mfaReauth.mutateAsync();

// Trust this browser (skip MFA temporarily)
const trustBrowser = useMfaTrust();
await trustBrowser.mutateAsync(true);
```

### WebAuthn / Passkeys

```jsx
const {
  credentials,
  getSignupOptions,
  signup,
  getLoginOptions,
  login,
  deleteCredential,
} = useWebAuthn();

// Register new WebAuthn credential
const options = await getSignupOptions();
// Use WebAuthn API to create credential
const credential = await navigator.credentials.create(JSON.parse(options.data.creation_options));
await signup({ 
  credential: JSON.stringify(credential),
  email: "user@example.com" 
});

// Login with WebAuthn
const loginOptions = await getLoginOptions();
const assertion = await navigator.credentials.get(JSON.parse(loginOptions.data.request_options));
await login(JSON.stringify(assertion));

// Manage credentials
await deleteCredential("credential-id");
```

### Provider Signup Completion

```jsx
const { signupInfo, completeSignup, refetch } = useProviderSignup();

// Check if provider signup is pending (after social login)
if (signupInfo) {
  // Show form to collect missing data
  console.log(signupInfo.account.provider); // e.g., "google"
  console.log(signupInfo.email_addresses); // Available emails
  
  // Complete signup with additional data
  await completeSignup({
    email: signupInfo.email || "user@example.com",
    username: "desired-username"
  });
}
```

## Advanced Features

### Configuration Hook

Fetch django-allauth configuration settings:

```jsx
const { data: config, isLoading } = useConfig();

if (config) {
  console.log(config.account.authentication_method); // "email", "username", or "username_email"
  console.log(config.socialaccount.providers); // Available social providers
  console.log(config.mfa.supported_types); // Available MFA methods
}
```

### Token Storage

The library uses Zustand for reactive token management:

```jsx
import { useAuthTokens } from "@knowsuchagency/allauth-react";

function TokenMonitor() {
  const { sessionToken, csrfToken, clearTokens } = useAuthTokens();
  
  return (
    <div>
      <p>Session: {sessionToken ? "Active" : "None"}</p>
      <button onClick={clearTokens}>Clear All Tokens</button>
    </div>
  );
}
```

### Client Types

The library supports both browser and app client types:

```jsx
// For browser applications (default)
<AllauthProvider 
  baseUrl="https://api.example.com"
  clientType="browser"
>

// For mobile/native applications
<AllauthProvider 
  baseUrl="https://api.example.com"
  clientType="app"
>
```

## Testing

When testing components that use these hooks, wrap them in the `AllauthProvider`:

```jsx
import { render, screen } from "@testing-library/react";
import { AllauthProvider } from "@knowsuchagency/allauth-react";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

test("renders authenticated content", () => {
  render(
    <AllauthProvider 
      baseUrl="http://test.com"
      queryClient={queryClient}
    >
      <YourComponent />
    </AllauthProvider>
  );
});
```

## Benefits of TanStack Query Integration

- **Automatic Caching**: Reduces unnecessary API calls
- **Background Refetching**: Keeps data fresh automatically
- **Optimistic Updates**: Instant UI feedback
- **Request Deduplication**: Multiple components can request the same data
- **Built-in Loading/Error States**: Consistent state management
- **DevTools Support**: Inspect cache and queries with React Query DevTools
- **Suspense Ready**: Compatible with React Suspense for data fetching

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
