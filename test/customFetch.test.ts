import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { AllauthProvider } from '../lib/provider/AllauthProvider';
import { createClient } from '../lib/api/client';
import { useAuth } from '../lib/hooks/useAuth';
import { queueFetch } from './helpers';

const notAuthenticated = {
  status: 401,
  data: { flows: [{ id: 'login' }] },
  meta: { is_authenticated: false },
};

const realFetch = globalThis.fetch;
beforeEach(() => {
  globalThis.fetch = (() => {
    throw new Error('global fetch must not be used');
  }) as unknown as typeof fetch;
});
afterEach(() => {
  globalThis.fetch = realFetch;
});

describe('custom fetch', () => {
  test('AllauthProvider routes hook requests through the fetch prop', async () => {
    const stub = queueFetch([{ status: 401, body: notAuthenticated }]);
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(AllauthProvider, { baseUrl: 'http://api.test', fetch: stub.fn }, children);

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAuthenticated).toBe(false);
    expect(stub.calls.map((c) => c.url)).toEqual(['http://api.test/_allauth/browser/v1/auth/session']);
  });

  test('createClient sends headers, credentials and body through the custom fetch', async () => {
    const stub = queueFetch([
      { status: 200, body: { status: 200, data: { user: { id: 1 }, methods: [] }, meta: { is_authenticated: true, session_token: 'tok' } } },
    ]);
    const client = createClient({ baseUrl: 'http://api.test', clientType: 'app', fetch: stub.fn });

    const res = await client.login({ username: 'u', password: 'p' });

    expect(res.status).toBe(200);
    const [call] = stub.calls;
    expect(call.url).toBe('http://api.test/_allauth/app/v1/auth/login');
    expect(call.init.method).toBe('POST');
    expect(call.init.credentials).toBe('include');
    expect(JSON.parse(String(call.init.body))).toEqual({ username: 'u', password: 'p' });
    expect(new Headers(call.init.headers).get('Content-Type')).toBe('application/json');
  });
});
