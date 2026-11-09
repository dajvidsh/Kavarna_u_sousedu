import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: Colors.primaryDark, tabBarInactiveTintColor: Colors.textMuted, tabBarStyle: { backgroundColor: Colors.background, borderTopColor: Colors.border, height: 78, paddingBottom: 12, paddingTop: 8 }, tabBarLabelStyle: { fontSize: 11, fontWeight: '600' } }}>
      <Tabs.Screen name="index" options={{ title: 'Domů', tabBarIcon: ({ focused, size }) => <Feather name="home" color={focused ? Colors.primaryDark : Colors.textMuted} size={size} /> }} />
      <Tabs.Screen name="menu" options={{ title: 'Menu', tabBarIcon: ({ focused, size }) => <Feather name="list" color={focused ? Colors.primaryDark : Colors.textMuted} size={size} /> }} />
      <Tabs.Screen name="cafes" options={{ title: 'Kavárny', tabBarIcon: ({ focused, size }) => <MaterialCommunityIcons name="coffee-outline" color={focused ? Colors.primaryDark : Colors.textMuted} size={size + 1} /> }} />
      <Tabs.Screen name="card" options={{ title: 'Karta', tabBarIcon: ({ focused, size }) => <Feather name="credit-card" color={focused ? Colors.primaryDark : Colors.textMuted} size={size} /> }} />
    </Tabs>
  );
}
