import { Colors } from '@/constants/colors';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScanMode = 'qr' | 'id';

export default function ScannerScreen() {
  const [mode, setMode] = useState<ScanMode>('qr');
  const [selectedPoints, setSelectedPoints] = useState<number>(1);
  const [customInput, setCustomInput] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [manualId, setManualId] = useState('');

  const handleScan = () => {
    const points = showCustomInput ? parseInt(customInput, 10) || 0 : selectedPoints;
    const target = mode === 'qr' ? 'Naskenovaný QR kód' : `Zákaznické ID (${manualId || '00132034/28'})`;

    Alert.alert(
      'Úspěšně přičteno!',
      `${target}\nBude přičteno: ${points} ${points === 1 ? 'bod' : points >= 2 && points <= 4 ? 'body' : 'bodů'}.`,
      [
        {
          text: 'OK',
          onPress: () => {
            if (router.canGoBack()) router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Zpět"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Feather name="arrow-left" size={22} color={Colors.primaryDark} />
        </Pressable>
        <Text style={styles.headerTitle}>Čtečka</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Mode Segmented Control */}
        <View style={styles.segmentedContainer}>
          <Pressable
            style={[styles.segment, mode === 'qr' && styles.segmentActive]}
            onPress={() => setMode('qr')}
          >
            <Text style={[styles.segmentText, mode === 'qr' && styles.segmentTextActive]}>QR kód</Text>
          </Pressable>
          <Pressable
            style={[styles.segment, mode === 'id' && styles.segmentActive]}
            onPress={() => setMode('id')}
          >
            <Text style={[styles.segmentText, mode === 'id' && styles.segmentTextActive]}>ID číslo</Text>
          </Pressable>
        </View>

        {/* Viewfinder or Manual ID Input View */}
        {mode === 'qr' ? (
          <View style={styles.cameraBox}>
            <View style={styles.viewfinderFrame}>
              <Feather name="maximize" size={48} color={Colors.accentBrown} />
            </View>
          </View>
        ) : (
          <View style={styles.idInputBox}>
            <Text style={styles.idInputLabel}>Zadejte ID číslo zákazníka</Text>
            <TextInput
              style={styles.idTextInput}
              placeholder="např. 00132034/28"
              value={manualId}
              onChangeText={setManualId}
              keyboardType="numeric"
            />
          </View>
        )}

        {/* Points Selection */}
        <View style={styles.pointsSection}>
          <Text style={styles.pointsTitle}>Přičtení bodů zákazníkovi</Text>

          <View style={styles.pointsButtonsRow}>
            <Pressable
              style={[
                styles.pointOption,
                selectedPoints === 1 && !showCustomInput && styles.pointOptionSelected,
              ]}
              onPress={() => {
                setSelectedPoints(1);
                setShowCustomInput(false);
              }}
            >
              <Text
                style={[
                  styles.pointOptionText,
                  selectedPoints === 1 && !showCustomInput && styles.pointOptionTextSelected,
                ]}
              >
                + 1
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.pointOption,
                selectedPoints === 2 && !showCustomInput && styles.pointOptionSelected,
              ]}
              onPress={() => {
                setSelectedPoints(2);
                setShowCustomInput(false);
              }}
            >
              <Text
                style={[
                  styles.pointOptionText,
                  selectedPoints === 2 && !showCustomInput && styles.pointOptionTextSelected,
                ]}
              >
                + 2
              </Text>
            </Pressable>

            <Pressable
              style={[styles.pointOption, showCustomInput && styles.pointOptionSelected]}
              onPress={() => setShowCustomInput(true)}
            >
              <Text style={[styles.pointOptionText, showCustomInput && styles.pointOptionTextSelected]}>
                Více
              </Text>
            </Pressable>
          </View>

          {showCustomInput && (
            <TextInput
              style={styles.customInput}
              placeholder="Zadejte počet bodů..."
              keyboardType="number-pad"
              value={customInput}
              onChangeText={setCustomInput}
            />
          )}
        </View>

        {/* Scan / Submit Button */}
        <Pressable
          style={({ pressed }) => [styles.scanButton, pressed && styles.pressed]}
          onPress={handleScan}
        >
          <Text style={styles.scanButtonText}>Sken</Text>
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
  backButton: {
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
  spacer: { width: 44 },
  content: { padding: 20, paddingBottom: 40 },
  segmentedContainer: {
    backgroundColor: Colors.accentBrown,
    borderRadius: 14,
    flexDirection: 'row',
    marginBottom: 24,
    padding: 4,
  },
  segment: {
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    paddingVertical: 10,
  },
  segmentActive: {
    backgroundColor: Colors.cardBg,
  },
  segmentText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  segmentTextActive: {
    color: Colors.accentBrown,
  },
  cameraBox: {
    alignItems: 'center',
    backgroundColor: '#EBE5DF',
    borderRadius: 24,
    height: 260,
    justifyContent: 'center',
    marginBottom: 28,
  },
  viewfinderFrame: {
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderColor: Colors.border,
    borderRadius: 18,
    borderWidth: 2,
    height: 120,
    justifyContent: 'center',
    width: 120,
  },
  idInputBox: {
    backgroundColor: Colors.cardBg,
    borderColor: Colors.border,
    borderRadius: 24,
    borderWidth: 1,
    height: 260,
    justifyContent: 'center',
    marginBottom: 28,
    padding: 24,
  },
  idInputLabel: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  idTextInput: {
    backgroundColor: Colors.secondaryBg,
    borderColor: Colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: Colors.textPrimary,
    fontSize: 16,
    padding: 14,
    textAlign: 'center',
  },
  pointsSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  pointsTitle: {
    color: Colors.accentBrown,
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  pointsButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  pointOption: {
    backgroundColor: Colors.cardBg,
    borderColor: Colors.border,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 80,
    paddingVertical: 12,
  },
  pointOptionSelected: {
    backgroundColor: Colors.secondaryBg,
    borderColor: Colors.accentBrown,
    borderWidth: 2,
  },
  pointOptionText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  pointOptionTextSelected: {
    color: Colors.accentBrown,
  },
  customInput: {
    backgroundColor: Colors.cardBg,
    borderColor: Colors.border,
    borderRadius: 10,
    borderWidth: 1,
    color: Colors.textPrimary,
    fontSize: 14,
    marginTop: 14,
    padding: 10,
    textAlign: 'center',
    width: '60%',
  },
  scanButton: {
    alignItems: 'center',
    backgroundColor: Colors.accentBrown,
    borderRadius: 14,
    paddingVertical: 16,
  },
  scanButtonText: {
    color: '#FFF',
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});
