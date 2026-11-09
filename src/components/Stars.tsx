import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/colors';

export function Stars({ rating }: { rating: number }) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => <Feather key={star} name="star" size={13} color={Colors.starYellow} fill={star <= rating ? Colors.starYellow : 'transparent'} />)}
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', gap: 2 } });
