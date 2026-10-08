import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  adminUser: { email: string; name: string; role: string } | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithMasterKey: (key: string) => Promise<boolean>;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// STRICT ACCESS: Only this email is authorized for Admin Dashboard
export const AUTHORIZED_SUPER_ADMIN_EMAIL = 'gazisohan37@gmail.com';
export const MASTER_ADMIN_SECRET = 'gazi738#yp2026';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userEmail = (user.email || '').toLowerCase().trim();
        const allowedEmail = AUTHORIZED_SUPER_ADMIN_EMAIL.toLowerCase().trim();

        if (userEmail === allowedEmail) {
          setCurrentUser(user);
          // Register super admin in Firestore registry
          try {
            await setDoc(
              doc(db, 'admins', user.uid),
              {
                email: user.email,
                name: user.displayName || 'Gazi Sohan',
                role: 'super_admin',
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
          } catch (e) {
            console.warn('Admin record sync note:', e);
          }
        } else {
          // Unrecognized user attempting to access admin
          console.warn(`Unauthorized login attempt by: ${user.email}`);
          await signOut(auth);
          setCurrentUser(null);
          setAuthError(
            `প্রবেশাধিকার সংরক্ষিত / Access Denied: শুধুমাত্র ${AUTHORIZED_SUPER_ADMIN_EMAIL} এডমিন প্যানেলে প্রবেশ করতে পারেন। (${user.email} অনুমোদিত নয়)`
          );
        }
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const cred = await signInWithPopup(auth, provider);
      const email = (cred.user.email || '').toLowerCase().trim();
      const target = AUTHORIZED_SUPER_ADMIN_EMAIL.toLowerCase().trim();

      if (email !== target) {
        await signOut(auth);
        setCurrentUser(null);
        const errMsg = `প্রবেশাধিকার সংরক্ষিত / Access Denied: শুধুমাত্র ${AUTHORIZED_SUPER_ADMIN_EMAIL} এডমিন প্যানেলে প্রবেশ করতে পারেন। (${cred.user.email} অনুমোদিত নয়)`;
        setAuthError(errMsg);
        throw new Error(errMsg);
      }
    } catch (err: any) {
      console.error('Admin authentication gate:', err);
      if (!authError) {
        setAuthError(err.message || 'Authentication failed. Please verify your Google account.');
      }
      throw err;
    }
  };

  const loginWithMasterKey = async (key: string): Promise<boolean> => {
    setAuthError(null);
    const cleanedKey = (key || '').trim();
    if (cleanedKey === MASTER_ADMIN_SECRET) {
      // Authenticated as authorized Super Admin Gazi Sohan
      const mockAdminUser: any = {
        uid: 'super-admin-sohan',
        email: AUTHORIZED_SUPER_ADMIN_EMAIL,
        displayName: 'Gazi Sohan',
        photoURL: null,
      };
      setCurrentUser(mockAdminUser);
      return true;
    } else {
      const errMsg = `প্রবেশাধিকার সংরক্ষিত / Access Denied: ভুল এডমিন মাস্টার কি। শুধুমাত্র অনুমোদিত সুপার এডমিন (${AUTHORIZED_SUPER_ADMIN_EMAIL}) প্রবেশ করতে পারেন।`;
      setAuthError(errMsg);
      throw new Error(errMsg);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setAuthError(null);
    } catch (e) {
      console.warn('SignOut error:', e);
    }
  };

  // Strictly check that user email matches authorized super admin
  const isSuperAdmin = Boolean(
    currentUser &&
      currentUser.email?.toLowerCase().trim() === AUTHORIZED_SUPER_ADMIN_EMAIL.toLowerCase().trim()
  );

  const isAdmin = isSuperAdmin;

  const activeAdmin = isSuperAdmin
    ? {
        email: currentUser?.email || AUTHORIZED_SUPER_ADMIN_EMAIL,
        name: currentUser?.displayName || 'Gazi Sohan (Super Admin)',
        role: 'super_admin',
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        adminUser: activeAdmin,
        isAdmin,
        isSuperAdmin,
        isLoading,
        loginWithGoogle,
        loginWithMasterKey,
        logout,
        authError,
        clearAuthError: () => setAuthError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
