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
import { ASPECT_RATIOS } from '../constants/tools';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/theme';
import { RootStackParamList } from '../types';

type ResizeVideoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ResizeVideo'>;
type ResizeVideoScreenRouteProp = RouteProp<RootStackParamList, 'ResizeVideo'>;

interface ResizeVideoScreenProps {
  navigation: ResizeVideoScreenNavigationProp;
  route: ResizeVideoScreenRouteProp;
}

export const ResizeVideoScreen: React.FC<ResizeVideoScreenProps> = ({
  navigation,
  route,
}) => {
  const { video } = route.params;
  const [selectedRatio, setSelectedRatio] = useState(ASPECT_RATIOS[0]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleResize = async () => {
    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Succès',
        `Vidéo redimensionnée en ${selectedRatio.label} (${selectedRatio.width}x${selectedRatio.height})`,
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
      Alert.alert('Erreur', 'Une erreur est survenue lors du redimensionnement.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Redimensionner"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.previewContainer}>
          <VideoPlayer uri={video.uri} style={styles.videoPlayer} />
        </View>

        <Text style={styles.sectionTitle}>Rapport d'aspect</Text>

        <View style={styles.ratioGrid}>
          {ASPECT_RATIOS.map((ratio) => (
            <TouchableOpacity
              key={ratio.value}
              style={[
                styles.ratioOption,
                selectedRatio.value === ratio.value && styles.selectedRatio,
              ]}
              onPress={() => setSelectedRatio(ratio)}
            >
              <View
                style={[
                  styles.ratioPreview,
                  getRatioStyle(ratio.value),
                  selectedRatio.value === ratio.value && styles.selectedRatioPreview,
                ]}
              >
                <MaterialCommunityIcons
                  name="aspect-ratio"
                  size={20}
                  color={
                    selectedRatio.value === ratio.value
                      ? COLORS.primary
                      : COLORS.textMuted
                  }
                />
              </View>
              <Text
                style={[
                  styles.ratioLabel,
                  selectedRatio.value === ratio.value && styles.selectedRatioLabel,
                ]}
              >
                {ratio.label}
              </Text>
              <Text style={styles.ratioDimensions}>
                {ratio.width}x{ratio.height}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Résolution de sortie</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Largeur</Text>
            <Text style={styles.infoValue}>{selectedRatio.width}px</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hauteur</Text>
            <Text style={styles.infoValue}>{selectedRatio.height}px</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ratio</Text>
            <Text style={[styles.infoValue, styles.highlight]}>
              {selectedRatio.label}
            </Text>
          </View>
        </View>

        <View style={styles.platformHints}>
          <Text style={styles.hintTitle}>Recommandations</Text>
          <View style={styles.hint}>
            <MaterialCommunityIcons name="youtube" size={20} color="#FF0000" />
            <Text style={styles.hintText}>YouTube: 16:9</Text>
          </View>
          <View style={styles.hint}>
            <MaterialCommunityIcons name="instagram" size={20} color="#E4405F" />
            <Text style={styles.hintText}>Instagram Reels: 9:16</Text>
          </View>
          <View style={styles.hint}>
            <MaterialCommunityIcons name="instagram" size={20} color="#E4405F" />
            <Text style={styles.hintText}>Instagram Feed: 1:1 ou 4:5</Text>
          </View>
          <View style={styles.hint}>
            <MaterialCommunityIcons name="music-note" size={20} color="#000000" />
            <Text style={styles.hintText}>TikTok: 9:16</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.processingText}>Redimensionnement en cours...</Text>
          </View>
        ) : (
          <Button
            title="Appliquer le redimensionnement"
            onPress={handleResize}
            fullWidth
            size="lg"
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const getRatioStyle = (ratio: string) => {
  const [w, h] = ratio.split(':').map(Number);
  const baseSize = 40;

  if (w > h) {
    return { width: baseSize, height: baseSize * (h / w) };
  } else {
    return { width: baseSize * (w / h), height: baseSize };
  }
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
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    marginBottom: SPACING.lg,
  },
  ratioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  ratioOption: {
    width: '30%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedRatio: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  ratioPreview: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  selectedRatioPreview: {
    borderColor: COLORS.primary,
  },
  ratioLabel: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  selectedRatioLabel: {
    color: COLORS.primary,
  },
  ratioDimensions: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
  },
  infoSection: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  infoTitle: {
    color: COLORS.text,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
  },
  infoValue: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  highlight: {
    color: COLORS.primary,
  },
  platformHints: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  hintTitle: {
    color: COLORS.text,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  hintText: {
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
