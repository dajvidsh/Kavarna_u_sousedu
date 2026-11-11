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
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const { register } = useAuth();
  const { signInWithGoogle } = useGoogleAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail) {
      Alert.alert('Chyba', 'Zadejte prosím svou emailovou adresu.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert('Chyba', 'Zadaný email nemá platný formát.');
      return;
    }

    if (!password) {
      Alert.alert('Chyba', 'Zadejte prosím heslo.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Chyba', 'Heslo musí mít alespoň 6 znaků.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Chyba', 'Zadaná hesla se neshodují.');
      return;
    }

    setLoading(true);
    try {
      await register(trimmedEmail, password, trimmedName || undefined);
      Alert.alert(
        'Účet vytvořen!',
        'Váš účet byl úspěšně zaregistrován. Jako uvítací dárek získáváte 1 bod do věrnostní karty.',
        [
          {
            text: 'Vstoupit do kavárny',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Chyba registrace', getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const ok = await signInWithGoogle();
      if (ok) {
        Alert.alert('Účet vytvořen!', 'Úspěšně jste se zaregistrovali přes Google.', [
          { text: 'Vstoupit do kavárny', onPress: () => router.replace('/(tabs)') },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Chyba Google registrace', getAuthErrorMessage(error));
    } finally {
      setLoading(false);
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
            <Text style={styles.title}>Vytvořit účet</Text>
            <View style={styles.subtitleRow}>
              <Text style={styles.subtitle}>Vytvořte nový účet nebo se </Text>
              <Pressable onPress={() => router.replace('/login')}>
                <Text style={styles.link}>Přihlaste</Text>
              </Pressable>
            </View>
          </View>

          {/* Form Inputs */}
          <View style={styles.form}>
            {/* Jméno a příjmení */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Jméno a příjmení</Text>
              <TextInput
                style={styles.input}
                placeholder="např. Anna Nováková"
                placeholderTextColor={Colors.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                editable={!loading}
              />
            </View>

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

            {/* Heslo */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Heslo (min. 6 znaků)</Text>
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

            {/* Heslo znovu */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Heslo znovu</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.textMuted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                  accessibilityLabel={showConfirmPassword ? 'Skrýt heslo' : 'Zobrazit heslo'}
                >
                  <Feather
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={Colors.textMuted}
                  />
                </Pressable>
              </View>
            </View>

            {/* Tlačítko Vytvořit účet */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Vytvořit účet</Text>
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
                <Text style={styles.socialButtonText}>Pokračovat přes Google</Text>
              </Pressable>
            </View>

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
    marginBottom: 24,
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
    gap: 15,
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
});
