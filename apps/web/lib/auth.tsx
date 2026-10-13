"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserSession {
  id: string;
  fullName: string;
  email: string;
  careerStage?: string;
  isDemo?: boolean;
}

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (fullName: string, email: string, password?: string) => Promise<void>;
  loginAsDemo: () => void;
  logout: () => void;
}

const DEFAULT_DEMO_USER: UserSession = {
  id: "060881a8-bbe2-4476-ac53-7ef2e9b98a4c",
  fullName: "Alex Chen",
  email: "alex.chen@university.edu",
  careerStage: "Senior Undergraduate / Aspiring AI Engineer",
  isDemo: true,
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  loginAsDemo: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("careergap_user_session");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Initialize with default demo user for frictionless hackathon demonstration
        setUser(DEFAULT_DEMO_USER);
        localStorage.setItem("careergap_user_session", JSON.stringify(DEFAULT_DEMO_USER));
      }
    } catch {
      setUser(DEFAULT_DEMO_USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, _password?: string) => {
    setIsLoading(true);
    try {
      const newUser: UserSession = {
        id: `user_${Math.random().toString(36).substring(2, 10)}`,
        fullName: email.split("@")[0].replace(".", " ").replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
        email,
        careerStage: "Candidate",
        isDemo: false,
      };
      setUser(newUser);
      localStorage.setItem("careergap_user_session", JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, email: string, _password?: string) => {
    setIsLoading(true);
    try {
      const newUser: UserSession = {
        id: `user_${Math.random().toString(36).substring(2, 10)}`,
        fullName,
        email,
        careerStage: "Candidate",
        isDemo: false,
      };
      setUser(newUser);
      localStorage.setItem("careergap_user_session", JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = () => {
    setUser(DEFAULT_DEMO_USER);
    localStorage.setItem("careergap_user_session", JSON.stringify(DEFAULT_DEMO_USER));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("careergap_user_session");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
