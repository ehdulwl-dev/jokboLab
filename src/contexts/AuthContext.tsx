import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { verifyFamilyCode } from "@/services/familyCodeService";

interface AuthState {
  isAuthenticated: boolean;
  clanName: string | null;
  code: string | null;
}

interface AuthContextType extends AuthState {
  verify: (code: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false, clanName: null, code: null });
  const [isAdmin, setIsAdmin] = useState(false);

  const verify = useCallback(async (code: string): Promise<boolean> => {
    try {
      const result = await verifyFamilyCode(code);
      if (result) {
        setAuth({ isAuthenticated: true, clanName: result.clan_name, code: result.code });
        return true;
      }
    } catch (err) {
      console.error("인증 실패:", err);
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
