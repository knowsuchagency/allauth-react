import { getClient } from '../../../api/client';
import type { WebAuthnCredentialRequestOptions } from '../../../api/types';

/**
 * Function to get WebAuthn reauthenticate options
 */
export async function getWebAuthnReauthenticateOptions(): Promise<WebAuthnCredentialRequestOptions> {
  const client = getClient();
  return client.getWebAuthnReauthenticateOptions();
}