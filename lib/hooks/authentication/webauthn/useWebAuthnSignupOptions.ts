import { getClient } from '../../../api/client';

/**
 * Function to get WebAuthn signup options
 */
export async function getWebAuthnSignupOptions() {
  const client = getClient();
  return client.getWebAuthnSignupOptions();
}