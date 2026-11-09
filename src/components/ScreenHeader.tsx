import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';

interface ScreenHeaderProps {
  title: string;
  rightIcon?: keyof typeof Feather.glyphMap;
}

export function ScreenHeader({ title, rightIcon = 'user' }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <MaterialCommunityIcons name="coffee-outline" size={25} color={Colors.primaryDark} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Pressable accessibilityLabel="Otevřít profil" onPress={() => router.push('/profile' as Href)} style={styles.iconButton}>
        <Feather name={rightIcon} size={20} color={Colors.primaryDark} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22 },
  titleRow: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  title: { color: Colors.textPrimary, fontFamily: 'serif', fontSize: 25, fontWeight: '700' },
  iconButton: { alignItems: 'center', backgroundColor: Colors.secondaryBg, borderRadius: 22, height: 44, justifyContent: 'center', width: 44 },
});
