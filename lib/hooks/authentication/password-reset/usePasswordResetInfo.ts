import { getClient } from '../../../api/client';
import type { PasswordResetInfoResponse } from '../../../api/types';

/**
 * Function to get password reset information by key
 */
export async function getPasswordResetInfo(key: string): Promise<PasswordResetInfoResponse> {
  const client = getClient();
  return client.getPasswordResetInfo(key);
}