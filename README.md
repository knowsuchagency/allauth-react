# Django Allauth React Module

React hooks and components for integrating with django-allauth's headless API.

## Installation

```bash
npx jsr add @knowsuchagency/allauth-react @knowsuchagency/allauth-fetch
```

This package also requires `@knowsuchagency/allauth-fetch` as a peer dependency.

## Quick Start

You can initialize the provider by directly passing a client:

```jsx
import { AllauthProvider, useAllauth } from "@knowsuchagency/allauth-react";
import { AllauthClient } from "@knowsuchagency/allauth-fetch";

// Initialize the client
const client = new AllauthClient("https://api.example.com", "/api/v1/csrf-token");

function App() {
  return (
    <AllauthProvider client={client}>
      <AuthenticatedApp />
    </AllauthProvider>
  );
}
```

Or you can let the AllauthProvider create the client for you:

```jsx
import { AllauthProvider } from "@knowsuchagency/allauth-react";

function App() {
  return (
    <AllauthProvider
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
  const { user, isAuthenticated, login, logout } = useAllauth();

  if (!isAuthenticated) {
    return (
      <LoginForm
        onSubmit={async (email, password) => {
          await login({ email, password });
        }}
      />
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

## Core Features

### Authentication Provider

The `AllauthProvider` component sets up the authentication context for your application.
You can initialize it in two ways:

#### Method 1: Pass a pre-configured client

```jsx
import { AllauthProvider } from "@knowsuchagency/allauth-react";
import { AllauthClient } from "@knowsuchagency/allauth-fetch";

const client = new AllauthClient("https://api.example.com");

function App() {
  return (
    <AllauthProvider client={client}>
      {/* Your app components */}
    </AllauthProvider>
  );
}
```

#### Method 2: Let the provider create the client

```jsx
import { AllauthProvider } from "@knowsuchagency/allauth-react";

function App() {
  return (
    <AllauthProvider
      baseUrl="https://api.example.com"
      csrfTokenEndpoint="/csrf-token/"
      clientType="browser"
    >
      {/* Your app components */}
    </AllauthProvider>
  );
}
```

### useAllauth Hook

The primary hook for accessing authentication state and methods:

```jsx
const {
  user, // Current user object or null
  isAuthenticated, // Boolean indicating auth status
  isLoading, // Boolean indicating loading state
  login, // Function to log in
  logout, // Function to log out
  signup, // Function to register new users
  requestPasswordReset, // Function to request password reset
  resetPassword, // Function to reset password
  reauthenticate, // Function to reauthenticate user
  verifyEmail, // Function to verify email
  changePassword, // Function to change password
  refreshAuthStatus, // Function to refresh auth status
} = useAllauth();
```

### Email Management

Use the `useEmailAddresses` hook to manage email addresses:

```jsx
const {
  emailAddresses, // Array of email addresses
  isLoading, // Boolean indicating loading state
  addEmail, // Function to add new email
  removeEmail, // Function to remove email
  setPrimaryEmail, // Function to set primary email
  refresh, // Function to refresh email list
} = useEmailAddresses();

// Example usage
await addEmail("new@example.com");
await setPrimaryEmail("primary@example.com");
```

### Two-Factor Authentication

Use the `useAuthenticators` hook to manage 2FA:

```jsx
const {
  authenticators, // Array of authenticator devices
  isLoading, // Boolean indicating loading state
  setupTOTP, // Function to set up TOTP
  deactivateTOTP, // Function to deactivate TOTP
  refresh, // Function to refresh authenticators
} = useAuthenticators();

// Example usage
await setupTOTP("123456"); // Setup TOTP with verification code
```

### Social Provider Accounts

Use the `useProviderAccounts` hook to manage connected social accounts:

```jsx
const {
  accounts, // Array of connected provider accounts
  isLoading, // Boolean indicating loading state
  disconnectAccount, // Function to disconnect account
  refresh, // Function to refresh accounts
} = useProviderAccounts();

// Example usage
await disconnectAccount("google", "account123");
```

## Complete Authentication Flow Example

Here's a complete example showing a login flow with email verification:

```jsx
function LoginPage() {
  const { login } = useAllauth();
  const [error, setError] = useState(null);

  const handleSubmit = async (email, password) => {
    try {
      await login({ email, password });
    } catch (err) {
      if (err.code === "email_verification_required") {
        // Handle email verification flow
        navigate("/verify-email");
      } else {
        setError(err.message);
      }
    }
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

## Error Handling

The library throws errors that match the django-allauth API responses. Always wrap async operations in try-catch blocks:

```jsx
try {
  await login({ email, password });
} catch (error) {
  // Handle specific error cases
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
```

## TypeScript Support

The library is written in TypeScript and provides full type definitions. Import types directly:

```typescript
import type {
  User,
  EmailAddress,
  Authenticator,
} from "@knowsuchagency/allauth-react";

// Example type usage
const handleUser = (user: User) => {
  console.log(user.display);
};
```

## Testing

When testing components that use these hooks, wrap them in the `AllauthProvider`:

```jsx
import { render, screen } from "@testing-library/react";
import { AllauthProvider } from "@knowsuchagency/allauth-react";

const mockClient = new AllauthClient("http://test.com");

test("renders authenticated content", () => {
  render(
    <AllauthProvider client={mockClient}>
      <YourComponent />
    </AllauthProvider>
  );
});
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
