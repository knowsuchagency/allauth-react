import { useMemo } from 'react';
import { useProviderAccounts } from './account/providers/useProviderAccounts';
import { useDisconnectProvider } from './account/providers/useDisconnectProvider';
import { useProviderRedirect } from './authentication/providers/useProviderRedirect';
import { useProviderToken } from './authentication/providers/useProviderToken';
import type { ProviderAccount, ProviderTokenRequest } from '../api/types';

export interface UseSocialAuthResult {
  // Provider data
  connectedProviders: ProviderAccount[];
  hasProvider: (provider: string) => boolean;
  isLoading: boolean;
  error: any;
  
  // Actions
  connect: (provider: string, callbackUrl: string) => Promise<void>;
  disconnect: (provider: string, uid: string) => Promise<void>;
  authenticateWithToken: (data: ProviderTokenRequest) => Promise<void>;
  
  // States
  isConnecting: boolean;
  isDisconnecting: boolean;
  isAuthenticating: boolean;
  
  // Errors
  disconnectError: any;
  tokenError: any;
  
  // Utilities
  refetch: () => void;
}

/**
 * High-level hook for social authentication provider management.
 * Handles OAuth flows, token authentication, and provider connections.
 * 
 * @example
 * ```tsx
 * const { connectedProviders, connect, disconnect } = useSocialAuth();
 * 
 * // Redirect-based OAuth flow
 * await connect('google', '/auth/callback');
 * 
 * // Token-based authentication (for mobile apps)
 * await authenticateWithToken({
 *   provider: 'google',
 *   process: 'login',
 *   token: { id_token: '...' }
 * });
 * 
 * // Disconnect a provider
 * const googleAccount = connectedProviders.find(p => p.provider.id === 'google');
 * if (googleAccount) {
 *   await disconnect('google', googleAccount.uid);
 * }
 * ```
 */
export function useSocialAuth(): UseSocialAuthResult {
  const accountsQuery = useProviderAccounts();
  const disconnectMutation = useDisconnectProvider();
  const redirectFn = useProviderRedirect();
  const tokenMutation = useProviderToken();
  
  const connectedProviders = accountsQuery.data?.data || [];
  
  const hasProvider = (provider: string) => {
    return connectedProviders.some(p => p.provider.id === provider);
  };
  
  const connect = async (provider: string, callbackUrl: string) => {
    await redirectFn(provider, callbackUrl, 'login');
  };
  
  const disconnect = async (provider: string, uid: string) => {
    await disconnectMutation.mutateAsync({ provider, account: uid });
  };
  
  const authenticateWithToken = async (data: ProviderTokenRequest) => {
    await tokenMutation.mutateAsync(data);
  };
  
  return {
    // Data
    connectedProviders,
    hasProvider,
    isLoading: accountsQuery.isLoading,
    error: accountsQuery.error,
    
    // Actions
    connect,
    disconnect,
    authenticateWithToken,
    
    // States
    isConnecting: false, // Redirect-based flow doesn't have a pending state
    isDisconnecting: disconnectMutation.isPending,
    isAuthenticating: tokenMutation.isPending,
    
    // Errors
    disconnectError: disconnectMutation.error,
    tokenError: tokenMutation.error,
    
    // Utilities
    refetch: accountsQuery.refetch,
  };
}