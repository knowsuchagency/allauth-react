import React, { useMemo } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { initializeClient } from '../api/client';
import type { ClientType, StorageInterface } from '../api/types';

// ============================================================================
// Provider Props
// ============================================================================

interface AllauthProviderProps {
  // API configuration
  clientType?: ClientType;
  baseUrl?: string;
  csrfTokenEndpoint?: string;
  storage?: StorageInterface;
  
  // Query client configuration
  queryClient?: QueryClient;
  
  // Children
  children: React.ReactNode;
}

// ============================================================================
// Default Query Client Configuration
// ============================================================================

function createDefaultQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
        retry: (failureCount: number, error: any) => {
          // Don't retry on 4xx errors except 408 and 429
          if (
            error?.status >= 400 &&
            error?.status < 500 &&
            error?.status !== 408 &&
            error?.status !== 429
          ) {
            return false;
          }
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

// ============================================================================
// Provider Component
// ============================================================================

export function AllauthProvider({
  clientType = 'browser',
  baseUrl = '',
  csrfTokenEndpoint,
  storage,
  queryClient,
  children,
}: AllauthProviderProps): React.ReactElement {
  // Initialize the AllauthClient singleton
  useMemo(() => {
    initializeClient({
      baseUrl,
      csrfTokenEndpoint,
      clientType,
      storage,
    });
  }, [baseUrl, csrfTokenEndpoint, clientType, storage]);

  // Create QueryClient if not provided
  const finalQueryClient = useMemo(() => {
    return queryClient || createDefaultQueryClient();
  }, [queryClient]);

  return React.createElement(
    QueryClientProvider,
    { client: finalQueryClient },
    children
  );
}