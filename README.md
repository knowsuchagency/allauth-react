# Django Allauth React Module

A comprehensive React library for integrating with django-allauth's headless API. Features intuitive high-level hooks for common authentication flows, complete API coverage with TanStack Query, and reactive token management with Zustand.

## Features

✅ **Intuitive High-Level API** - Simple hooks for common authentication patterns  
✅ **Complete API Coverage** - All django-allauth headless endpoints implemented  
✅ **TanStack Query Integration** - Automatic caching, refetching, and optimistic updates  
✅ **TypeScript First** - Full type safety with comprehensive type exports  
✅ **Reactive Token Management** - Zustand-based storage with hooks  
✅ **Tree-Shakeable** - Import only what you need  

## Installation

```bash
npm install @knowsuchagency/django-allauth
# or
bun add @knowsuchagency/django-allauth
```

## Quick Start

### 1. Set up the Provider

```jsx
import { AllauthProvider } from "@knowsuchagency/django-allauth";

function App() {
  return (
    <AllauthProvider
      // Optional: configure your API endpoint
      baseUrl="https://api.example.com"
    >
      <YourApp />
    </AllauthProvider>
  );
}
```

### 2. Use the High-Level Hooks

```jsx
import { useAuth } from "@knowsuchagency/django-allauth";

function YourApp() {
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    isLoading 
  } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        login({
          email: formData.get('email'),
          password: formData.get('password')
        });
      }}>
        <input name="email" type="email" required />
        <input name="password" type="password" required />
        <button type="submit">Login</button>
      </form>
    );
  }

  return (
    <div>
      <h1>Welcome, {user.display}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## High-Level Hooks (Recommended)

### `useAuth()` - Complete Authentication Management

The main hook for authentication, combining status, login, logout, and signup.

```jsx
const {
  // State
  user,              // User object or null
  isAuthenticated,   // Simple boolean check
  isLoading,        // Loading auth status
  error,            // Auth query error
  
  // Actions
  login,            // (credentials) => Promise
  logout,           // () => Promise
  signup,           // (credentials) => Promise
  
  // Mutation states
  isLoggingIn,      
  isLoggingOut,     
  isSigningUp,      
  
  // Mutation errors
  loginError,       
  logoutError,      
  signupError,      
  
  // Utilities
  refetch,          // Refresh auth status
} = useAuth();
```

**Example: Complete Auth Flow**

```jsx
function AuthExample() {
  const { user, isAuthenticated, login, logout, signup } = useAuth();

  if (!isAuthenticated) {
    return (
      <>
        <LoginForm onSubmit={login} />
        <SignupForm onSubmit={signup} />
      </>
    );
  }

  return <Dashboard/>;
}
```

### `useEmailManagement()` - Email Address Management

Comprehensive email management with verification support.

```jsx
const {
  // Data
  emails,             // All email addresses
  primaryEmail,       // Current primary email
  verifiedEmails,     // List of verified emails
  unverifiedEmails,   // List of unverified emails
  
  // Actions
  addEmail,           // (email) => Promise
  removeEmail,        // (email) => Promise
  setPrimary,         // (email) => Promise
  requestVerification,// (email) => Promise
  verifyEmail,        // (key) => Promise
  resendVerification, // () => Promise
  
  // States
  isAdding,
  isRemoving,
  isVerifying,
} = useEmailManagement();
```

**Example: Email Management UI**

```jsx
function EmailManager() {
  const { 
    emails, 
    primaryEmail, 
    addEmail, 
    setPrimary, 
    removeEmail 
  } = useEmailManagement();

  return (
    <div>
      <h2>Email Addresses</h2>
      {emails.map(email => (
        <div key={email.email}>
          <span>{email.email}</span>
          {email.primary && <span> (Primary)</span>}
          {email.verified && <span> ✓</span>}
          
          {!email.primary && (
            <>
              <button onClick={() => setPrimary(email.email)}>
                Make Primary
              </button>
              <button onClick={() => removeEmail(email.email)}>
                Remove
              </button>
            </>
          )}
        </div>
      ))}
      
      <button onClick={() => {
        const email = prompt('Enter email address');
        if (email) addEmail(email);
      }}>
        Add Email
      </button>
    </div>
  );
}
```

### `usePasswordReset()` - Password Reset Flow

Simple password reset management.

```jsx
const {
  requestReset,    // (email) => Promise
  confirmReset,    // (key, password) => Promise
  isRequesting,
  isConfirming,
  requestError,
  confirmError,
} = usePasswordReset();
```

**Example: Password Reset Flow**

```jsx
function PasswordResetFlow() {
  const { requestReset, confirmReset, isRequesting } = usePasswordReset();
  const [step, setStep] = useState('request');

  if (step === 'request') {
    return (
      <form onSubmit={async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        await requestReset(email);
        setStep('confirm');
      }}>
        <input name="email" type="email" required />
        <button disabled={isRequesting}>
          Send Reset Email
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      const key = e.target.key.value;
      const password = e.target.password.value;
      await confirmReset(key, password);
      // User is now logged in with new password
    }}>
      <input name="key" placeholder="Reset code from email" required />
      <input name="password" type="password" required />
      <button>Reset Password</button>
    </form>
  );
}
```

### `useSocialAuth()` - Social Provider Authentication

OAuth and social authentication management.

```jsx
const {
  connectedProviders,    // List of connected accounts
  hasProvider,           // (provider) => boolean
  connect,               // (provider, callbackUrl) => Promise
  disconnect,            // (provider, uid) => Promise
  authenticateWithToken, // (tokenData) => Promise
  isConnecting,
  isDisconnecting,
} = useSocialAuth();
```

**Example: Social Login Buttons**

```jsx
function SocialLogin() {
  const { connectedProviders, connect, disconnect } = useSocialAuth();

  const providers = ['google', 'github', 'facebook'];

  return (
    <div>
      {providers.map(provider => {
        const connected = connectedProviders.find(
          p => p.provider.id === provider
        );

        if (connected) {
          return (
            <button 
              key={provider}
              onClick={() => disconnect(provider, connected.uid)}
            >
              Disconnect {provider}
            </button>
          );
        }

        return (
          <button 
            key={provider}
            onClick={() => connect(provider, '/auth/callback')}
          >
            Connect with {provider}
          </button>
        );
      })}
    </div>
  );
}
```

## Advanced Usage

For more control, you can use the granular hooks that map directly to the django-allauth API:

### Authentication Hooks

```jsx
import { 
  useAuthStatus,
  useLogin,
  useLogout,
  useSignup,
  useVerifyEmail,
  useRequestPasswordReset,
  useResetPassword,
  // ... many more
} from "@knowsuchagency/django-allauth";
```

### Direct API Client Access

For cases not covered by hooks, access the API client directly:

```jsx
import { getClient } from "@knowsuchagency/django-allauth";

