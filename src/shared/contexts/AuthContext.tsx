import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import {
  type AuthSession,
  loadAuthSession,
  login,
  logout,
  refreshAuthSession,
  register,
} from "@/services/api/api";

type AuthUser = {
  email: string;
};

type Profile = {
  name: string;
};

interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getProfileFromEmail = (email: string): Profile => ({
  name: email.split("@")[0] || "Пользователь",
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applySession = useCallback((nextSession: AuthSession | null) => {
    setSession(nextSession);

    if (nextSession?.email) {
      setUser({ email: nextSession.email });
      setProfile(getProfileFromEmail(nextSession.email));
    } else {
      setUser(null);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      const storedSession = loadAuthSession();

      if (!storedSession) {
        if (isMounted) {
          applySession(null);
          setIsLoading(false);
        }

        return;
      }

      if (isMounted) {
        applySession(storedSession);
      }

      try {
        if (Date.now() >= storedSession.accessTokenExpiresAt - 60 * 1000) {
          const refreshedSession = await refreshAuthSession();

          if (isMounted) {
            applySession(refreshedSession);
          }
        }
      } catch {
        if (isMounted) {
          applySession(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [applySession]);

  const signUp = async (email: string, password: string) => {
    try {
      const nextSession = await register({ email, password });
      applySession(nextSession);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const nextSession = await login({ email, password });
      applySession(nextSession);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      applySession(null);
    }
  };

  const refreshProfile = useCallback(async () => {
    if (session?.email) {
      const nextProfile = getProfileFromEmail(session.email);

      setProfile((currentProfile) => {
        if (currentProfile?.name === nextProfile.name) {
          return currentProfile;
        }

        return nextProfile;
      });
    }
  }, [session?.email]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isAuthenticated: !!session?.access_token,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
