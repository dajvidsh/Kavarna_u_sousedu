import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { USER_DATA } from '@/data/mockData';

const settings = [
  ['Jazyk aplikace', 'Čeština · možnosti Українська / English'],
  ['Oznámení', 'Body zapnuté · akce vypnuté'],
  ['Recenze a zpětná vazba', ''],
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}><Pressable accessibilityLabel="Zpět" onPress={() => router.back()} style={styles.back}><Feather name="arrow-left" size={22} color={Colors.primaryDark} /></Pressable><Text style={styles.title}>Profil</Text><View style={styles.spacer} /></View>
        <View style={styles.userCard}><View style={styles.avatar}><Feather name="user" size={27} color="#FFF" /></View><View style={styles.userCopy}><Text style={styles.userName}>{USER_DATA.name}</Text><Text style={styles.email}>{USER_DATA.email}</Text><Text style={styles.link}>Upravit kontaktní údaje →</Text></View></View>
        <View style={styles.settingsCard}>{settings.map(([title, subtitle]) => <SettingRow key={title} title={title} subtitle={subtitle} />)}</View>
        <View style={styles.settingsCard}><SettingRow title="O nás" /><SettingRow title="Soukromí a podmínky" /></View>
        <Pressable style={styles.logout}><Text style={styles.logoutText}>Odhlásit se</Text></Pressable>
        <Text style={styles.version}>Version 1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({ title, subtitle }: { title: string; subtitle?: string }) {
  return <Pressable style={styles.settingRow}><View style={styles.settingCopy}><Text style={styles.settingTitle}>{title}</Text>{subtitle ? <Text style={styles.settingSubtitle}>{subtitle}</Text> : null}</View><Feather name="chevron-right" size={20} color={Colors.textMuted} /></Pressable>;
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
  settingCopy: { flex: 1 },
  settingTitle: { color: Colors.textPrimary, fontSize: 14, fontWeight: '700' },
  settingSubtitle: { color: Colors.textMuted, fontSize: 11, marginTop: 5 },
  logout: { alignItems: 'center', backgroundColor: Colors.primaryDark, borderRadius: 999, marginTop: 3, paddingVertical: 14 },
  logoutText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  version: { color: Colors.textMuted, fontSize: 11, marginTop: 25, textAlign: 'center' },
});
