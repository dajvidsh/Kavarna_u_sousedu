import { initializeApp, getApps, getApp } from 'firebase/app';
// @ts-expect-error getReactNativePersistence je exportováno v React Native buildu firebase/auth
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

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

const requiredConfigValues = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.messagingSenderId,
  firebaseConfig.appId,
];
const hasFirebaseConfig = requiredConfigValues.every(
  (value) => value?.trim() && !value.startsWith('your_')
);

export const firebaseConfigError =
  'Firebase není nakonfigurováno. Zkopírujte .env.example do .env a doplňte údaje svého Firebase projektu.';

let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;

if (hasFirebaseConfig) {
  try {
    // Reuse an existing app during Fast Refresh.
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

    if (Platform.OS !== 'web') {
      try {
        auth = initializeAuth(app, {
          persistence: getReactNativePersistence(AsyncStorage),
        });
      } catch {
        auth = getAuth(app);
      }
    } else {
      auth = getAuth(app);
    }

    db = getFirestore(app);
  } catch {
    app = null;
    auth = null;
    db = null;
  }
}

export { app, auth, db };
