import { initializeApp, getApps, getApp } from 'firebase/app';
// @ts-expect-error getReactNativePersistence je exportováno v React Native buildu firebase/auth
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase konfigurace načtená z proměnných prostředí (.env soubor)
// Expo automaticky zpřístupňuje všechny proměnné s předponou EXPO_PUBLIC_
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Inicializace aplikace (ošetření pro Fast Refresh / Hot Reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inicializace Firebase Authentication s trvalým uložením do paměti telefonu (AsyncStorage)
let auth: ReturnType<typeof getAuth>;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

// Inicializace Firestore databáze
const db = getFirestore(app);

export { app, auth, db };
