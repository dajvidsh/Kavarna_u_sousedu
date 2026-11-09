import { ScreenHeader } from '@/components/ScreenHeader';
import { Colors } from '@/constants/colors';
import { CAFES } from '@/data/mockData';
import { Feather } from '@expo/vector-icons';
import { Alert, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CafesScreen() {
  const openInMaps = async (name: string, address: string) => {
    const query = `${name}, ${address}`;
    const encodedQuery = encodeURIComponent(query);

    // Platform-native map scheme with web fallback
    const nativeUrl = Platform.select({
      ios: `maps:0,0?q=${encodedQuery}`,
      android: `geo:0,0?q=${encodedQuery}`,
    });

    const webUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;

    try {
      if (nativeUrl && (await Linking.canOpenURL(nativeUrl))) {
        await Linking.openURL(nativeUrl);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch {
      Alert.alert('Chyba', 'Nedařilo se otevřít aplikaci Mapy.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Naše kavárny" />
        {CAFES.map((cafe) => (
          <Pressable
            key={cafe.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => openInMaps(cafe.name, cafe.address)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{cafe.name}</Text>
              <Feather name="chevron-right" size={20} color={Colors.textMuted} />
            </View>
            <Text style={styles.description}>{cafe.description}</Text>
            <View style={styles.address}>
              <Feather name="map-pin" size={14} color="#FFF" />
              <Text style={styles.addressText}>{cafe.address}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: Colors.background, flex: 1 },
  content: { padding: 20, paddingBottom: 30 },
  card: {
    backgroundColor: Colors.cardBg,
    borderColor: Colors.border,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 13,
    padding: 17,
  },
  cardPressed: {
    opacity: 0.85,
    backgroundColor: Colors.secondaryBg,
  },
  cardHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 9 },
  name: { color: Colors.textPrimary, fontFamily: 'serif', fontSize: 21, fontWeight: '700' },
  description: { color: Colors.textMuted, fontSize: 13, lineHeight: 19, marginBottom: 14 },
  address: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryDark,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addressText: { color: '#FFF', fontSize: 11, fontWeight: '600' },
});
