import { getClient } from '../../../api/client';

/**
 * Hook for redirecting to provider authentication
 */
export function useProviderRedirect(): (provider: string, callbackUrl: string, process?: 'login' | 'connect') => Promise<any> {
  const client = getClient();

  return async (provider: string, callbackUrl: string, process: 'login' | 'connect' = 'login') => {
    return client.providerRedirect(provider, callbackUrl, process);
  };
}