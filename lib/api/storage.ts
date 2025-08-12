import { create, type UseBoundStore, type StoreApi } from 'zustand';
import { persist, createJSONStorage, type PersistOptions } from 'zustand/middleware';
import type { StorageInterface } from './types';

// ============================================================================
// Zustand Store for Auth Tokens
// ============================================================================

interface AuthTokenStore {
  sessionToken: string | null;
  csrfToken: string | null;
  setSessionToken: (token: string | null) => void;
  setCSRFToken: (token: string | null) => void;
  clearTokens: () => void;
}

const useAuthTokenStore: UseBoundStore<StoreApi<AuthTokenStore>> = create<AuthTokenStore>()(
  persist(
    (set) => ({
      sessionToken: null,
      csrfToken: null,
      setSessionToken: (token) => set({ sessionToken: token }),
      setCSRFToken: (token) => set({ csrfToken: token }),
      clearTokens: () => set({ sessionToken: null, csrfToken: null }),
    }),
    {
      name: 'allauth-tokens',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        sessionToken: state.sessionToken,
        // CSRF token is not persisted for security reasons
      }),
    }
  )
);

// ============================================================================
// Cookie Utilities (for browser mode)
// ============================================================================

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
  }
}

function setCookie(name: string, value: string | null, secure: boolean = false): void {
  if (typeof document === 'undefined') return;
  
  try {
    if (value) {
      const encodedValue = encodeURIComponent(value);
      let cookieString = `${name}=${encodedValue}; path=/; samesite=lax`;
      
      if (secure) {
        cookieString += "; secure";
      }
      
      document.cookie = cookieString;
    } else {
      let cookieString = `${name}=; path=/; samesite=lax; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      
      if (secure) {
        cookieString += "; secure";
      }
      
      document.cookie = cookieString;
    }
  } catch (error) {
    console.error(`Failed to set ${name} cookie:`, error);
  }
}

// ============================================================================
// Storage Implementations
// ============================================================================

/**
 * Zustand-based storage for JWT/token-based authentication (mobile apps, SPAs)
 */
export class ZustandStorage implements StorageInterface {
  async getSessionToken(): Promise<string | null> {
    return useAuthTokenStore.getState().sessionToken;
  }

  async setSessionToken(value: string | null): Promise<void> {
    useAuthTokenStore.getState().setSessionToken(value);
  }

  async getCSRFToken(): Promise<string | null> {
    return useAuthTokenStore.getState().csrfToken;
  }

  async setCSRFToken(value: string | null): Promise<void> {
    useAuthTokenStore.getState().setCSRFToken(value);
  }
}

/**
 * Cookie-based storage for traditional session authentication (SSR, browser)
 */
export class CookieStorage implements StorageInterface {
  private useSecure: boolean;
  private csrfTokenCookieName: string;
  private sessionTokenCookieName: string;

  constructor(options: { 
    apiUrl?: string; 
    csrfTokenCookieName?: string;
    sessionTokenCookieName?: string;
  } = {}) {
    // Determine secure flag from API URL scheme or fallback to current window location
    this.useSecure = options.apiUrl
      ? options.apiUrl.startsWith("https:")
      : (typeof window !== 'undefined' && window.location.protocol === "https:");
    this.csrfTokenCookieName = options.csrfTokenCookieName || "csrftoken";
    this.sessionTokenCookieName = options.sessionTokenCookieName || "sessiontoken";
  }

  async getSessionToken(): Promise<string | null> {
    return getCookie(this.sessionTokenCookieName) || null;
  }

  async setSessionToken(value: string | null): Promise<void> {
    setCookie(this.sessionTokenCookieName, value, this.useSecure);
  }

  async getCSRFToken(): Promise<string | null> {
    return getCookie(this.csrfTokenCookieName) || null;
  }

  async setCSRFToken(value: string | null): Promise<void> {
    setCookie(this.csrfTokenCookieName, value, this.useSecure);
  }
}

/**
 * Hybrid storage that uses Zustand for tokens but also checks cookies
 * This is useful for apps that need to work with both JWT and cookie-based auth
 */
export class HybridStorage implements StorageInterface {
  private zustandStorage: ZustandStorage;
  private cookieStorage: CookieStorage;

  constructor(options: { 
    apiUrl?: string; 
    csrfTokenCookieName?: string;
    sessionTokenCookieName?: string;
  } = {}) {
    this.zustandStorage = new ZustandStorage();
    this.cookieStorage = new CookieStorage(options);
  }

  async getSessionToken(): Promise<string | null> {
    // First check Zustand store
    const zustandToken = await this.zustandStorage.getSessionToken();
    if (zustandToken) return zustandToken;
    
    // Fallback to cookies
    return this.cookieStorage.getSessionToken();
  }

  async setSessionToken(value: string | null): Promise<void> {
    // Set in both storages
    await this.zustandStorage.setSessionToken(value);
    await this.cookieStorage.setSessionToken(value);
  }

  async getCSRFToken(): Promise<string | null> {
    // First check Zustand store
    const zustandToken = await this.zustandStorage.getCSRFToken();
    if (zustandToken) return zustandToken;
    
    // Fallback to cookies
    return this.cookieStorage.getCSRFToken();
  }

  async setCSRFToken(value: string | null): Promise<void> {
    // Set in both storages
    await this.zustandStorage.setCSRFToken(value);
    await this.cookieStorage.setCSRFToken(value);
  }
}

// ============================================================================
// Export convenience functions and hooks
// ============================================================================

export { useAuthTokenStore };

export function getCSRFToken(): string | undefined {
  return getCookie("csrftoken");
}

export function getSessionId(): string | undefined {
  return getCookie("sessionid");
}

/**
 * Hook to access auth tokens reactively
 */
export function useAuthTokens(): {
  sessionToken: string | null;
  csrfToken: string | null;
  setSessionToken: (token: string | null) => void;
  setCSRFToken: (token: string | null) => void;
  clearTokens: () => void;
} {
  return useAuthTokenStore((state) => ({
    sessionToken: state.sessionToken,
    csrfToken: state.csrfToken,
    setSessionToken: state.setSessionToken,
    setCSRFToken: state.setCSRFToken,
    clearTokens: state.clearTokens,
  }));
}

/**
 * Get the appropriate storage implementation based on client type
 */
export function getStorage(clientType: 'app' | 'browser', apiUrl?: string): StorageInterface {
  if (clientType === 'app') {
    // Mobile apps use Zustand storage for JWT tokens
    return new ZustandStorage();
  } else {
    // Browser apps use hybrid storage to support both JWT and cookies
    return new HybridStorage({ apiUrl });
  }
}