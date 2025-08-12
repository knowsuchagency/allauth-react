import { useQuery } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import { allauthQueryKeys } from '../../../queryKeys';
import type { 
  AuthenticatedResponse, 
  NotAuthenticatedResponse,
} from '../../../api/types';

/**
 * Query hook for current authentication status
 */
export function useAuthStatus() {
  const client = getClient();
  
  return useQuery<AuthenticatedResponse | NotAuthenticatedResponse>({
    queryKey: allauthQueryKeys.authStatus(),
    queryFn: () => client.getAuthenticationStatus(),
  });
}