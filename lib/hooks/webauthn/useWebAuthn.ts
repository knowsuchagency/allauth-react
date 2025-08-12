import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getClient } from '../../api/client';
import { allauthQueryKeys, getAuthInvalidationKeys } from '../../queryKeys';
import type { 
  WebAuthnCredentialCreationOptions,
  WebAuthnCredentialRequestOptions,
  AuthenticatedResponse,
  AuthenticationResponse,
  AuthenticatorsResponse,
  Authenticator,
  ErrorResponse 
} from '../../api/types';

export interface UseWebAuthnResult {
  // Query results
  credentials: Authenticator[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  
  // Signup/Registration
  getSignupOptions: () => Promise<WebAuthnCredentialCreationOptions | ErrorResponse>;
  signup: (data: { credential: string; email?: string; username?: string }) => Promise<void>;
  
  // Login
  getLoginOptions: () => Promise<WebAuthnCredentialRequestOptions | ErrorResponse>;
  login: (credential: string) => Promise<void>;
  
  // 2FA Authentication
  getAuthenticateOptions: () => Promise<WebAuthnCredentialRequestOptions | ErrorResponse>;
  authenticate: (credential: string) => Promise<void>;
  
  // Reauthentication
  getReauthenticateOptions: () => Promise<WebAuthnCredentialRequestOptions | ErrorResponse>;
  reauthenticate: (credential: string) => Promise<void>;
  
  // Credential management
  deleteCredential: (id: string) => Promise<void>;
  
  // Loading states
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isAuthenticating: boolean;
  isReauthenticating: boolean;
  isDeletingCredential: boolean;
  
  // Refetch
  refetch: () => void;
}

/**
 * Hook for WebAuthn/Passkey authentication.
 * Provides methods for passwordless authentication using biometrics or hardware keys.
 */
export function useWebAuthn(): UseWebAuthnResult {
  const client = getClient();
  const queryClient = useQueryClient();

  // Query for WebAuthn credentials
  const query = useQuery<AuthenticatorsResponse>({
    queryKey: allauthQueryKeys.webauthn(),
    queryFn: () => client.listWebAuthnCredentials(),
  });

  // WebAuthn Signup
  const signupMutation = useMutation<
    AuthenticatedResponse | AuthenticationResponse,
    ErrorResponse,
    { credential: string; email?: string; username?: string }
  >({
    mutationFn: (data) => client.webAuthnSignup(data),
    onSuccess: (data) => {
      if (data.status === 200) {
        queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
        getAuthInvalidationKeys().forEach(key => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.webauthn() });
    },
  });

  // WebAuthn Login
  const loginMutation = useMutation<
    AuthenticatedResponse | AuthenticationResponse,
    ErrorResponse,
    string
  >({
    mutationFn: (credential) => client.webAuthnLogin({ credential }),
    onSuccess: (data) => {
      if (data.status === 200) {
        queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
        getAuthInvalidationKeys().forEach(key => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
    },
  });

  // WebAuthn 2FA Authentication
  const authenticateMutation = useMutation<
    AuthenticatedResponse | AuthenticationResponse,
    ErrorResponse,
    string
  >({
    mutationFn: (credential) => client.webAuthnAuthenticate(credential),
    onSuccess: (data) => {
      if (data.status === 200) {
        queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
        getAuthInvalidationKeys().forEach(key => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
    },
  });

  // WebAuthn Reauthentication
  const reauthenticateMutation = useMutation<
    AuthenticatedResponse,
    ErrorResponse,
    string
  >({
    mutationFn: (credential) => client.webAuthnReauthenticate(credential),
    onSuccess: (data) => {
      queryClient.setQueryData(allauthQueryKeys.authStatus(), data);
      queryClient.invalidateQueries({ 
        queryKey: allauthQueryKeys.authStatus() 
      });
    },
  });

  // Delete WebAuthn Credential
  const deleteCredentialMutation = useMutation<
    AuthenticatorsResponse,
    ErrorResponse,
    string
  >({
    mutationFn: (id) => client.deleteWebAuthnCredential(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.webauthn() });
      queryClient.invalidateQueries({ queryKey: allauthQueryKeys.authenticators() });
    },
  });

  return {
    credentials: query.data?.data.filter((auth: Authenticator) => auth.type === 'webauthn') ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    
    getSignupOptions: () => client.getWebAuthnSignupOptions(),
    signup: async (data) => {
      await signupMutation.mutateAsync(data);
    },
    
    getLoginOptions: () => client.getWebAuthnLoginOptions(),
    login: async (credential) => {
      await loginMutation.mutateAsync(credential);
    },
    
    getAuthenticateOptions: () => client.getWebAuthnAuthenticateOptions(),
    authenticate: async (credential) => {
      await authenticateMutation.mutateAsync(credential);
    },
    
    getReauthenticateOptions: () => client.getWebAuthnReauthenticateOptions(),
    reauthenticate: async (credential) => {
      await reauthenticateMutation.mutateAsync(credential);
    },
    
    deleteCredential: async (id) => {
      await deleteCredentialMutation.mutateAsync(id);
    },
    
    isSigningUp: signupMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    isAuthenticating: authenticateMutation.isPending,
    isReauthenticating: reauthenticateMutation.isPending,
    isDeletingCredential: deleteCredentialMutation.isPending,
    
    refetch: query.refetch,
  };
}