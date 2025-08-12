import { getClient } from '../../../api/client';

/**
 * Function to get password reset information by key
 */
export async function getPasswordResetInfo(key: string) {
  const client = getClient();
  return client.getPasswordResetInfo(key);
}