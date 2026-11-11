import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { firebaseConfigError } from '@/services/firebase';
import { getAuthErrorMessage } from '@/utils/authErrors';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthScreen({ mode }: { mode: 'login' | 'register' }) {
  const { login, register, loginWithGoogleToken, loginWithGooglePopup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isRegister = mode === 'register';

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);

    try {
      if (isRegister) {
        await register(email, password, name.trim() || undefined);
      } else {
        await login(email, password);
      }
      router.back();
    } catch (authError) {
      setError(
        authError instanceof Error && authError.message === firebaseConfigError
          ? firebaseConfigError
          : getAuthErrorMessage(authError)
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSubmitting(true);

    try {
      if (Platform.OS === 'web') {
        await loginWithGooglePopup();
      } else {
        const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
        const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

        if (!webClientId || webClientId.startsWith('your_')) {
          throw new Error('Google přihlášení není nakonfigurováno. Doplňte OAuth client ID do .env.');
        }
        if (Platform.OS === 'ios' && !iosClientId) {
          throw new Error('Google přihlášení pro iOS není nakonfigurováno. Doplňte iOS client ID do .env.');
        }

        GoogleSignin.configure({
          webClientId,
          ...(Platform.OS === 'ios' ? { iosClientId } : {}),
        });

        if (Platform.OS === 'android') {
          await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        }

        const response = await GoogleSignin.signIn();
        if (response.type === 'cancelled') return;

        const idToken = response.data.idToken;
        if (!idToken) {
          throw new Error('Google nevrátil ověřovací token. Zkontrolujte nastavení OAuth client ID.');
        }

        await loginWithGoogleToken(idToken);
      }

      router.back();
    } catch (authError) {
      setError(
        authError instanceof Error && authError.message === firebaseConfigError
          ? firebaseConfigError
          : getAuthErrorMessage(authError)
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable
            accessibilityLabel="Zpět"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={22} color={Colors.primaryDark} />
          </Pressable>

          <View style={styles.heading}>
            <Feather name="coffee" size={28} color={Colors.accentBrown} />
            <Text style={styles.title}>{isRegister ? 'Vytvořit účet' : 'Přihlášení'}</Text>
            <Text style={styles.subtitle}>
              {isRegister
                ? 'Založte si účet a mějte svou věrnostní kartu vždy po ruce.'
                : 'Přihlaste se ke svému účtu a zobrazte svou věrnostní kartu.'}
            </Text>
          </View>

          <View style={styles.form}>
            {isRegister ? (
              <>
                <Text style={styles.label}>Jméno</Text>
                <TextInput
                  autoCapitalize="words"
                  autoComplete="name"
                  onChangeText={setName}
                  placeholder="Vaše jméno"
                  placeholderTextColor={Colors.textMuted}
                  style={styles.input}
                  value={name}
                />
              </>
            ) : null}

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="vas@email.cz"
              placeholderTextColor={Colors.textMuted}
              style={styles.input}
              value={email}
            />

            <Text style={styles.label}>Heslo</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete={isRegister ? 'new-password' : 'password'}
              onChangeText={setPassword}
              placeholder="Zadejte heslo"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry
              style={styles.input}
              value={password}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              accessibilityRole="button"
              disabled={submitting}
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.submitButton,
                (pressed || submitting) && styles.buttonPressed,
              ]}
            >
              {submitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isRegister ? 'Vytvořit účet' : 'Přihlásit se'}
                </Text>
              )}
            </Pressable>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>nebo</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable
              accessibilityRole="button"
              disabled={submitting}
              onPress={handleGoogleSignIn}
              style={({ pressed }) => [
                styles.googleButton,
                (pressed || submitting) && styles.buttonPressed,
              ]}
            >
              {submitting ? (
                <ActivityIndicator color={Colors.primaryDark} />
              ) : (
                <>
                  <MaterialCommunityIcons name="google" size={20} color="#4285F4" />
                  <Text style={styles.googleButtonText}>Pokračovat přes Google</Text>
                </>
              )}
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.replace(isRegister ? '/login' : '/register')}
              style={styles.switchButton}
            >
              <Text style={styles.switchText}>
                {isRegister ? 'Už máte účet? Přihlaste se' : 'Ještě nemáte účet? Zaregistrujte se'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: Colors.background, flex: 1 },
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: 20 },
  backButton: {
    alignItems: 'center',
    backgroundColor: Colors.secondaryBg,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  heading: { alignItems: 'center', marginTop: 32 },
  title: {
    color: Colors.textPrimary,
    fontFamily: 'serif',
    fontSize: 26,
    fontWeight: '700',
    marginTop: 12,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    maxWidth: 320,
    textAlign: 'center',
  },
  form: { marginTop: 30 },
  label: { color: Colors.textPrimary, fontSize: 13, fontWeight: '700', marginBottom: 7, marginTop: 14 },
  input: {
    backgroundColor: Colors.cardBg,
    borderColor: Colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: Colors.textPrimary,
    fontSize: 15,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  error: { color: '#A4382C', fontSize: 13, lineHeight: 19, marginTop: 12 },
  submitButton: {
    alignItems: 'center',
    backgroundColor: Colors.primaryDark,
    borderRadius: 999,
    justifyContent: 'center',
    marginTop: 24,
    minHeight: 50,
  },
  submitButtonText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  buttonPressed: { opacity: 0.8 },
  divider: { alignItems: 'center', flexDirection: 'row', gap: 12, marginTop: 20 },
  dividerLine: { backgroundColor: Colors.border, flex: 1, height: 1 },
  dividerText: { color: Colors.textMuted, fontSize: 12 },
  googleButton: {
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderColor: Colors.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginTop: 16,
    minHeight: 50,
  },
  googleButtonText: { color: Colors.textPrimary, fontSize: 14, fontWeight: '700' },
  switchButton: { alignItems: 'center', paddingVertical: 18 },
  switchText: { color: Colors.accentBrown, fontSize: 13, fontWeight: '700', textAlign: 'center' },
});
