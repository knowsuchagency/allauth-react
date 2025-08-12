import { getClient } from '../../../api/client';

/**
 * Function to get WebAuthn authenticate options
 */
export async function getWebAuthnAuthenticateOptions() {
  const client = getClient();
  return client.getWebAuthnAuthenticateOptions();
}