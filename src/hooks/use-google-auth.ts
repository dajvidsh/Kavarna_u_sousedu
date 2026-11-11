import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
import { useAuth } from '@/context/AuthContext';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
});

export function useGoogleAuth() {
  const { loginWithGoogleToken } = useAuth();

  const signInWithGoogle = async (): Promise<boolean> => {
    await GoogleSignin.hasPlayServices();
    const res = await GoogleSignin.signIn();

    if (!isSuccessResponse(res)) {
      return false;
    }

    const idToken = res.data.idToken;
    if (!idToken) {
      throw new Error('Google nevrátil ID token.');
    }

    await loginWithGoogleToken(idToken);
    return true;
  };

  return { signInWithGoogle };
}
