import { ScreenHeader } from '@/components/ScreenHeader';
import { Stars } from '@/components/Stars';
import { Colors } from '@/constants/colors';
import { MENU_ITEMS, MenuCategory } from '@/data/mockData';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const categories: MenuCategory[] = ['Kafe', 'Dezerty', 'Snídaně', 'Akce'];

export default function MenuScreen() {
  const [category, setCategory] = useState<MenuCategory>('Kafe');
  const items = MENU_ITEMS.filter((item) => item.category === category);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Naše nabídka" />
        <ScrollView horizontal contentContainerStyle={styles.categories} showsHorizontalScrollIndicator={false}>
          {categories.map((item) => (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              style={[styles.category, item === category && styles.categoryActive]}
            >
              <Text style={[styles.categoryText, item === category && styles.categoryTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </ScrollView>
        {items.length > 0 ? (
          items.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => router.push(`/product/${item.id}` as any)}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.copy}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.description} numberOfLines={2}>
                  {item.description}
                </Text>
                <Stars rating={item.rating} />
              </View>
              <View style={styles.trailing}>
                <Text style={styles.price}>{item.price} Kč</Text>
                <Feather name="chevron-right" size={19} color={Colors.textMuted} />
              </View>
            </Pressable>
          ))
        ) : (
          <Text style={styles.empty}>Tuto nabídku právě připravujeme.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: Colors.background, flex: 1 },
  content: { padding: 20, paddingBottom: 30 },
  categories: { gap: 8, paddingBottom: 17 },
  category: { backgroundColor: Colors.secondaryBg, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 10 },
  categoryActive: { backgroundColor: Colors.primaryDark },
  categoryText: { color: Colors.textMuted, fontSize: 13, fontWeight: '700' },
  categoryTextActive: { color: '#FFF' },
  card: {
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderColor: Colors.border,
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 11,
    padding: 10,
  },
  cardPressed: { opacity: 0.85, backgroundColor: Colors.secondaryBg },
  image: { borderRadius: 12, height: 82, width: 82 },
  copy: { flex: 1, paddingLeft: 12 },
  name: { color: Colors.textPrimary, fontSize: 16, fontWeight: '800', marginBottom: 4 },
  description: { color: Colors.textMuted, fontSize: 12, lineHeight: 17, marginBottom: 9 },
  trailing: { alignItems: 'flex-end', alignSelf: 'stretch', justifyContent: 'space-between' },
  price: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 999,
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  empty: { color: Colors.textMuted, paddingVertical: 30, textAlign: 'center' },
});
