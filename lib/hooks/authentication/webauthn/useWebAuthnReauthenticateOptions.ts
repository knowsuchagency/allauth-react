import { getClient } from '../../../api/client';

/**
 * Function to get WebAuthn reauthenticate options
 */
export async function getWebAuthnReauthenticateOptions() {
  const client = getClient();
  return client.getWebAuthnReauthenticateOptions();
}