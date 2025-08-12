import { getClient } from '../../../api/client';
import type { WebAuthnCredentialRequestOptions } from '../../../api/types';

/**
 * Function to get WebAuthn authenticate options
 */
export async function getWebAuthnAuthenticateOptions(): Promise<WebAuthnCredentialRequestOptions> {
  const client = getClient();
  return client.getWebAuthnAuthenticateOptions();
}