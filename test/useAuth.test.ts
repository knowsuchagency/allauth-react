import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '../lib/hooks/useAuth';
import { queueFetch, wrapper } from './helpers';

const notAuthenticated = {
  status: 401,
  data: { flows: [{ id: 'login' }, { id: 'signup' }] },
  meta: { is_authenticated: false },
};

const mfaPending = {
  status: 401,
  data: {
    flows: [
      { id: 'login' },
      { id: 'mfa_authenticate', is_pending: true, types: ['recovery_codes', 'totp'] },
    ],
  },
  meta: { is_authenticated: false },
};

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

describe('useAuth', () => {
  test('exposes a pending MFA flow after login instead of hiding it', async () => {
    const stub = queueFetch([
      { status: 401, body: notAuthenticated },
      { status: 401, body: mfaPending },
    ]);
    globalThis.fetch = stub.fn as typeof fetch;

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.pendingFlow).toBeNull();

    let response: Awaited<ReturnType<typeof result.current.login>> | undefined;
    await act(async () => {
      response = await result.current.login({ email: 'a@b.c', password: 'pw' });
    });

    expect(response?.status).toBe(401);
    await waitFor(() => expect(result.current.pendingFlow?.id).toBe('mfa_authenticate'));
    expect(result.current.pendingFlow?.types).toEqual(['recovery_codes', 'totp']);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loginError).toBeNull();
  });

  test('surfaces real login errors as loginError', async () => {
    const errorBody = {
      status: 400,
      errors: [{ code: 'email_password_mismatch', param: 'password', message: 'Wrong.' }],
    };
    const stub = queueFetch([
      { status: 401, body: notAuthenticated },
      { status: 400, body: errorBody },
    ]);
    globalThis.fetch = stub.fn as typeof fetch;

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await expect(result.current.login({ email: 'a@b.c', password: 'bad' })).rejects.toEqual(errorBody);
    });
    await waitFor(() => expect(result.current.loginError).toEqual(errorBody));
  });
});
