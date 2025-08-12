import { getClient } from '../../../api/client';
import type { WebAuthnCredentialCreationOptions } from '../../../api/types';

/**
 * Function to get WebAuthn signup options
 */
export async function getWebAuthnSignupOptions(): Promise<WebAuthnCredentialCreationOptions> {
  const client = getClient();
  return client.getWebAuthnSignupOptions();
}