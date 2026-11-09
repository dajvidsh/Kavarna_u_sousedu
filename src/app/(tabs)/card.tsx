import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Colors } from '@/constants/colors';
import { USER_DATA } from '@/data/mockData';

const qrPattern = Array.from({ length: 81 }, (_, index) => index % 7 !== 1 && (index * 3) % 5 !== 2);

export default function CardScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Moje karta" rightIcon="maximize" />
        <View style={styles.qrCard}><View style={styles.qr}><View style={styles.finderTop} /><View style={styles.finderBottom} /><View style={styles.finderRight} />{qrPattern.map((filled, index) => <View key={index} style={[styles.qrCell, filled && styles.qrCellFilled]} />)}</View><Text style={styles.userName}>{USER_DATA.name}</Text><Text style={styles.cardNumber}>{USER_DATA.cardNumber}</Text></View>
        <View style={styles.activity}><View style={styles.activityIcon}><MaterialCommunityIcons name="coffee-outline" size={24} color={Colors.primaryDark} /></View><View style={styles.activityCopy}><Text style={styles.activityTitle}>Poslední nákup</Text><Text style={styles.activitySub}>{USER_DATA.lastPurchase.date} · {USER_DATA.lastPurchase.location} · {USER_DATA.lastPurchase.summary}</Text></View><Text style={styles.points}>+ {USER_DATA.lastPurchase.pointsEarned} body</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: Colors.background, flex: 1 },
  content: { padding: 20 },
  qrCard: { alignItems: 'center', backgroundColor: Colors.cardBg, borderColor: Colors.border, borderRadius: 20, borderWidth: 1, padding: 25 },
  qr: { backgroundColor: '#FFF', borderColor: Colors.primaryDark, borderRadius: 6, borderWidth: 4, flexDirection: 'row', flexWrap: 'wrap', height: 190, overflow: 'hidden', padding: 12, position: 'relative', width: 190 },
  qrCell: { height: '11.11%', width: '11.11%' },
  qrCellFilled: { backgroundColor: Colors.primaryDark },
  finderTop: { borderColor: Colors.primaryDark, borderWidth: 6, height: 39, left: 9, position: 'absolute', top: 9, width: 39, zIndex: 2 },
  finderBottom: { borderColor: Colors.primaryDark, borderWidth: 6, bottom: 9, height: 39, left: 9, position: 'absolute', width: 39, zIndex: 2 },
  finderRight: { borderColor: Colors.primaryDark, borderWidth: 6, height: 39, position: 'absolute', right: 9, top: 9, width: 39, zIndex: 2 },
  userName: { color: Colors.textPrimary, fontSize: 18, fontWeight: '800', marginTop: 18 },
  cardNumber: { color: Colors.textMuted, fontSize: 13, marginTop: 4 },
  activity: { alignItems: 'center', backgroundColor: Colors.cardBg, borderColor: Colors.border, borderRadius: 17, borderWidth: 1, flexDirection: 'row', marginTop: 16, padding: 14 },
  activityIcon: { alignItems: 'center', backgroundColor: Colors.secondaryBg, borderRadius: 24, height: 46, justifyContent: 'center', width: 46 },
  activityCopy: { flex: 1, paddingLeft: 11 },
  activityTitle: { color: Colors.textPrimary, fontSize: 15, fontWeight: '800' },
  activitySub: { color: Colors.textMuted, fontSize: 11, marginTop: 4 },
  points: { color: Colors.accentBrown, fontSize: 12, fontWeight: '800' },
});
