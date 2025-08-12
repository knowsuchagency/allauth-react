import { getClient } from '../../../api/client';

/**
 * Function to get email verification information
 */
export async function getEmailVerificationInfo(key: string) {
  const client = getClient();
  return client.getEmailVerificationInfo(key);
}