import { useQuery } from '@tanstack/react-query';
import { getClient } from '../../api/client';
import { allauthQueryKeys } from '../../queryKeys';
import type { SessionsResponse } from '../../api/types';

/**
 * Query hook for listing sessions
 */
export function useListSessions() {
  const client = getClient();

  return useQuery<SessionsResponse>({
    queryKey: allauthQueryKeys.sessions(),
    queryFn: () => client.listSessions(),
  });
}