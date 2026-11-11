import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { useGoogleAuth } from '@/hooks/use-google-auth';
import { getAuthErrorMessage } from '@/utils/authErrors';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { login, resetPassword } = useAuth();
  const { signInWithGoogle } = useGoogleAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Chyba', 'Zadejte prosím svůj email.');
      return;
    }
    if (!password) {
      Alert.alert('Chyba', 'Zadejte prosím své heslo.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      Alert.alert('Vítejte!', 'Úspěšně jste se přihlásili.', [
        {
          text: 'Vstoupit do kavárny',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Chyba přihlášení', getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const ok = await signInWithGoogle();
      if (ok) {
        Alert.alert('Vítejte!', 'Úspěšně jste se přihlásili přes Google.', [
          { text: 'Vstoupit do kavárny', onPress: () => router.replace('/(tabs)') },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Chyba Google přihlášení', getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail.trim()) {
      Alert.alert('Chyba', 'Zadejte prosím emailovou adresu.');
      return;
    }

    setResetLoading(true);
    try {
      await resetPassword(resetEmail);
      Alert.alert(
        'Email odeslán',
        `Na adresu ${resetEmail.trim()} jsme odeslali odkaz pro obnovení hesla. Zkontrolujte prosím svou emailovou schránku.`,
        [
          {
            text: 'Rozumím',
            onPress: () => {
              setResetModalVisible(false);
              setResetEmail('');
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Chyba', getAuthErrorMessage(error));
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with Back button */}
          <View style={styles.header}>
            <Pressable
              accessibilityLabel="Zpět"
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            >
              <Feather name="arrow-left" size={22} color={Colors.primaryDark} />
            </Pressable>
          </View>

          {/* Titles */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Vítejte zpět!</Text>
            <View style={styles.subtitleRow}>
              <Text style={styles.subtitle}>Přihlaste se nebo si </Text>
              <Pressable onPress={() => router.replace('/register')}>
                <Text style={styles.link}>Vytvořte nový účet</Text>
              </Pressable>
            </View>
          </View>

          {/* Form Inputs */}
          <View style={styles.form}>
            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="jan.novak@email.cz"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            {/* Heslo s toggle ikonou */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Heslo</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  accessibilityLabel={showPassword ? 'Skrýt heslo' : 'Zobrazit heslo'}
                >
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={Colors.textMuted}
                  />
                </Pressable>
              </View>
            </View>

            {/* Tlačítko Přihlásit se */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Přihlásit se</Text>
              )}
            </Pressable>

            {/* Oddělovač nebo */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>nebo</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <Pressable
                style={({ pressed }) => [styles.socialButton, pressed && styles.pressed]}
                onPress={handleGoogleSignIn}
                disabled={loading}
              >
                <FontAwesome name="google" size={18} color="#EA4335" style={styles.socialIcon} />
                <Text style={styles.socialButtonText}>Přihlásit se přes Google</Text>
              </Pressable>
            </View>

            {/* Zapomenuté heslo */}
            <Pressable
              onPress={() => {
                setResetEmail(email);
                setResetModalVisible(true);
              }}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Zapomenuté heslo</Text>
            </Pressable>

            {/* Pokračovat bez účtu */}
            <Pressable
              onPress={() => router.replace('/(tabs)')}
              style={styles.skipButton}
            >
              <Text style={styles.skipButtonText}>Pokračovat bez účtu →</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal pro obnovení hesla */}
      <Modal
        visible={resetModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setResetModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Obnovení hesla</Text>
            <Text style={styles.modalText}>
              Zadejte svou emailovou adresu, na kterou vám zašleme odkaz pro vytvoření nového hesla.
            </Text>

            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="jan.novak@email.cz"
              placeholderTextColor={Colors.textMuted}
              value={resetEmail}
              onChangeText={setResetEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setResetModalVisible(false)}
                disabled={resetLoading}
              >
                <Text style={styles.modalCancelText}>Zrušit</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={handleResetPassword}
                disabled={resetLoading}
              >
                {resetLoading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.modalConfirmText}>Odeslat odkaz</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: Colors.secondaryBg,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  pressed: {
    opacity: 0.75,
  },
  titleSection: {
    marginBottom: 26,
  },
  title: {
    color: Colors.textPrimary,
    fontFamily: 'serif',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  link: {
    color: Colors.accentBrown,
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    backgroundColor: Colors.cardBg,
    borderColor: Colors.border,
    borderRadius: 14,
    borderWidth: 1,
    color: Colors.textPrimary,
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  passwordWrapper: {
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderColor: Colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  passwordInput: {
    color: Colors.textPrimary,
    flex: 1,
    fontSize: 15,
    paddingVertical: 14,
  },
  eyeButton: {
    padding: 6,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: Colors.primaryDark,
    borderRadius: 14,
    justifyContent: 'center',
    marginTop: 6,
    paddingVertical: 15,
  },
  primaryButtonPressed: {
    backgroundColor: Colors.primaryDarkPressed,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  dividerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: {
    backgroundColor: Colors.border,
    flex: 1,
    height: 1,
  },
  dividerText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  socialButtons: {
    gap: 10,
  },
  socialButton: {
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderColor: Colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 13,
  },
  socialIcon: {
    marginRight: 10,
    width: 22,
    textAlign: 'center',
  },
  socialButtonText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  forgotPasswordText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  skipButton: {
    alignItems: 'center',
    marginTop: 6,
    paddingVertical: 6,
  },
  skipButtonText: {
    color: Colors.accentBrown,
    fontSize: 13,
    fontWeight: '700',
  },

  // Modal styles
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: Colors.cardBg,
    borderColor: Colors.border,
    borderRadius: 20,
    borderWidth: 1,
    padding: 22,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalText: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalButton: {
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  modalCancelButton: {
    backgroundColor: Colors.secondaryBg,
  },
  modalCancelText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  modalConfirmButton: {
    backgroundColor: Colors.primaryDark,
    minWidth: 110,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
