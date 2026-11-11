import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, firebaseConfigError } from '@/services/firebase';
import { USER_DATA, UserProfile } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name?: string) => Promise<void>;
  loginWithGoogleToken: (idToken: string) => Promise<void>;
  loginWithGooglePopup: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateName: (newName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  loginWithGoogleToken: async () => {},
  loginWithGooglePopup: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  updateName: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(Boolean(auth));
  const pendingName = useRef<string | undefined>(undefined);

  const fetchOrInitUserProfile = async (firebaseUser: User, fallbackName?: string) => {
    try {
      if (!db) throw new Error(firebaseConfigError);
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        setUserProfile(userSnap.data() as UserProfile);
      } else {
        const newProfile: UserProfile = {
          name: fallbackName || firebaseUser.displayName || 'Věrný zákazník',
          email: firebaseUser.email || '',
          cardNumber: `00${Math.floor(100000 + Math.random() * 900000)}/28`,
          currentPoints: 1,
          totalPoints: 10,
          lastPurchase: {
            date: 'Dnes',
            location: 'Registrace',
            summary: 'Uvítací bonus',
            pointsEarned: 1,
          },
        };
        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch {
      setUserProfile({
        name: fallbackName || firebaseUser.displayName || 'Věrný zákazník',
        email: firebaseUser.email || '',
        cardNumber: USER_DATA.cardNumber,
        currentPoints: 1,
        totalPoints: 10,
        lastPurchase: {
          date: 'Dnes',
          location: 'Údolní',
          summary: '1 nákup (káva)',
          pointsEarned: 1,
        },
      });
    }
  };

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchOrInitUserProfile(currentUser, pendingName.current);
        pendingName.current = undefined;
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, pass: string) => {
    if (!auth) throw new Error(firebaseConfigError);
    await signInWithEmailAndPassword(auth, email.trim(), pass);
  };

  const register = async (email: string, pass: string, name?: string) => {
    if (!auth) throw new Error(firebaseConfigError);
    pendingName.current = name?.trim() || undefined;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (pendingName.current) {
        await updateProfile(userCredential.user, { displayName: pendingName.current }).catch(() => {});
      }
    } catch (error) {
      pendingName.current = undefined;
      throw error;
    }
  };

  const loginWithGoogleToken = async (idToken: string) => {
    if (!auth) throw new Error(firebaseConfigError);
    const credential = GoogleAuthProvider.credential(idToken);
    await signInWithCredential(auth, credential);
  };

  const loginWithGooglePopup = async () => {
    if (!auth) throw new Error(firebaseConfigError);
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error(firebaseConfigError);
    await sendPasswordResetEmail(auth, email.trim());
  };

  const updateName = async (newName: string) => {
    if (!user) return;
    try {
      await updateProfile(user, { displayName: newName.trim() });
      if (db) {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { name: newName.trim() }, { merge: true });
      }
    } catch {
      // ignore
    }
    setUserProfile((prev) => (prev ? { ...prev, name: newName.trim() } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        login,
        register,
        loginWithGoogleToken,
        loginWithGooglePopup,
        logout,
        resetPassword,
        updateName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
