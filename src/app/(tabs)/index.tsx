import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Colors } from '@/constants/colors';
import { MENU_ITEMS, USER_DATA } from '@/data/mockData';

const filters = ['Sezónní nabídka', 'Stálá nabídka', 'Speciální akce'];

export default function HomeScreen() {
  const seasonal = MENU_ITEMS.filter((item) => item.category === 'Dezerty');
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Vítejte u Sousedů" />
        <View style={styles.promo}><Text style={styles.promoTitle}>Akce: Pohádky u kávy</Text><Text style={styles.promoText}>Podzimní čtení pro děti i rodiče. Podrobnosti →</Text></View>
        <Image source={{ uri: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=900' }} style={styles.hero} />
        <View style={styles.loyalty}>
          <View style={styles.loyaltyHeader}><View><Text style={styles.loyaltyTitle}>{USER_DATA.currentPoints} z {USER_DATA.totalPoints} bodů</Text><Text style={styles.loyaltyText}>1 káva v nákupu = 1 bod do vaší karty</Text></View><MaterialCommunityIcons name="coffee-outline" size={31} color={Colors.progressFill} /></View>
          <View style={styles.progress}><View style={[styles.progressFill, { width: `${(USER_DATA.currentPoints / USER_DATA.totalPoints) * 100}%` }]} /></View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {filters.map((filter, index) => <Pressable key={filter} style={[styles.chip, index === 0 && styles.chipActive]}><Text style={[styles.chipText, index === 0 && styles.chipTextActive]}>{filter}</Text></Pressable>)}
        </ScrollView>
        <Text style={styles.sectionTitle}>Naše sezónní nabídka</Text>
        {seasonal.map((item) => <View key={item.id} style={styles.seasonalCard}><Image source={{ uri: item.image }} style={styles.seasonalImage} /><View style={styles.seasonalCopy}><View style={styles.row}><Text style={styles.itemName}>{item.name}</Text><Text style={styles.price}>{item.price} Kč</Text></View><Text style={styles.description}>{item.description}</Text></View></View>)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: Colors.background, flex: 1 },
  content: { padding: 20, paddingBottom: 30 },
  promo: { backgroundColor: Colors.secondaryBg, borderRadius: 16, marginBottom: 16, padding: 17 },
  promoTitle: { color: Colors.textPrimary, fontSize: 16, fontWeight: '800', marginBottom: 5 },
  promoText: { color: Colors.textMuted, fontSize: 13 },
  hero: { borderRadius: 18, height: 170, marginBottom: 16, width: '100%' },
  loyalty: { backgroundColor: Colors.primaryDark, borderRadius: 18, marginBottom: 18, padding: 19 },
  loyaltyHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  loyaltyTitle: { color: '#FFF', fontSize: 24, fontWeight: '800', marginBottom: 5 },
  loyaltyText: { color: Colors.secondaryBg, fontSize: 12 },
  progress: { backgroundColor: Colors.progressBg, borderRadius: 6, height: 8, marginTop: 19, overflow: 'hidden' },
  progressFill: { backgroundColor: Colors.progressFill, borderRadius: 6, height: '100%' },
  chips: { gap: 8, paddingBottom: 23 },
  chip: { borderColor: Colors.border, borderRadius: 999, borderWidth: 1, paddingHorizontal: 15, paddingVertical: 9 },
  chipActive: { backgroundColor: Colors.primaryDark, borderColor: Colors.primaryDark },
  chipText: { color: Colors.textMuted, fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: '#FFF' },
  sectionTitle: { color: Colors.textPrimary, fontFamily: 'serif', fontSize: 21, fontWeight: '700', marginBottom: 12 },
  seasonalCard: { backgroundColor: Colors.cardBg, borderColor: Colors.border, borderRadius: 16, borderWidth: 1, flexDirection: 'row', marginBottom: 11, overflow: 'hidden', padding: 10 },
  seasonalImage: { borderRadius: 11, height: 75, width: 75 },
  seasonalCopy: { flex: 1, justifyContent: 'center', paddingLeft: 12 },
  row: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  itemName: { color: Colors.textPrimary, flex: 1, fontSize: 15, fontWeight: '800' },
  price: { color: Colors.accentBrown, fontSize: 13, fontWeight: '800' },
  description: { color: Colors.textMuted, fontSize: 12, lineHeight: 17, marginTop: 5 },
});
