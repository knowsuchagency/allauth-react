import { getClient } from '../../../../api/client';
import type { 
  SensitiveRecoveryCodesAuthenticatorResponse
} from '../../../../api/types';

/**
 * Function to get recovery codes
 */
export async function getRecoveryCodes(): Promise<SensitiveRecoveryCodesAuthenticatorResponse | { status: 404 }> {
  const client = getClient();
  return client.listRecoveryCodes();
}