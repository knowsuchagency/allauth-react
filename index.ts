import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
import {
  AllauthClient,
  User,
  AuthenticatorsResponse,
  EmailAddressesResponse,
  ProviderAccountsResponse,
} from "@knowsuchagency/allauth-fetch";

interface AllauthContextType {
  client: AllauthClient;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: {
    username?: string;
    email?: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: {
    email?: string;
    username?: string;
    password: string;
  }) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (key: string, password: string) => Promise<void>;
  reauthenticate: (password: string) => Promise<void>;
  verifyEmail: (key: string) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  refreshAuthStatus: () => Promise<void>;
}

interface AllauthProviderProps {
  client?: AllauthClient;
  clientType?: "browser" | "app";
  baseUrl?: string;
  csrfTokenEndpoint?: string;
  children: React.ReactNode;
}

const AllauthContext = createContext<AllauthContextType | null>(null);

export function AllauthProvider({
  client,
  clientType,
  baseUrl,
  csrfTokenEndpoint,
  children,
}: AllauthProviderProps): React.ReactElement {
  // Create client if not directly provided
  const allauthClient = useMemo(() => {
    if (client) {
      return client;
    }

    else if (baseUrl) {
      return new AllauthClient(baseUrl, csrfTokenEndpoint, client);
    }

    throw new Error(
      "Either client or baseUrl must be provided"
    );
  }, [client, clientType, baseUrl, csrfTokenEndpoint]);

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refreshAuthStatus = useCallback(async () => {
    try {
      const response = await allauthClient.getAuthenticationStatus();
      if ("data" in response && "user" in response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, [allauthClient]);

  useEffect(() => {
    refreshAuthStatus();
  }, [refreshAuthStatus]);

  const login = useCallback(
    async (data: { username?: string; email?: string; password: string }) => {
      const response = await allauthClient.login(data);
      if ("data" in response && "user" in response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        throw new Error("Login failed");
      }
    },
    [allauthClient]
  );

  const logout = useCallback(async () => {
    await allauthClient.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, [allauthClient]);

  const signup = useCallback(
    async (data: { email?: string; username?: string; password: string }) => {
      const response = await allauthClient.signup(data);
      if ("data" in response && "user" in response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        throw new Error("Signup failed");
      }
    },
    [allauthClient]
  );

  const requestPasswordReset = useCallback(
    async (email: string) => {
      await allauthClient.requestPassword({ email });
    },
    [allauthClient]
  );

  const resetPassword = useCallback(
    async (key: string, password: string) => {
      await allauthClient.resetPassword({ key, password });
    },
    [allauthClient]
  );

  const reauthenticate = useCallback(
    async (password: string) => {
      await allauthClient.reauthenticate({ password });
    },
    [allauthClient]
  );

  const verifyEmail = useCallback(
    async (key: string) => {
      await allauthClient.verifyEmail({ key });
    },
    [allauthClient]
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      await allauthClient.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
    },
    [allauthClient]
  );

  const value = {
    client: allauthClient,
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    signup,
    requestPasswordReset,
    resetPassword,
    reauthenticate,
    verifyEmail,
    changePassword,
    refreshAuthStatus,
  };

  return React.createElement(AllauthContext.Provider, { value }, children);
}

export function useAllauth(): AllauthContextType {
  const context = useContext(AllauthContext);
  if (!context) {
    throw new Error("useAllauth must be used within an AllauthProvider");
  }
  return context;
}

// First, let's define the return type interfaces
interface UseEmailAddressesReturn {
  emailAddresses: EmailAddressesResponse["data"];
  isLoading: boolean;
  addEmail: (email: string) => Promise<void>;
  removeEmail: (email: string) => Promise<void>;
  setPrimaryEmail: (email: string) => Promise<void>;
  refresh: () => Promise<void>;
}

interface UseAuthenticatorsReturn {
  authenticators: AuthenticatorsResponse["data"];
  isLoading: boolean;
  setupTOTP: (code: string) => Promise<void>;
  deactivateTOTP: () => Promise<void>;
  refresh: () => Promise<void>;
}

interface UseProviderAccountsReturn {
  accounts: ProviderAccountsResponse["data"];
  isLoading: boolean;
  disconnectAccount: (provider: string, account: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useEmailAddresses(): UseEmailAddressesReturn {
  const { client } = useAllauth();
  const [emailAddresses, setEmailAddresses] = useState<
    EmailAddressesResponse["data"]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEmailAddresses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await client.listEmailAddresses();
      if ("data" in response) {
        setEmailAddresses(response.data);
      }
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchEmailAddresses();
  }, [fetchEmailAddresses]);

  const addEmail = useCallback(
    async (email: string) => {
      await client.addEmailAddress({ email });
      await fetchEmailAddresses();
    },
    [client, fetchEmailAddresses]
  );

  const removeEmail = useCallback(
    async (email: string) => {
      await client.removeEmailAddress({ email });
      await fetchEmailAddresses();
    },
    [client, fetchEmailAddresses]
  );

  const setPrimaryEmail = useCallback(
    async (email: string) => {
      await client.changePrimaryEmailAddress({ email, primary: true });
      await fetchEmailAddresses();
    },
    [client, fetchEmailAddresses]
  );

  return {
    emailAddresses,
    isLoading,
    addEmail,
    removeEmail,
    setPrimaryEmail,
    refresh: fetchEmailAddresses,
  };
}

export function useAuthenticators(): UseAuthenticatorsReturn {
  const { client } = useAllauth();
  const [authenticators, setAuthenticators] = useState<
    AuthenticatorsResponse["data"]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAuthenticators = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await client.listAuthenticators();
      setAuthenticators(response.data);
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchAuthenticators();
  }, [fetchAuthenticators]);

  const setupTOTP = useCallback(
    async (code: string) => {
      await client.activateTOTP({ code });
      await fetchAuthenticators();
    },
    [client, fetchAuthenticators]
  );

  const deactivateTOTP = useCallback(async () => {
    await client.deactivateTOTP();
    await fetchAuthenticators();
  }, [client, fetchAuthenticators]);

  return {
    authenticators,
    isLoading,
    setupTOTP,
    deactivateTOTP,
    refresh: fetchAuthenticators,
  };
}

export function useProviderAccounts(): UseProviderAccountsReturn {
  const { client } = useAllauth();
  const [accounts, setAccounts] = useState<ProviderAccountsResponse["data"]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await client.listProviderAccounts();
      setAccounts(response.data);
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const disconnectAccount = useCallback(
    async (provider: string, account: string) => {
      await client.disconnectProviderAccount({ provider, account });
      await fetchAccounts();
    },
    [client, fetchAccounts]
  );

  return {
    accounts,
    isLoading,
    disconnectAccount,
    refresh: fetchAccounts,
  };
}
