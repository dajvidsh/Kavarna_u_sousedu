import { useAuth } from '@/context/AuthContext';

export function useGoogleAuth() {
  const { loginWithGooglePopup } = useAuth();

  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      await loginWithGooglePopup();
      return true;
    } catch (error: any) {
      if (
        error?.code === 'auth/popup-closed-by-user' ||
        error?.code === 'auth/cancelled-popup-request'
      ) {
        return false;
      }

      throw error;
    }
  };

  return { signInWithGoogle };
}
