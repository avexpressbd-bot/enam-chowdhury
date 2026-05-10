import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "./firebase";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: () => Promise<void>;
  loginWithCredentials: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [manualIsAdmin, setManualIsAdmin] = useState(() => {
    try {
      return localStorage.getItem("manual_admin") === "true";
    } catch (e) {
      return false;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem("manual_admin", String(manualIsAdmin));
    } catch (e) {
      // Ignore
    }
  }, [manualIsAdmin]);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth || typeof auth.onAuthStateChanged !== 'function') {
      console.warn("Firebase Auth not initialized correctly");
      setLoading(false);
      return;
    }
    
    // Safety timeout: stop loading if Firebase takes too long (e.g. 3.5 seconds)
    const safetyTimer = setTimeout(() => {
      if (loading) {
        console.warn("Auth status callback timed out - forcing app load");
        setLoading(false);
      }
    }, 3500);

    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        clearTimeout(safetyTimer);
        setUser(user);
        
        if (user) {
          const normalizedUserEmail = user.email?.toLowerCase().trim();
          console.log("Auth User detected:", normalizedUserEmail);
          
          // Primary check: Email match (instant)
          if (normalizedUserEmail === "jummanbepari5@gmail.com") {
            setIsAdmin(true);
            setLoading(false);
            return;
          }

          // Secondary check: Database check
          try {
            const adminDoc = await getDoc(doc(db, "admins", user.uid));
            setIsAdmin(adminDoc?.exists() || false);
          } catch (error) {
            console.error("Database admin check failed:", error);
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }, (error) => {
        clearTimeout(safetyTimer);
        console.error("Auth state change error:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Failed to setup auth listener:", error);
      setLoading(false);
    }
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    setManualIsAdmin(false);
    await signOut(auth);
  };

  const loginWithCredentials = async (username: string, password: string) => {
    if (username === "admin" && password === "admin123") {
      try {
        // If not already signed in to Firebase, sign in anonymously to satisfy security rules
        if (!auth.currentUser) {
          const { signInAnonymously } = await import("firebase/auth");
          await signInAnonymously(auth);
        }
        setManualIsAdmin(true);
        return true;
      } catch (e) {
        console.error("Firebase Anonymous Auth failed:", e);
        // Even if Firebase fails, we still allow UI admin, but writes might fail
        setManualIsAdmin(true);
        return true;
      }
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin: isAdmin || manualIsAdmin, loading, login, loginWithCredentials, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
