import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabInset } from '@/constants/theme';

interface MenuItem {
  id: string;
  name: string;
  category: 'Káva' | 'Dezerty' | 'Čaj';
  price: number;
  description: string;
  icon: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Espresso',
    category: 'Káva',
    price: 49,
    description: 'Silná a intenzivní chuť výběrové kávy',
    icon: '☕',
  },
  {
    id: '2',
    name: 'Cappuccino',
    category: 'Káva',
    price: 69,
    description: 'Espresso s jemně našlehaným mlékem',
    icon: '☕',
  },
  {
    id: '3',
    name: 'Flat White',
    category: 'Káva',
    price: 79,
    description: 'Dvojité espresso s mikropěnou',
    icon: '☕',
  },
  {
    id: '4',
    name: 'Máslový Croissant',
    category: 'Dezerty',
    price: 55,
    description: 'Čerstvě upečený francouzský croissant',
    icon: '🥐',
  },
  {
    id: '5',
    name: 'Čokoládový muffin',
    category: 'Dezerty',
    price: 59,
    description: 'Plněný kousky belgické čokolády',
    icon: '🧁',
  },
  {
    id: '6',
    name: 'Zelený čaj Sencha',
    category: 'Čaj',
    price: 55,
    description: 'Japonský sypaný zelený čaj',
    icon: '🍵',
  },
];

const CATEGORIES = ['Vše', 'Káva', 'Dezerty', 'Čaj'] as const;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState<string>('Vše');
  const [cart, setCart] = useState<{ [id: string]: number }>({});

  const filteredItems =
    activeCategory === 'Vše'
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === activeCategory);

  const addToCart = (id: string) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const totalCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, count]) => {
    const item = MENU_ITEMS.find((i) => i.id === id);
    return sum + (item ? item.price * count : 0);
  }, 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Hlavička */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>Vítejte v naší kavárně</Text>
          <Text style={styles.headerTitle}>Kavárna Na Rohu ☕</Text>
        </View>
        {totalCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>🛒 {totalCount}</Text>
          </View>
        )}
      </View>

      {/* Přepínač kategorií */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map((category) => {
            const isSelected = activeCategory === category;
            return (
              <TouchableOpacity
                key={category}
                style={[styles.categoryButton, isSelected && styles.categoryButtonActive]}
                onPress={() => setActiveCategory(category)}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Seznam nabídky */}
      <ScrollView
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + BottomTabInset + 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Denní nabídka ({filteredItems.length})</Text>

        {filteredItems.map((item) => {
          const countInCart = cart[item.id] || 0;
          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.iconContainer}>
                <Text style={styles.itemIcon}>{item.icon}</Text>
              </View>

              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription} numberOfLines={2}>
                  {item.description}
                </Text>
                <Text style={styles.itemPrice}>{item.price} Kč</Text>
              </View>

              <TouchableOpacity
                style={[styles.addButton, countInCart > 0 && styles.addButtonActive]}
                onPress={() => addToCart(item.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.addButtonText}>
                  {countInCart > 0 ? `+${countInCart}` : '+ Přidat'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {/* Informační shrnutí košíku pro demonstraci */}
        {totalCount > 0 && (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Rychlý přehled objednávky</Text>
            <Text style={styles.summaryText}>
              Vybráno položek: {totalCount} ks | Celkem: {totalPrice} Kč
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F6F0', // Jemná krémová barva pozadí
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8C7A6B',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3C2A21',
  },
  cartBadge: {
    backgroundColor: '#6F4E37',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  categoryContainer: {
    paddingVertical: 10,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#EAE0D5',
  },
  categoryButtonActive: {
    backgroundColor: '#6F4E37',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C3D2E',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3C2A21',
    marginBottom: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F5EBE0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemIcon: {
    fontSize: 26,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3C2A21',
  },
  itemDescription: {
    fontSize: 12,
    color: '#7D6E65',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#B85D19',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#6F4E37',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addButtonActive: {
    backgroundColor: '#2E7D32',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  summaryBox: {
    marginTop: 15,
    backgroundColor: '#EAE0D5',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3C2A21',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 13,
    color: '#5C3D2E',
  },
});
