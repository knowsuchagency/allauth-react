import { getClient } from '../../../api/client';
import type { WebAuthnCredentialRequestOptions } from '../../../api/types';

/**
 * Function to get WebAuthn login options
 */
export async function getWebAuthnLoginOptions(): Promise<WebAuthnCredentialRequestOptions> {
  const client = getClient();
  return client.getWebAuthnLoginOptions();
}