import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function ProductDetailScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-kavarna-bg px-6"
      style={{ paddingTop: insets.top + 16 }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        className="w-10 h-10 rounded-full bg-white border border-kavarna-border items-center justify-center mb-6"
        activeOpacity={0.7}
      >
        <Text className="text-xl font-bold text-kavarna-dark">‹</Text>
      </TouchableOpacity>

      <Text className="text-3xl font-bold text-kavarna-dark">
        Detail produktu ☕
      </Text>
      <Text className="text-sm text-kavarna-muted mt-1">
        Informace o vybrané položce
      </Text>
    </View>
  );
}