function CustomComponent() {
  const handleCustomAction = async () => {
    const client = getClient();
    const result = await client.getAuthenticationStatus();
    console.log(result);
  };
}
```

### Custom QueryClient Configuration

Provide your own TanStack Query configuration:

```jsx
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes
      retry: 2,
    },
  },
});

function App() {
  return (
    <AllauthProvider queryClient={queryClient}>
      <YourApp />
    </AllauthProvider>
  );
}
```

### Token Management

Access authentication tokens reactively:

```jsx
import { useAuthTokens } from "@knowsuchagency/django-allauth";

function TokenDebug() {
  const { sessionToken, csrfToken, clearTokens } = useAuthTokens();
  
  return (
    <div>
      <p>Session: {sessionToken || 'none'}</p>
      <p>CSRF: {csrfToken || 'none'}</p>
      <button onClick={clearTokens}>Clear All Tokens</button>
    </div>
  );
}
```

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  User,
  UseAuthResult,
  LoginRequest,
  EmailAddress,
  ProviderAccount,
} from "@knowsuchagency/django-allauth";

interface Props {
  onAuth: (result: UseAuthResult) => void;
}
```

## Cache Management

Use TanStack Query's cache management with our query keys:

```jsx
import { useQueryClient } from "@tanstack/react-query";
import { allauthQueryKeys } from "@knowsuchagency/django-allauth";

function RefreshButton() {
  const queryClient = useQueryClient();

  const refreshAuth = () => {
    queryClient.invalidateQueries({ 
      queryKey: allauthQueryKeys.authStatus() 
    });
  };

  const refreshEverything = () => {
    queryClient.invalidateQueries({ 
      queryKey: allauthQueryKeys.all 
    });
  };

  return (
    <>
      <button onClick={refreshAuth}>Refresh Auth</button>
      <button onClick={refreshEverything}>Refresh All</button>
    </>
  );
}
```

## Complete Example Application

```jsx
import { 
  AllauthProvider, 
  useAuth, 
  useEmailManagement, 
  useSocialAuth 
} from "@knowsuchagency/django-allauth";

function App() {
  return (
    <AllauthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<ProtectedRoute />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </AllauthProvider>
  );
}

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/" />;
  
  return <Dashboard />;
}

function Home() {
  const { isAuthenticated, login, signup } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div>
      <h1>Welcome</h1>
      <LoginForm onSubmit={login} />
      <SignupForm onSubmit={signup} />
      <SocialAuthButtons />
    </div>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <h1>Hi, {user.display}!</h1>
      <nav>
        <Link to="/settings">Settings</Link>
        <button onClick={logout}>Logout</button>
      </nav>
    </div>
  );
}

function Settings() {
  const { user } = useAuth();
  const emailManagement = useEmailManagement();
  const socialAuth = useSocialAuth();
  
  return (
    <div>
      <h1>Account Settings</h1>
      
      <section>
        <h2>Profile</h2>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
      </section>
      
      <section>
        <h2>Email Addresses</h2>
        <EmailManager {...emailManagement} />
      </section>
      
      <section>
        <h2>Connected Accounts</h2>
        <SocialAccounts {...socialAuth} />
      </section>
    </div>
  );
}
```

## API Reference

### High-Level Hooks
- `useAuth()` - Complete authentication management
- `useEmailManagement()` - Email address operations
- `usePasswordReset()` - Password reset flow
- `useSocialAuth()` - Social provider management

### Granular Hooks Structure
Organized following the django-allauth OpenAPI specification:

- **Authentication**
  - Current Session: `useAuthStatus()`, `useLogout()`
  - Account: `useLogin()`, `useSignup()`, `useReauthenticate()`
  - Password Reset: `useRequestPasswordReset()`, `useResetPassword()`
  - Email/Phone Verification: `useVerifyEmail()`, `useVerifyPhone()`
  - Providers: `useProviderRedirect()`, `useProviderToken()`
  - Two-Factor: `useMfaAuthenticate()`, `useMfaTrust()`
  - WebAuthn: `useWebAuthnLogin()`, `useWebAuthnSignup()`

- **Account Management**
  - Email: `useEmailAddresses()`, `useAddEmailAddress()`, etc.
  - Phone: `usePhoneNumber()`, `useUpdatePhoneNumber()`
  - Password: `useChangePassword()`
  - Providers: `useProviderAccounts()`, `useDisconnectProvider()`
  - Authenticators: `useAuthenticators()`, `useActivateTOTP()`, etc.

- **Sessions**
  - `useListSessions()`, `useDeleteSession()`

- **Configuration**
  - `useConfig()` - Get allauth configuration

## License

MIT
