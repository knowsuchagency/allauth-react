# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React hooks and components library for integrating with django-allauth's headless API. The library is published to npm as `@knowsuchagency/django-allauth`.

## Development Commands

### Package Management
- Use `bun` for package management (preferred over npm)
- Install dependencies: `bun install`
- Add dependency: `bun add <package>`

### Building
- Build the package: `bun run build`
- This creates CommonJS and ESM builds in the `dist` directory
- TypeScript declarations are also generated

### Publishing
- The package is published to npm automatically via GitHub Actions when pushing to main
- Manual publish: `npm publish` (after running `bun run build`)
- Version is managed in `package.json` (current: 0.12.1)
- Requires NPM_TOKEN secret in GitHub repository settings for automated publishing

## Architecture

### Core Structure
- **Multi-file modular architecture**: Organized in `lib/` directory with logical separation
- **TypeScript-first**: Written in TypeScript with full type definitions
- **TanStack Query**: Uses React Query for server state management
- **Zustand**: Uses Zustand for reactive token storage
- **Dependencies**: 
  - `@tanstack/react-query` - Server state management
  - `react` - Core React library
  - `zustand` - State management for auth tokens

### Directory Structure
```
lib/
├── api/
│   ├── client.ts         - Core API client with all fetch methods
│   ├── types.ts          - All TypeScript types and interfaces
│   └── storage.ts        - Zustand-based token storage
├── hooks/
│   ├── auth/            - Authentication hooks
│   ├── email/           - Email management hooks
│   ├── password/        - Password management hooks
│   ├── providers/       - Social auth hooks
│   ├── sessions/        - Session management hooks
│   └── config/          - Configuration hooks
├── provider/
│   └── AllauthProvider.tsx - Main provider component
└── queryKeys.ts         - Centralized query key management
index.ts                 - Main exports file
```

### Main Components

1. **AllauthProvider**: Sets up both authentication context and QueryClient
   - Can be initialized with a pre-configured client or create one internally
   - Provides QueryClientProvider with smart defaults
   - Configures retry logic and cache times
   - Supports both browser and app client types

2. **AllauthClient** (internal):
   - Complete API client implementation
   - Supports all django-allauth headless endpoints
   - Automatic CSRF token management
   - Session token handling via Zustand storage

3. **Storage System**:
   - `ZustandStorage`: Reactive token storage using Zustand
   - `CookieStorage`: Traditional cookie-based storage
   - `HybridStorage`: Combines both approaches
   - `useAuthTokens()`: Hook for reactive token access

4. **Query Keys Factory** (`allauthQueryKeys`):
   - Centralized query key management
   - Hierarchical structure for cache invalidation
   - Helper functions for batch invalidation

### Available Hooks

#### Authentication Hooks
- `useAuth()`: Query hook for auth status
- `useLogin()`: Login mutation
- `useLogout()`: Logout mutation
- `useSignup()`: Signup mutation
- `useLoginByCode()`: Passwordless login via code
- `useReauthenticate()`: Reauthentication for sensitive operations

#### Email Management
- `useEmailAddresses()`: Complete email management (add, remove, verify, set primary)

#### Password Management
- `usePasswordReset()`: Password reset flow (request, confirm)
- `useChangePassword()`: Change current password

#### Session Management
- `useSessions()`: List and delete sessions

#### Social Authentication
- `useProviderAccounts()`: Manage connected social accounts
- `useProviderAuth()`: Social login/connect flows

#### Configuration
- `useConfig()`: Fetch allauth configuration

#### Backwards Compatibility
- `useAllauth()`: Combined hook for migration from v1

### State Management Pattern
- Uses TanStack Query for all server state
- Queries for fetching data (auth status, emails, etc.)
- Mutations for actions (login, logout, add email, etc.)
- Optimistic updates for immediate UI feedback
- Smart cache invalidation strategies
- Zustand for reactive token management

## Key Implementation Details

- QueryClient configured with 5-minute stale time, 10-minute cache time
- No retry on 4xx errors (except 408, 429)
- Auth mutations immediately update cache and invalidate related queries
- All hooks return TanStack Query result objects (with isLoading, isError, etc.)
- Uses `React.createElement` instead of JSX to avoid compilation requirements
- Backwards-compatible `useAllauth()` hook wraps new granular hooks