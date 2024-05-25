# Django Allauth React Module

This module provides a React context for handling user authentication using the `AllauthClient` class. It allows you to easily manage authentication state and perform authentication actions within your React components.

## Installation

```shell
npx jsr add @knowsuchagency/allauth-react
```

## Usage

1. Wrap your application or the components that require authentication with the `AuthProvider` component. Pass the necessary props:

   - `apiBaseUrl`: The base URL of your authentication API.
   - `client`: The client type, either `'app'` or `'browser'`.

   Example:

   ```jsx
   import React from "react";
   import { AuthProvider } from "@knowsuchagency/allauth-react";

   const App = () => {
     return (
       <AuthProvider apiBaseUrl="https://api.example.com" client="browser">
         {/* Your application components */}
       </AuthProvider>
     );
   };

   export default App;
   ```

2. Use the `useAuth` hook in your components to access the authentication state and functions.

   Example:

   ```jsx
   import React from "react";
   import { useAuth } from "@knowsuchagency/allauth-react";

   const LoginForm = () => {
     const { login, isAuthenticated, user } = useAuth();

     const handleLogin = async (e: React.FormEvent) => {
       e.preventDefault();
       const email = "user@example.com";
       const password = "password123";
       await login({ email, password });
     };

     if (isAuthenticated) {
       return <div>Welcome, {user?.display}!</div>;
     }

     return (
       <form onSubmit={handleLogin}>
         {/* Login form fields */}
         <button type="submit">Login</button>
       </form>
     );
   };

   export default LoginForm;
   ```

## API

### AuthProvider

The `AuthProvider` component is responsible for managing the authentication state and providing the authentication context to its children components.

Props:

- `children` (required): The child components that will have access to the authentication context.
- `apiBaseUrl` (required): The base URL of your authentication API.
- `client` (required): The client type, either `'app'` or `'browser'`.

### useAuth

The `useAuth` hook allows you to access the authentication state and functions within your components.

Returns:

- `user`: The currently authenticated user object, or `null` if not authenticated.
- `isAuthenticated`: A boolean indicating whether the user is authenticated.
- `login`: A function to initiate the login process. It accepts an object with `username` (optional), `email` (optional), and `password` (required) properties.
- `signup`: A function to initiate the signup process. It accepts an object with `email` (optional), `username` (optional), and `password` (required) properties.
- `logout`: A function to log out the currently authenticated user.

## Error Handling

The module logs errors to the console if there are any issues during the authentication process. You can customize the error handling logic by modifying the `catch` blocks in the `login`, `signup`, and `logout` functions.

## Example

Here's a complete example of how to use the authentication context module in a React application:

```jsx
// App.tsx
import React from 'react';
import { AuthProvider } from "@knowsuchagency/allauth-react";
import LoginForm from './LoginForm';

const App = () => {
  return (
    <AuthProvider apiBaseUrl="https://api.example.com" client="browser">
      <div>
        <h1>My App</h1>
        <LoginForm />
      </div>
    </AuthProvider>
  );
};

export default App;

// LoginForm.tsx
import React from 'react';
import { useAuth } from "@knowsuchagency/allauth-react";

const LoginForm = () => {
  const { login, isAuthenticated, user, logout } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = 'user@example.com';
    const password = 'password123';
    await login({ email, password });
  };

  const handleLogout = async () => {
    await logout();
  };

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user?.display}!</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin}>
      {/* Login form fields */}
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
```

In this example, the `App` component wraps the application with the `AuthProvider`, passing the necessary props. The `LoginForm` component uses the `useAuth` hook to access the authentication state and functions. It renders a login form if the user is not authenticated, and a welcome message with a logout button if the user is authenticated.
