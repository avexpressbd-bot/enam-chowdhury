import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "./firebase";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth || typeof auth.onAuthStateChanged !== 'function') {
      console.warn("Firebase Auth not initialized correctly");
      setLoading(false);
      return;
    }
    
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user);
        if (user) {
          const normalizedUserEmail = user.email?.toLowerCase().trim();
          const targetAdminEmail = "jummanbepari5@gmail.com".toLowerCase().trim();
          
          console.log("Auth User detected:", normalizedUserEmail);
          
          // Primary check: Email match (instant)
          if (normalizedUserEmail === targetAdminEmail) {
            console.log("Admin match found by email!");
            setIsAdmin(true);
            setLoading(false);
            return;
          }

          // Secondary check: Database check (if logic exists there)
          try {
            const adminDoc = await getDoc(doc(db, "admins", user.uid));
            if (adminDoc?.exists()) {
              console.log("Admin match found in Database!");
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          } catch (error) {
            console.error("Database admin check skipped or failed:", error);
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      }, (error) => {
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
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, logout }}>
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
