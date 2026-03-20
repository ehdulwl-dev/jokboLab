import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface AuthState {
  isAuthenticated: boolean;
  clanName: string | null;
  code: string | null;
}

interface AuthContextType extends AuthState {
  verify: (code: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
}

const clanCodeMap: Record<string, string> = {
  HEO123: "허씨",
  KIM999: "김씨",
  LEE456: "이씨",
  PARK78: "박씨",
  CHOI55: "최씨",
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false, clanName: null, code: null });
  const [isAdmin, setIsAdmin] = useState(false);

  const verify = useCallback((code: string) => {
    const clan = clanCodeMap[code.toUpperCase()];
    if (clan) {
      setAuth({ isAuthenticated: true, clanName: clan, code: code.toUpperCase() });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setAuth({ isAuthenticated: false, clanName: null, code: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, verify, logout, isAdmin, setIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
