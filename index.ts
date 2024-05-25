import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactElement,
} from "react";
import { AllauthClient, User } from "@knowsuchagency/allauth-fetch";

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: {
    username?: string;
    email?: string;
    password: string;
  }) => Promise<void>;
  signup: (data: {
    email?: string;
    username?: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext: React.Context<AuthContextData | undefined> = createContext<
  AuthContextData | undefined
>(undefined);

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
  apiBaseUrl: string;
  client: "app" | "browser";
}

export function AuthProvider({
  children,
  apiBaseUrl,
  client,
}: AuthProviderProps): ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const allauthClient = new AllauthClient(client, apiBaseUrl);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await allauthClient.getAuthenticationStatus();
        if ("user" in response) {
          setUser(response.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
      }
    };

    checkAuthStatus();
  }, [allauthClient]);

  const login = async (data: {
    username?: string;
    email?: string;
    password: string;
  }) => {
    try {
      const response = await allauthClient.login(data);
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const signup = async (data: {
    email?: string;
    username?: string;
    password: string;
  }) => {
    try {
      const response = await allauthClient.signup(data);
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const logout = async () => {
    try {
      await allauthClient.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const authContextValue: AuthContextData = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
  };

  return React.createElement(
    AuthContext.Provider,
    { value: authContextValue },
    children
  );
}
