"use client";

import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/constants";
import { useMutation } from "@tanstack/react-query";
import React, { createContext, useCallback, useEffect, useState } from "react";

type CreateAuthServiceParameters<TUser> = {
  /**
   * Function to handle user login. Reject with an instance of Error or a subclass if login fails.
   * The error message should be descriptive and user-friendly.
   * @param args - The login credentials.
   * @returns A promise that resolves to the login result or rejects with an error.
   */
  loginFn: (args: {
    username: string;
    password: string;
  }) => Promise<{ token: string; user: TUser }>;
};

function createAuthService<TUser>({
  loginFn,
}: CreateAuthServiceParameters<TUser>) {
  const AuthContext = createContext<{
    user: TUser | null;
    token: string | null;
    isLoggingIn: boolean;
    error: Error | null;
    login: (username: string, password: string) => void;
    logout: () => void;
    setAuthDetails: (token: string, user: TUser) => void;
  }>({
    user: null,
    token: null,
    isLoggingIn: false,
    error: null,
    login: async () => {},
    logout: () => {},
    setAuthDetails: () => {},
  });

  function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<TUser | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
      // On mount, check localStorage for token, user, and userType
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const storedUser: TUser | null = JSON.parse(
        localStorage.getItem(AUTH_USER_KEY) || "null"
      );
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
    }, []);

    const {
      mutate: _login,
      isPending: isLoggingIn,
      error,
    } = useMutation({
      mutationFn: loginFn,
      onSuccess: ({ token, user }) => {
        setToken(token);
        setUser(user);
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      },
      onError: (error) => {
        console.error("Login failed:", error);
      },
    });

    const login = useCallback(
      async (username: string, password: string) =>
        _login({ username, password }),
      [_login]
    );

    const logout = useCallback(() => {
      setToken(null);
      setUser(null);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    }, []);

    const setAuthDetails = useCallback((token: string, user: TUser) => {
      setToken(token);
      setUser(user);
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    }, []);

    return (
      <AuthContext
        value={{
          user,
          token,
          login,
          logout,
          isLoggingIn,
          error,
          setAuthDetails,
        }}
      >
        {children}
      </AuthContext>
    );
  }

  function useAuth() {
    const context = React.use(AuthContext);
    return context;
  }

  return {
    AuthProvider,
    useAuth,
  };
}

export default createAuthService;
