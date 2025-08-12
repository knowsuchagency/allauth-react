import { getClient } from '../../../../api/client';
import type { 
  TOTPAuthenticatorResponse,
  NoTOTPAuthenticatorResponse
} from '../../../../api/types';

/**
 * Function to get TOTP authenticator info
 */
export async function getTOTPAuthenticator(): Promise<TOTPAuthenticatorResponse | NoTOTPAuthenticatorResponse> {
  const client = getClient();
  return client.getTOTPAuthenticator();
}