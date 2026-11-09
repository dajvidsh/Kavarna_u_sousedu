import { Colors } from '@/constants/colors';
import { USER_DATA } from '@/data/mockData';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function generateQRData(seedString: string) {
  const gridSize = 121; // 11x11
  const cells = [];
  let seed = 0;

  for (let i = 0; i < seedString.length; i++) {
    seed = (seed << 5) - seed + seedString.charCodeAt(i);
    seed |= 0;
  }

  for (let i = 0; i < gridSize; i++) {
    const row = Math.floor(i / 11);
    const col = i % 11;

    const isTopLeft = row < 4 && col < 4;
    const isTopRight = row < 4 && col > 6;
    const isBottomLeft = row > 6 && col < 4;

    if (isTopLeft || isTopRight || isBottomLeft) {
      cells.push(false);
      continue;
    }

    const val = Math.abs(Math.sin(seed + i * 13) * 10000);
    cells.push(val % 1 > 0.42);
  }

  return cells;
}

export default function CardScreen() {
  const [seed, setSeed] = useState(USER_DATA.cardNumber);
  const qrPattern = useMemo(() => generateQRData(seed), [seed]);

  const handleRegenerateQR = () => {
    setSeed(`${USER_DATA.cardNumber}-${Math.random().toString(36).substring(2, 8)}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header with Scanner shortcut */}
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Feather name="coffee" size={22} color={Colors.accentBrown} style={styles.headerIcon} />
            <Text style={styles.headerTitle}>Moje karta</Text>
          </View>
          <Pressable
            accessibilityLabel="Čtečka pro zaměstnance"
            onPress={() => router.push('/scanner' as any)}
            style={({ pressed }) => [styles.maximizeButton, pressed && styles.buttonPressed]}
          >
            <Feather name="maximize" size={20} color={Colors.primaryDark} />
          </Pressable>
        </View>

        {/* Dynamic QR Card */}
        <View style={styles.qrCard}>
          <Pressable
            onPress={handleRegenerateQR}
            style={({ pressed }) => [styles.qrContainer, pressed && styles.buttonPressed]}
          >
            <View style={styles.qr}>
              <View style={styles.finderTopLeft} />
              <View style={styles.finderTopRight} />
              <View style={styles.finderBottomLeft} />
              {qrPattern.map((filled, index) => (
                <View key={index} style={[styles.qrCell, filled && styles.qrCellFilled]} />
              ))}
            </View>
          </Pressable>

          <View style={styles.nameBadge}>
            <Text style={styles.userName}>{USER_DATA.name}</Text>
          </View>
          <Text style={styles.cardNumber}>{USER_DATA.cardNumber}</Text>
        </View>

        {/* Last Activity */}
        <View style={styles.activity}>
          <View style={styles.activityIcon}>
            <MaterialCommunityIcons name="coffee-outline" size={24} color={Colors.primaryDark} />
          </View>
          <View style={styles.activityCopy}>
            <Text style={styles.activityTitle}>Poslední nákup</Text>
            <Text style={styles.activitySub}>
              {USER_DATA.lastPurchase.date} · {USER_DATA.lastPurchase.location} · {USER_DATA.lastPurchase.summary}
            </Text>
          </View>
          <Text style={styles.points}>+ {USER_DATA.lastPurchase.pointsEarned} body</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: Colors.background, flex: 1 },
  content: { padding: 20 },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerIcon: { marginRight: 2 },
  headerTitle: { color: Colors.textPrimary, fontFamily: 'serif', fontSize: 24, fontWeight: '700' },
  maximizeButton: {
    alignItems: 'center',
    backgroundColor: Colors.secondaryBg,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  buttonPressed: { opacity: 0.8 },
  qrCard: {
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderColor: Colors.border,
    borderRadius: 20,
    borderWidth: 1,
    padding: 25,
  },
  qrContainer: { padding: 5 },
  qr: {
    backgroundColor: '#FFF',
    borderColor: Colors.primaryDark,
    borderRadius: 8,
    borderWidth: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 210,
    overflow: 'hidden',
    padding: 10,
    position: 'relative',
    width: 210,
  },
  qrCell: { height: '9.09%', width: '9.09%' },
  qrCellFilled: { backgroundColor: Colors.primaryDark },
  finderTopLeft: {
    borderColor: Colors.primaryDark,
    borderWidth: 6,
    height: 46,
    left: 8,
    position: 'absolute',
    top: 8,
    width: 46,
    zIndex: 2,
    backgroundColor: '#FFF',
  },
  finderTopRight: {
    borderColor: Colors.primaryDark,
    borderWidth: 6,
    height: 46,
    position: 'absolute',
    right: 8,
    top: 8,
    width: 46,
    zIndex: 2,
    backgroundColor: '#FFF',
  },
  finderBottomLeft: {
    borderColor: Colors.primaryDark,
    borderWidth: 6,
    bottom: 8,
    height: 46,
    left: 8,
    position: 'absolute',
    width: 46,
    zIndex: 2,
    backgroundColor: '#FFF',
  },
  nameBadge: {
    backgroundColor: Colors.accentBrown,
    borderRadius: 12,
    marginTop: 20,
    paddingHorizontal: 40,
    paddingVertical: 10,
  },
  userName: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  cardNumber: { color: Colors.accentBrown, fontFamily: 'serif', fontSize: 16, fontWeight: '600', marginTop: 10 },
  activity: {
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderColor: Colors.border,
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 16,
    padding: 14,
  },
  activityIcon: {
    alignItems: 'center',
    backgroundColor: Colors.secondaryBg,
    borderRadius: 24,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  activityCopy: { flex: 1, paddingLeft: 11 },
  activityTitle: { color: Colors.textPrimary, fontSize: 15, fontWeight: '800' },
  activitySub: { color: Colors.textMuted, fontSize: 11, marginTop: 4 },
  points: { color: Colors.accentBrown, fontSize: 12, fontWeight: '800' },
});
