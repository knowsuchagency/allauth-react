import React from 'react';
import { AllauthProvider } from '../lib/provider/AllauthProvider';

export type FetchCall = { url: string; init: RequestInit };

/** A fetch stub that answers each call with the next queued JSON body. */
export function queueFetch(responses: Array<{ status: number; body: unknown }>) {
  const calls: FetchCall[] = [];
  const fn = async (input: RequestInfo | URL, init: RequestInit = {}) => {
    calls.push({ url: String(input), init });
    const next = responses.shift();
    if (!next) throw new Error(`unexpected fetch: ${String(input)}`);
    return new Response(JSON.stringify(next.body), {
      status: next.status,
      headers: { 'Content-Type': 'application/json' },
    });
  };
  return { fn, calls };
}

export function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(AllauthProvider, { baseUrl: 'http://api.test' }, children);
}
