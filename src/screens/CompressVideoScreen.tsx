import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Header, VideoPlayer, Button } from '../components';
import { COMPRESSION_PRESETS, VIDEO_QUALITIES } from '../constants/tools';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/theme';
import { RootStackParamList } from '../types';

type CompressVideoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CompressVideo'>;
type CompressVideoScreenRouteProp = RouteProp<RootStackParamList, 'CompressVideo'>;

interface CompressVideoScreenProps {
  navigation: CompressVideoScreenNavigationProp;
  route: CompressVideoScreenRouteProp;
}

export const CompressVideoScreen: React.FC<CompressVideoScreenProps> = ({
  navigation,
  route,
}) => {
  const { video } = route.params;
  const [selectedQuality, setSelectedQuality] = useState(COMPRESSION_PRESETS[1]);
  const [selectedResolution, setSelectedResolution] = useState(VIDEO_QUALITIES[1]);
  const [isProcessing, setIsProcessing] = useState(false);

  const estimatedSize = () => {
    const baseSize = video.size || 50 * 1024 * 1024;
    const qualityMultiplier = {
      low: 0.25,
      medium: 0.5,
      high: 0.75,
      ultra: 0.9,
    };
    return baseSize * (qualityMultiplier[selectedQuality.value as keyof typeof qualityMultiplier] || 0.5);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleCompress = async () => {
    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      Alert.alert(
        'Succès',
        `Vidéo compressée!\nTaille estimée: ${formatFileSize(estimatedSize())}`,
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
      Alert.alert('Erreur', 'Une erreur est survenue lors de la compression.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Compresser"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.previewContainer}>
          <VideoPlayer uri={video.uri} style={styles.videoPlayer} />
        </View>

        {/* Quality Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Qualité de compression</Text>
          <View style={styles.optionGrid}>
            {COMPRESSION_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.value}
                style={[
                  styles.optionCard,
                  selectedQuality.value === preset.value && styles.selectedOption,
                ]}
                onPress={() => setSelectedQuality(preset)}
              >
                <MaterialCommunityIcons
                  name={getQualityIcon(preset.value)}
                  size={32}
                  color={
                    selectedQuality.value === preset.value
                      ? COLORS.primary
                      : COLORS.textMuted
                  }
                />
                <Text
                  style={[
                    styles.optionLabel,
                    selectedQuality.value === preset.value && styles.selectedLabel,
                  ]}
                >
                  {preset.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Resolution Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Résolution</Text>
          <View style={styles.resolutionList}>
            {VIDEO_QUALITIES.map((quality) => (
              <TouchableOpacity
                key={quality.value}
                style={[
                  styles.resolutionOption,
                  selectedResolution.value === quality.value && styles.selectedResolution,
                ]}
                onPress={() => setSelectedResolution(quality)}
              >
                <Text
                  style={[
                    styles.resolutionLabel,
                    selectedResolution.value === quality.value && styles.selectedResolutionLabel,
                  ]}
                >
                  {quality.label}
                </Text>
                {selectedResolution.value === quality.value && (
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color={COLORS.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* File Size Estimation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estimation</Text>
          <View style={styles.estimationCard}>
            <View style={styles.estimationRow}>
              <View style={styles.estimationItem}>
                <Text style={styles.estimationLabel}>Taille actuelle</Text>
                <Text style={styles.estimationValue}>
                  {formatFileSize(video.size || 50 * 1024 * 1024)}
                </Text>
              </View>
              <MaterialCommunityIcons
                name="arrow-right"
                size={24}
                color={COLORS.textMuted}
              />
              <View style={styles.estimationItem}>
                <Text style={styles.estimationLabel}>Taille estimée</Text>
                <Text style={[styles.estimationValue, styles.highlight]}>
                  {formatFileSize(estimatedSize())}
                </Text>
              </View>
            </View>
            <View style={styles.savingsContainer}>
              <MaterialCommunityIcons
                name="content-save"
                size={20}
                color={COLORS.success}
              />
              <Text style={styles.savingsText}>
                Économie: ~{((1 - estimatedSize() / (video.size || 50 * 1024 * 1024)) * 100).toFixed(0)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <MaterialCommunityIcons
            name="information"
            size={24}
            color={COLORS.primary}
          />
          <Text style={styles.infoText}>
            Une compression plus élevée réduira la taille du fichier mais peut affecter la qualité visuelle.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.processingText}>Compression en cours...</Text>
          </View>
        ) : (
          <Button
            title="Compresser la vidéo"
            onPress={handleCompress}
            fullWidth
            size="lg"
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const getQualityIcon = (quality: string): any => {
  const icons = {
    low: 'quality-low',
    medium: 'quality-medium',
    high: 'quality-high',
    ultra: 'star',
  };
  return icons[quality as keyof typeof icons] || 'quality-medium';
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
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  optionLabel: {
    color: COLORS.text,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  selectedLabel: {
    color: COLORS.primary,
  },
  resolutionList: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  resolutionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectedResolution: {
    backgroundColor: COLORS.primary + '20',
  },
  resolutionLabel: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
  },
  selectedResolutionLabel: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  estimationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  estimationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  estimationItem: {
    alignItems: 'center',
  },
  estimationLabel: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
  },
  estimationValue: {
    color: COLORS.text,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
  },
  highlight: {
    color: COLORS.success,
  },
  savingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  savingsText: {
    color: COLORS.success,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.primary + '20',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  infoText: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONTS.sizes.sm,
    marginLeft: SPACING.md,
    lineHeight: 20,
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
