import { Stars } from '@/components/Stars';
import { Colors } from '@/constants/colors';
import { MENU_ITEMS } from '@/data/mockData';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = MENU_ITEMS.find((item) => String(item.id) === String(id)) || MENU_ITEMS[0];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable accessibilityLabel="Zpět" onPress={() => router.back()} style={styles.headerButton}>
          <Feather name="arrow-left" size={22} color={Colors.primaryDark} />
        </Pressable>
        <Text style={styles.headerTitle}>Detail produktu</Text>
        <Pressable
          accessibilityLabel="Zpětná vazba"
          onPress={() =>
            Alert.alert(
              'Hodnocení produktu',
              `Chcete zanechat recenzi k nápoji ${product.name}?`,
              [{ text: 'Zrušit', style: 'cancel' }, { text: 'Napsat recenzi' }]
            )
          }
          style={styles.headerButton}
        >
          <Feather name="message-square" size={20} color={Colors.primaryDark} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Image with Badge */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Aktuálně nejprodávanější</Text>
          </View>
        </View>

        {/* Title & Description */}
        <View style={styles.detailsSection}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.underline} />
          <Text style={styles.description}>
            {product.description} Připravuje se pomalým vlitím čerstvého espressa do sklenice s teplým napěněným mlékem, kde káva díky své nižší hustotě zůstane uprostřed.
          </Text>
        </View>

        {/* Price & Rating Box */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Feather name="shopping-cart" size={18} color={Colors.accentBrown} />
              <Text style={styles.infoText}>Cena</Text>
            </View>
            <Text style={styles.priceValue}>{product.price} Kč</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Feather name="smile" size={18} color={Colors.accentBrown} />
              <Text style={styles.infoText}>Hodnocení</Text>
            </View>
            <Stars rating={product.rating} />
          </View>
        </View>

        {/* Action Button to Cafes */}
        <Pressable
          style={({ pressed }) => [styles.findCafeButton, pressed && styles.findCafeButtonPressed]}
          onPress={() => router.push('/(tabs)/cafes' as any)}
        >
          <Text style={styles.findCafeButtonText}>Kde najít naše prodejny?</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: Colors.background, flex: 1 },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerButton: {
    alignItems: 'center',
    backgroundColor: Colors.secondaryBg,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
  },
  content: { padding: 20, paddingBottom: 40 },
  imageContainer: {
    borderRadius: 20,
    height: 240,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  image: { height: '100%', width: '100%' },
  badge: {
    backgroundColor: 'rgba(247, 243, 237, 0.92)',
    borderRadius: 999,
    bottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    position: 'absolute',
    right: 14,
  },
  badgeText: { color: Colors.accentBrown, fontSize: 11, fontWeight: '700' },
  detailsSection: { alignItems: 'center', marginBottom: 22, paddingHorizontal: 10 },
  productName: {
    color: Colors.accentBrown,
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  underline: {
    backgroundColor: Colors.accentBrown,
    borderRadius: 2,
    height: 2,
    marginBottom: 14,
    marginTop: 6,
    width: 50,
  },
  description: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: Colors.cardBg,
    borderColor: Colors.border,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  infoText: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700' },
  priceValue: { color: Colors.accentBrown, fontSize: 16, fontWeight: '800' },
  divider: { backgroundColor: Colors.border, height: 1, marginVertical: 4 },
  findCafeButton: {
    alignItems: 'center',
    backgroundColor: Colors.accentBrown,
    borderRadius: 14,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  findCafeButtonPressed: { opacity: 0.9 },
  findCafeButtonText: { color: '#FFF', fontFamily: 'serif', fontSize: 16, fontWeight: '700' },
});
