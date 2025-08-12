import { useQuery } from '@tanstack/react-query';
import { getClient } from '../../../../api/client';
import { allauthQueryKeys } from '../../../../queryKeys';
import type { AuthenticatorsResponse } from '../../../../api/types';

/**
 * Query hook for listing WebAuthn credentials
 */
export function useWebAuthnCredentials() {
  const client = getClient();

  return useQuery<AuthenticatorsResponse>({
    queryKey: allauthQueryKeys.webauthn(),
    queryFn: () => client.listWebAuthnCredentials(),
  });
}