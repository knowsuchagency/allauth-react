// Compile-time checks that the response types match the django-allauth
// headless OpenAPI spec. Run with `bun run typecheck`.
import type {
  ConfigurationResponse,
  NoTOTPAuthenticatorResponse,
  PhoneNumberResponse,
  ProviderSignupResponse,
  WebAuthnAuthenticator,
  WebAuthnCredentialRequestOptions,
  WebAuthnLoginRequest,
} from '../index';

// A server without allauth.socialaccount, allauth.mfa or allauth.usersessions
// returns only the account section.
const minimalConfig: ConfigurationResponse = {
  status: 200,
  data: {
    account: {
      login_methods: ['email'],
      is_open_for_signup: true,
      email_verification_by_code_enabled: false,
      login_by_code_enabled: false,
      password_reset_by_code_enabled: false,
      authentication_method: 'email',
    },
  },
};

// Optional sections must be narrowed before use.
// @ts-expect-error mfa may be absent
minimalConfig.data.mfa.supported_types;
minimalConfig.data.mfa?.supported_types;

const phone: PhoneNumberResponse = {
  status: 200,
  data: [{ phone: '+15555550100', verified: true }],
};

const noTotp: NoTOTPAuthenticatorResponse = {
  status: 404,
  meta: { secret: 'J7VH...', totp_url: 'otpauth://totp/...' },
};

const providerSignup: ProviderSignupResponse = {
  status: 200,
  data: {
    email: [{ email: 'a@b.c', primary: true, verified: false }],
    account: { uid: '1', display: 'Wolfgang', provider: { id: 'google', name: 'Google', flows: ['provider_redirect'] } },
    user: { id: 1, display: 'wolfgang', has_usable_password: false },
  },
};

const passkey: WebAuthnAuthenticator = {
  type: 'webauthn',
  id: 3,
  name: 'Laptop',
  created_at: 1700000000,
  last_used_at: null,
};

const requestOptions: WebAuthnCredentialRequestOptions = {
  status: 200,
  data: { request_options: { publicKey: { challenge: 'abc' } } },
};

const loginWithObject: WebAuthnLoginRequest = { credential: { id: 'x', type: 'public-key' } };
const loginWithString: WebAuthnLoginRequest = { credential: '{"id":"x"}' };

export { phone, noTotp, providerSignup, passkey, requestOptions, loginWithObject, loginWithString };
