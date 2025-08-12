# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React hooks and components library for integrating with django-allauth's headless API. The library is published to JSR (JavaScript Registry) as `@knowsuchagency/allauth-react`.

## Development Commands

### Package Management
- Use `bun` for package management (preferred over npm)
- Install dependencies: `bun install`
- Add dependency: `bun add <package>`

### Publishing
- The package is published to JSR automatically via GitHub Actions when pushing to main
- Manual publish: `npx jsr publish`
- Version is managed in `jsr.json` (current: 0.11.0)

## Architecture

### Core Structure
- **Single-file library**: All code is in `index.ts`
- **TypeScript-first**: Written in TypeScript with full type definitions
- **React hooks pattern**: Uses React Context API for state management
- **Peer dependency**: Requires `@knowsuchagency/allauth-fetch` for API client

### Main Components

1. **AllauthProvider**: Context provider that manages authentication state
   - Can be initialized with a pre-configured client or create one internally
   - Manages user state, authentication status, and loading states

2. **Core Hooks**:
   - `useAllauth()`: Primary hook for auth operations (login, logout, signup, password reset, etc.)
   - `useEmailAddresses()`: Manages user email addresses
   - `useAuthenticators()`: Handles 2FA/TOTP setup
   - `useProviderAccounts()`: Manages social provider connections

### State Management Pattern
- Uses React Context for global auth state
- Hooks follow consistent pattern: state + loading flag + action methods + refresh function
- All async operations update local state after successful API calls

## Key Implementation Details

- Client initialization happens in `useMemo` to prevent recreation
- Auth status is fetched on mount via `useEffect`
- All hooks automatically fetch data on mount and provide manual refresh methods
- Error handling is delegated to the consuming application
- Uses `React.createElement` instead of JSX to avoid compilation requirements