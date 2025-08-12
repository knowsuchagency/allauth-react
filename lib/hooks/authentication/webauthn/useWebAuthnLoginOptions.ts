import { getClient } from '../../../api/client';

/**
 * Function to get WebAuthn login options
 */
export async function getWebAuthnLoginOptions() {
  const client = getClient();
  return client.getWebAuthnLoginOptions();
}