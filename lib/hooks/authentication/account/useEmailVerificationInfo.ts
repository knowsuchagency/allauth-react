import { getClient } from '../../../api/client';
import type { EmailVerificationInfoResponse } from '../../../api/types';

/**
 * Function to get email verification information
 */
export async function getEmailVerificationInfo(key: string): Promise<EmailVerificationInfoResponse> {
  const client = getClient();
  return client.getEmailVerificationInfo(key);
}