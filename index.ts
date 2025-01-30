import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
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
  client: AllauthClient;
  children: React.ReactNode;
}

const AllauthContext = createContext<AllauthContextType | null>(null);

export function AllauthProvider({ client, children }: AllauthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refreshAuthStatus = useCallback(async () => {
    try {
      const response = await client.getAuthenticationStatus();
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
  }, [client]);

  useEffect(() => {
    refreshAuthStatus();
  }, [refreshAuthStatus]);

  const login = useCallback(
    async (data: { username?: string; email?: string; password: string }) => {
      const response = await client.login(data);
      if ("data" in response && "user" in response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        throw new Error("Login failed");
      }
    },
    [client]
  );

  const logout = useCallback(async () => {
    await client.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, [client]);

  const signup = useCallback(
    async (data: { email?: string; username?: string; password: string }) => {
      const response = await client.signup(data);
      if ("data" in response && "user" in response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        throw new Error("Signup failed");
      }
    },
    [client]
  );

  const requestPasswordReset = useCallback(
    async (email: string) => {
      await client.requestPassword({ email });
    },
    [client]
  );

  const resetPassword = useCallback(
    async (key: string, password: string) => {
      await client.resetPassword({ key, password });
    },
    [client]
  );

  const reauthenticate = useCallback(
    async (password: string) => {
      await client.reauthenticate({ password });
    },
    [client]
  );

  const verifyEmail = useCallback(
    async (key: string) => {
      await client.verifyEmail({ key });
    },
    [client]
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      await client.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
    },
    [client]
  );

  const value = {
    client,
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

export function useAllauth() {
  const context = useContext(AllauthContext);
  if (!context) {
    throw new Error("useAllauth must be used within an AllauthProvider");
  }
  return context;
}

// Custom hooks for specific functionality
export function useEmailAddresses() {
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

export function useAuthenticators() {
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

export function useProviderAccounts() {
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
