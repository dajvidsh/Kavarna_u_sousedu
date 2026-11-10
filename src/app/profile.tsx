import { Colors } from '@/constants/colors';
import { USER_DATA } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type LanguageOption = 'Čeština' | 'Українська' | 'English';

export default function ProfileScreen() {
  const { user, userProfile, logout, updateName } = useAuth();

  // User contact details (derived directly from auth state)
  const userName = user
    ? userProfile?.name || user.displayName || 'Věrný zákazník'
    : USER_DATA.name;
  const userEmail = user ? user.email || '' : USER_DATA.email;

  // Settings & preference states
  const [language, setLanguage] = useState<LanguageOption>('Čeština');
  const [pointsNotify, setPointsNotify] = useState(true);
  const [promosNotify, setPromosNotify] = useState(false);

  // Modal visibility states
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [notificationsModalVisible, setNotificationsModalVisible] = useState(false);
  const [infoModalContent, setInfoModalContent] = useState<{ title: string; text: string } | null>(null);

  // Form edit temporary inputs
  const [tempName, setTempName] = useState(userName);
  const [tempEmail, setTempEmail] = useState(userEmail);

  const handleSaveProfile = async () => {
    if (!tempName.trim()) {
      Alert.alert('Chyba', 'Jméno nesmí být prázdné.');
      return;
    }
    if (user) {
      await updateName(tempName.trim());
    }
    setEditProfileVisible(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Odhlášení',
      'Opravdu se chcete odhlásit z aplikace?',
      [
        { text: 'Zrušit', style: 'cancel' },
        {
          text: 'Odhlásit se',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              Alert.alert('Odhlášeno', 'Byli jste úspěšně odhlášeni.');
              router.back();
            } catch (err: any) {
              Alert.alert('Chyba', err?.message || 'Chyba při odhlašování.');
            }
          },
        },
      ]
    );
  };

  const notificationSubtitle = `Body ${pointsNotify ? 'zapnuté' : 'vypnuté'} · akce ${promosNotify ? 'zapnuté' : 'vypnuté'}`;
  const languageSubtitle = `${language} · možnosti Українська / English`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable accessibilityLabel="Zpět" onPress={() => router.back()} style={styles.back}>
            <Feather name="arrow-left" size={22} color={Colors.primaryDark} />
          </Pressable>
          <Text style={styles.title}>Profil</Text>
          <View style={styles.spacer} />
        </View>

        {/* User Card */}
        {user ? (
          <View style={styles.userCard}>
            <View style={styles.avatar}>
              <Feather name="user" size={27} color="#FFF" />
            </View>
            <View style={styles.userCopy}>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.email}>{userEmail}</Text>
              <Pressable
                onPress={() => {
                  setTempName(userName);
                  setTempEmail(userEmail);
                  setEditProfileVisible(true);
                }}
              >
                <Text style={styles.link}>Upravit kontaktní údaje →</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={[styles.userCard, { flexDirection: 'column', alignItems: 'stretch', gap: 12 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.avatar, { backgroundColor: Colors.textMuted }]}>
                <Feather name="user-x" size={27} color="#FFF" />
              </View>
              <View style={styles.userCopy}>
                <Text style={styles.userName}>Host (Nepřihlášen)</Text>
                <Text style={styles.email}>Přihlaste se ke svému účtu kavárny</Text>
              </View>
            </View>
            <Pressable
              style={[styles.logout, { marginTop: 4, backgroundColor: Colors.primaryDark }]}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.logoutText}>Přihlásit se / Registrace</Text>
            </Pressable>
          </View>
        )}

        {/* Preferences Section */}
        <View style={styles.settingsCard}>
          <SettingRow
            icon="globe"
            title="Jazyk aplikace"
            subtitle={languageSubtitle}
            onPress={() => setLanguageModalVisible(true)}
          />
          <SettingRow
            icon="bell"
            title="Oznámení"
            subtitle={notificationSubtitle}
            onPress={() => setNotificationsModalVisible(true)}
          />
          <SettingRow
            icon="message-square"
            title="Recenze a zpětná vazba"
            onPress={() =>
              Alert.alert(
                'Zpětná vazba',
                'Děkujeme za váš zájem! Zpětnou vazbu můžete poslat na info@kavarnausousedu.cz',
                [{ text: 'Rozumím' }]
              )
            }
            isLast
          />
        </View>

        {/* Info & Legal Section */}
        <View style={styles.settingsCard}>
          <SettingRow
            icon="book-open"
            title="O nás"
            onPress={() =>
              setInfoModalContent({
                title: 'O nás',
                text: 'Jsme síť útulných sousedských kaváren v Brně a Praze. Naším cílem je přinášet vám poctivou výběrovou kávu, čerstvé dezerty a příjemnou sousedskou atmosféru.',
              })
            }
          />
          <SettingRow
            icon="shield"
            title="Soukromí a podmínky"
            onPress={() =>
              setInfoModalContent({
                title: 'Soukromí a podmínky',
                text: 'Vaše osobní údaje uchováváme v bezpečí podle platných předpisů GDPR. Údaje využíváme výhradně pro potřeby zákaznického věrnostního programu a zlepšování služeb.',
              })
            }
            isLast
          />
        </View>

        {/* Logout Button */}
        {user ? (
          <Pressable style={styles.logout} onPress={handleLogout}>
            <Text style={styles.logoutText}>Odhlásit se</Text>
          </Pressable>
        ) : null}

        <Text style={styles.version}>Version 1.0</Text>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editProfileVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Upravit kontaktní údaje</Text>

            <Text style={styles.inputLabel}>Jméno a příjmení</Text>
            <TextInput
              style={styles.input}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Jméno"
            />

            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={tempEmail}
              onChangeText={setTempEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="E-mail"
            />

            <View style={styles.modalActions}>
              <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={() => setEditProfileVisible(false)}>
                <Text style={styles.cancelButtonText}>Zrušit</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.saveButton]} onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>Uložit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Language Selection Modal */}
      <Modal visible={languageModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Jazyk aplikace</Text>
            {(['Čeština', 'Українська', 'English'] as LanguageOption[]).map((lang) => (
              <Pressable
                key={lang}
                style={[styles.langOption, language === lang && styles.langOptionSelected]}
                onPress={() => {
                  setLanguage(lang);
                  setLanguageModalVisible(false);
                }}
              >
                <Text style={[styles.langOptionText, language === lang && styles.langOptionTextSelected]}>
                  {lang}
                </Text>
                {language === lang && <Feather name="check" size={18} color={Colors.accentBrown} />}
              </Pressable>
            ))}
            <Pressable style={styles.closeButton} onPress={() => setLanguageModalVisible(false)}>
              <Text style={styles.closeButtonText}>Zavřít</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Notifications Toggle Modal */}
      <Modal visible={notificationsModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nastavení oznámení</Text>

            <View style={styles.toggleRow}>
              <View style={styles.toggleCopy}>
                <Text style={styles.toggleTitle}>Upozornění na body</Text>
                <Text style={styles.toggleDesc}>Získat notifikaci při přičtení bodů</Text>
              </View>
              <Switch
                value={pointsNotify}
                onValueChange={setPointsNotify}
                trackColor={{ false: '#DDD', true: Colors.primaryDark }}
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleCopy}>
                <Text style={styles.toggleTitle}>Akce a nabídky</Text>
                <Text style={styles.toggleDesc}>Dostávat novinky o speciálních akcích</Text>
              </View>
              <Switch
                value={promosNotify}
                onValueChange={setPromosNotify}
                trackColor={{ false: '#DDD', true: Colors.primaryDark }}
              />
            </View>

            <Pressable style={styles.closeButton} onPress={() => setNotificationsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Hotovo</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Info & Legal Modal */}
      <Modal visible={!!infoModalContent} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{infoModalContent?.title}</Text>
            <Text style={styles.infoText}>{infoModalContent?.text}</Text>
            <Pressable style={styles.closeButton} onPress={() => setInfoModalContent(null)}>
              <Text style={styles.closeButtonText}>Zavřít</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function SettingRow({
  icon,
  title,
  subtitle,
  onPress,
  isLast = false,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  isLast?: boolean;
}) {
  return (
    <Pressable style={[styles.settingRow, isLast && styles.noBorder]} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Feather name={icon} size={20} color={Colors.textPrimary} />
      </View>
      <View style={styles.settingCopy}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle ? <Text style={styles.settingSubtitle}>{subtitle}</Text> : null}
      </View>
      <Feather name="chevron-right" size={20} color={Colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: Colors.background, flex: 1 },
  content: { padding: 20, paddingBottom: 30 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22 },
  back: { alignItems: 'center', backgroundColor: Colors.secondaryBg, borderRadius: 22, height: 44, justifyContent: 'center', width: 44 },
  title: { color: Colors.textPrimary, fontFamily: 'serif', fontSize: 25, fontWeight: '700' },
  spacer: { width: 44 },
  userCard: { alignItems: 'center', backgroundColor: Colors.cardBg, borderColor: Colors.border, borderRadius: 18, borderWidth: 1, flexDirection: 'row', marginBottom: 14, padding: 17 },
  avatar: { alignItems: 'center', backgroundColor: Colors.primaryDark, borderRadius: 34, height: 64, justifyContent: 'center', width: 64 },
  userCopy: { flex: 1, paddingLeft: 14 },
  userName: { color: Colors.textPrimary, fontSize: 18, fontWeight: '800' },
  email: { color: Colors.textMuted, fontSize: 12, marginTop: 4 },
  link: { color: Colors.accentBrown, fontSize: 12, fontWeight: '700', marginTop: 11 },
  settingsCard: { backgroundColor: Colors.cardBg, borderColor: Colors.border, borderRadius: 18, borderWidth: 1, marginBottom: 14, overflow: 'hidden', paddingHorizontal: 16 },
  settingRow: { alignItems: 'center', borderBottomColor: Colors.border, borderBottomWidth: 1, flexDirection: 'row', minHeight: 65 },
  noBorder: { borderBottomWidth: 0 },
  iconContainer: { width: 32, alignItems: 'center', marginRight: 10 },
  settingCopy: { flex: 1 },
  settingTitle: { color: Colors.textPrimary, fontSize: 14, fontWeight: '700' },
  settingSubtitle: { color: Colors.textMuted, fontSize: 11, marginTop: 5 },
  logout: { alignItems: 'center', backgroundColor: Colors.primaryDark, borderRadius: 999, marginTop: 3, paddingVertical: 14 },
  logoutText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  version: { color: Colors.textMuted, fontSize: 11, marginTop: 25, textAlign: 'center' },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: Colors.cardBg, borderRadius: 20, padding: 22, borderColor: Colors.border, borderWidth: 1 },
  modalTitle: { color: Colors.textPrimary, fontSize: 18, fontWeight: '800', marginBottom: 16, fontFamily: 'serif' },
  inputLabel: { color: Colors.textPrimary, fontSize: 12, fontWeight: '700', marginTop: 10, marginBottom: 6 },
  input: { backgroundColor: Colors.secondaryBg, borderRadius: 10, padding: 12, fontSize: 14, color: Colors.textPrimary, borderColor: Colors.border, borderWidth: 1 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20, gap: 10 },
  modalButton: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
  cancelButton: { backgroundColor: Colors.secondaryBg },
  cancelButtonText: { color: Colors.textPrimary, fontWeight: '700', fontSize: 13 },
  saveButton: { backgroundColor: Colors.primaryDark },
  saveButtonText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  langOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  langOptionSelected: { backgroundColor: Colors.secondaryBg, borderRadius: 8, paddingHorizontal: 10 },
  langOptionText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  langOptionTextSelected: { color: Colors.accentBrown, fontWeight: '800' },
  closeButton: { marginTop: 16, alignItems: 'center', paddingVertical: 12, backgroundColor: Colors.primaryDark, borderRadius: 12 },
  closeButtonText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  toggleCopy: { flex: 1, paddingRight: 10 },
  toggleTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  toggleDesc: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  infoText: { fontSize: 13, color: Colors.textPrimary, lineHeight: 20 },
});
