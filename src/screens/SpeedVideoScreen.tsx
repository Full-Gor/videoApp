import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Header, VideoPlayer, Button, Slider } from '../components';
import { SPEED_OPTIONS } from '../constants/tools';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/theme';
import { RootStackParamList } from '../types';

type SpeedVideoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SpeedVideo'>;
type SpeedVideoScreenRouteProp = RouteProp<RootStackParamList, 'SpeedVideo'>;

interface SpeedVideoScreenProps {
  navigation: SpeedVideoScreenNavigationProp;
  route: SpeedVideoScreenRouteProp;
}

export const SpeedVideoScreen: React.FC<SpeedVideoScreenProps> = ({
  navigation,
  route,
}) => {
  const { video } = route.params;
  const [speed, setSpeed] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const newDuration = video.duration / speed;

  const handleApplySpeed = async () => {
    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Succès',
        `Vitesse modifiée à ${speed}x!`,
        [
          {
            text: 'Exporter',
            onPress: () => navigation.navigate('Export', { video, outputUri: video.uri }),
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ],
      );
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Vitesse"
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <View style={styles.previewContainer}>
          <VideoPlayer uri={video.uri} style={styles.videoPlayer} />
        </View>

        {/* Speed Presets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préréglages de vitesse</Text>
          <View style={styles.presetsGrid}>
            {SPEED_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.presetButton,
                  speed === option.value && styles.selectedPreset,
                ]}
                onPress={() => setSpeed(option.value)}
              >
                <Text
                  style={[
                    styles.presetText,
                    speed === option.value && styles.selectedPresetText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Speed Slider */}
        <View style={styles.section}>
          <Slider
            label="Vitesse personnalisée"
            value={speed}
            min={0.25}
            max={3}
            step={0.05}
            onValueChange={setSpeed}
            formatValue={(v) => `${v.toFixed(2)}x`}
          />
        </View>

        {/* Duration Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons
              name="timer"
              size={24}
              color={COLORS.textSecondary}
            />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Durée originale</Text>
              <Text style={styles.infoValue}>{formatTime(video.duration)}</Text>
            </View>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <MaterialCommunityIcons
              name="timer-outline"
              size={24}
              color={COLORS.primary}
            />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Nouvelle durée</Text>
              <Text style={[styles.infoValue, styles.highlight]}>
                {formatTime(newDuration)}
              </Text>
            </View>
          </View>
        </View>

        {/* Speed Info */}
        <View style={styles.speedInfoCard}>
          <View style={styles.speedInfoRow}>
            <MaterialCommunityIcons
              name={speed < 1 ? 'turtle' : speed > 1 ? 'rabbit' : 'play'}
              size={32}
              color={speed < 1 ? COLORS.secondary : speed > 1 ? COLORS.warning : COLORS.primary}
            />
            <Text style={styles.speedInfoText}>
              {speed < 1
                ? 'Ralenti - Crée un effet dramatique'
                : speed > 1
                ? 'Accéléré - Idéal pour les timelapses'
                : 'Vitesse normale'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.processingText}>Modification de la vitesse...</Text>
          </View>
        ) : (
          <Button
            title={`Appliquer ${speed}x`}
            onPress={handleApplySpeed}
            fullWidth
            size="lg"
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  previewContainer: {
    marginBottom: SPACING.xl,
  },
  videoPlayer: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  presetButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPreset: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  presetText: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  selectedPresetText: {
    color: COLORS.primary,
  },
  infoSection: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoTextContainer: {
    marginLeft: SPACING.md,
  },
  infoLabel: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
  },
  infoValue: {
    color: COLORS.text,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  highlight: {
    color: COLORS.primary,
  },
  infoDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.lg,
  },
  speedInfoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  speedInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  speedInfoText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
    marginLeft: SPACING.md,
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.backgroundLight,
  },
  processingContainer: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  processingText: {
    color: COLORS.text,
    marginTop: SPACING.md,
  },
});
