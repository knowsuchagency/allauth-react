import { getClient } from '../../../../api/client';
import type { 
  SensitiveRecoveryCodesAuthenticatorResponse
} from '../../../../api/types';

/**
 * Function to get recovery codes
 */
export async function getRecoveryCodes() {
  const client = getClient();
  return client.listRecoveryCodes();
}