import { useMutation } from '@tanstack/react-query';
import { getClient } from '../../../api/client';
import type { 
  AuthenticationResponse,
  LoginByCodeRequest,
  ErrorResponse 
} from '../../../api/types';

/**
 * Mutation hook for requesting a login code
 */
export function useRequestLoginCode() {
  const client = getClient();

  return useMutation<
    AuthenticationResponse,
    ErrorResponse,
    LoginByCodeRequest
  >({
    mutationFn: (data) => client.requestLoginCode(data),
  });
}