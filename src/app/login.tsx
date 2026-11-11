import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { KavarnaColors } from "@/constants/kavarna-theme";
import { Fonts, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { getAuthErrorMessage } from "@/utils/authErrors";

type AuthMode = "login" | "register" | "forgotPassword";

export default function LoginScreen() {
  const router = useRouter();
  const { login, register, resetPassword, loginWithGooglePopup } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Formulářové stavy
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Viditelnost hesel
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const showAlert = (title: string, message: string, onOk?: () => void) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n\n${message}`);
      onOk?.();
    } else {
      Alert.alert(title, message, [{ text: "OK", onPress: onOk }]);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrorMessage(null);
    setInfoMessage(null);
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    setInfoMessage(null);

    if (!email.trim()) {
      setErrorMessage("Zadejte prosím svůj email.");
      return;
    }

    if (mode === "login") {
      if (!password) {
        setErrorMessage("Zadejte prosím heslo.");
        return;
      }

      try {
        setLoading(true);
        await login(email, password);
        router.replace("/");
      } catch (error) {
        console.error("Login error:", error);
        setErrorMessage(getAuthErrorMessage(error));
      } finally {
        setLoading(false);
      }
    } else if (mode === "register") {
      if (!password || password.length < 6) {
        setErrorMessage("Heslo musí mít alespoň 6 znaků.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Zadaná hesla se neshodují.");
        return;
      }

      try {
        setLoading(true);
        await register(email, password);
        router.replace("/");
      } catch (error) {
        console.error("Register error:", error);
        setErrorMessage(getAuthErrorMessage(error));
      } finally {
        setLoading(false);
      }
    } else if (mode === "forgotPassword") {
      try {
        setLoading(true);
        await resetPassword(email);
        setInfoMessage("Odkaz k obnovení hesla jsme odeslali na váš email.");
        showAlert(
          "Odesláno",
          "Odkaz k obnovení hesla jsme odeslali na váš email.",
          () => switchMode("login"),
        );
      } catch (error) {
        console.error("Reset password error:", error);
        setErrorMessage(getAuthErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSocialAuth = async (
    provider: "apple" | "google" | "facebook",
  ) => {
    setErrorMessage(null);
    if (provider === "google") {
      try {
        setLoading(true);
        if (Platform.OS === "web") {
          await loginWithGooglePopup();
          router.replace("/");
        } else {
          setErrorMessage(
            "Pro mobilní zařízení je potřeba doplnit získání Google idTokenu.",
          );
        }
      } catch (error) {
        console.error("Google auth error:", error);
        setErrorMessage(getAuthErrorMessage(error));
      } finally {
        setLoading(false);
      }
      return;
    }

    setErrorMessage(
      `Přihlášení přes ${provider === "apple" ? "Apple" : "Facebook"} bude brzy k dispozici.`,
    );
  };

  const handleContinueAsGuest = () => {
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* HLAVIČKA PODLE AKTIVNÍHO REŽIMU */}
          <View style={styles.header}>
            {mode === "login" && (
              <>
                <Text style={styles.title}>Vítejte zpět!</Text>
                <Text style={styles.subtitle}>
                  Přihlaste se nebo si{" "}
                  <Text
                    style={styles.linkText}
                    onPress={() => switchMode("register")}
                  >
                    Vytvořte nový účet
                  </Text>
                </Text>
              </>
            )}

            {mode === "register" && (
              <>
                <Text style={styles.title}>Vytvořit účet</Text>
                <Text style={styles.subtitle}>
                  Vytvořte nový účet nebo se{" "}
                  <Text
                    style={styles.linkText}
                    onPress={() => switchMode("login")}
                  >
                    Přihlaste
                  </Text>
                </Text>
              </>
            )}

            {mode === "forgotPassword" && (
              <>
                <Text style={styles.title}>Zapomenuté heslo</Text>
                <Text style={styles.subtitle}>
                  Zadejte svůj email. Pošleme vám odkaz k obnovení hesla vaše U
                  Sousedů účtu.
                </Text>
              </>
            )}
          </View>

          {/* FORMULÁŘOVÁ POLE */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            {mode !== "forgotPassword" && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Heslo</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={KavarnaColors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {mode === "register" && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Heslo znovu</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={20}
                      color={KavarnaColors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* ZOBRAZENÍ CHYBY NEBO ÚSPĚCHU */}
            {errorMessage && (
              <View style={styles.errorBox}>
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color="#B42318"
                />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {infoMessage && (
              <View style={styles.infoBox}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color="#067647"
                />
                <Text style={styles.infoText}>{infoMessage}</Text>
              </View>
            )}

            {/* HLAVNÍ AKČNÍ TLAČÍTKO */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={KavarnaColors.card} />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {mode === "login" && "Přihlásit se"}
                  {mode === "register" && "Vytvořit účet"}
                  {mode === "forgotPassword" && "Odeslat odkaz"}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* SOCIÁLNÍ SÍTĚ */}
          {mode !== "forgotPassword" && (
            <>
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>nebo</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialContainer}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleSocialAuth("apple")}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="logo-apple"
                    size={20}
                    color={KavarnaColors.primary}
                  />
                  <Text style={styles.socialButtonText}>
                    Přihlásit se přes Apple
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleSocialAuth("google")}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="logo-google"
                    size={18}
                    color={KavarnaColors.primary}
                  />
                  <Text style={styles.socialButtonText}>
                    Přihlásit se přes Google
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleSocialAuth("facebook")}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="logo-facebook"
                    size={20}
                    color={KavarnaColors.primary}
                  />
                  <Text style={styles.socialButtonText}>
                    Přihlásit se přes Facebook
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* SPODNÍ ODKAZY */}
          <View style={styles.footer}>
            {mode === "login" && (
              <TouchableOpacity
                onPress={() => switchMode("forgotPassword")}
                disabled={loading}
              >
                <Text style={styles.footerLink}>Zapomenuté heslo</Text>
              </TouchableOpacity>
            )}

            {mode === "register" && (
              <TouchableOpacity
                onPress={handleContinueAsGuest}
                disabled={loading}
              >
                <Text style={styles.footerLink}>Pokračovat bez účtu</Text>
              </TouchableOpacity>
            )}

            {mode === "forgotPassword" && (
              <TouchableOpacity
                onPress={() => switchMode("login")}
                disabled={loading}
              >
                <Text style={styles.footerLink}>Zpět na přihlášení</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: KavarnaColors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: 40,
    paddingBottom: Spacing.five,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: KavarnaColors.primary,
    marginBottom: Spacing.two,
    fontFamily: Fonts.serif,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: KavarnaColors.text,
    fontFamily: Fonts.sans,
  },
  linkText: {
    fontWeight: "700",
    textDecorationLine: "underline",
    color: KavarnaColors.primary,
  },
  form: {
    gap: Spacing.three,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: KavarnaColors.textSecondary,
    fontFamily: Fonts.sans,
  },
  input: {
    height: 46,
    backgroundColor: KavarnaColors.inputBackground,
    borderWidth: 1,
    borderColor: KavarnaColors.inputBorder,
    borderRadius: 6,
    paddingHorizontal: 14,
    fontSize: 15,
    color: KavarnaColors.text,
    fontFamily: Fonts.sans,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    backgroundColor: KavarnaColors.inputBackground,
    borderWidth: 1,
    borderColor: KavarnaColors.inputBorder,
    borderRadius: 6,
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 14,
    fontSize: 15,
    color: KavarnaColors.text,
    fontFamily: Fonts.sans,
  },
  eyeButton: {
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3F2",
    borderWidth: 1,
    borderColor: "#FECDCA",
    borderRadius: 6,
    padding: 12,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: "#B42318",
    fontSize: 13,
    fontFamily: Fonts.sans,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF3",
    borderWidth: 1,
    borderColor: "#ABEFC6",
    borderRadius: 6,
    padding: 12,
    gap: 8,
  },
  infoText: {
    flex: 1,
    color: "#067647",
    fontSize: 13,
    fontFamily: Fonts.sans,
  },
  primaryButton: {
    height: 48,
    backgroundColor: KavarnaColors.primary,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.two,
  },
  disabledButton: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: KavarnaColors.card,
    fontSize: 15,
    fontWeight: "600",
    fontFamily: Fonts.sans,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: KavarnaColors.cardBorder,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: KavarnaColors.textSecondary,
    fontFamily: Fonts.sans,
  },
  socialContainer: {
    gap: 12,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 46,
    backgroundColor: KavarnaColors.card,
    borderWidth: 1,
    borderColor: KavarnaColors.inputBorder,
    borderRadius: 6,
    gap: 10,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: KavarnaColors.primary,
    fontFamily: Fonts.sans,
  },
  footer: {
    marginTop: Spacing.four,
    alignItems: "center",
  },
  footerLink: {
    fontSize: 13,
    fontWeight: "600",
    color: KavarnaColors.primary,
    textDecorationLine: "underline",
    fontFamily: Fonts.sans,
  },
});
