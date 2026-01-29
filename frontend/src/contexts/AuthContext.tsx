"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { AuthContextType, User, AuthResponse } from "@/types";
import { authService } from "@/services/auth";
import { STORAGE_KEYS } from "@/lib/config";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeAuth = useCallback(() => {
    try {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (storedToken && storedUser && storedUser !== "undefined") {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Erro ao inicializar autenticação:", error);
      toast.error("Erro ao inicializar autenticação");
      clearStoredAuth();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const clearStoredAuth = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response: AuthResponse = await authService.login(
        username,
        password,
      );
      updateAuthState(response.access_token, response.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ): Promise<void> => {
    const response: AuthResponse = await authService.register(
      username,
      email,
      password,
    );
    updateAuthState(response.access_token, response.user);
  };

  const logout = (): void => {
    setToken(null);
    setUser(null);
    clearStoredAuth();
  };

  const updateAuthState = (newToken: string, newUser: User): void => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
