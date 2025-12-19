import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Header, VideoPlayer, Button } from '../components';
import { ASPECT_RATIOS } from '../constants/tools';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/theme';
import { RootStackParamList } from '../types';

type CropVideoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CropVideo'>;
type CropVideoScreenRouteProp = RouteProp<RootStackParamList, 'CropVideo'>;

interface CropVideoScreenProps {
  navigation: CropVideoScreenNavigationProp;
  route: CropVideoScreenRouteProp;
}

export const CropVideoScreen: React.FC<CropVideoScreenProps> = ({
  navigation,
  route,
}) => {
  const { video } = route.params;
  const [selectedRatio, setSelectedRatio] = useState<typeof ASPECT_RATIOS[0] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCrop = async () => {
    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Succès',
        'Vidéo recadrée avec succès!',
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
        title="Recadrer"
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {/* Video Preview with Crop Overlay */}
        <View style={styles.previewContainer}>
          <VideoPlayer uri={video.uri} style={styles.videoPlayer} />
          {selectedRatio && (
            <View style={styles.cropOverlay}>
              <View style={styles.cropFrame}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
            </View>
          )}
        </View>

        {/* Aspect Ratio Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Format de recadrage</Text>
          <View style={styles.ratioGrid}>
            <TouchableOpacity
              style={[
                styles.ratioOption,
                selectedRatio === null && styles.selectedRatio,
              ]}
              onPress={() => setSelectedRatio(null)}
            >
              <MaterialCommunityIcons
                name="crop-free"
                size={24}
                color={selectedRatio === null ? COLORS.primary : COLORS.textMuted}
              />
              <Text
                style={[
                  styles.ratioLabel,
                  selectedRatio === null && styles.selectedRatioLabel,
                ]}
              >
                Libre
              </Text>
            </TouchableOpacity>

            {ASPECT_RATIOS.map((ratio) => (
              <TouchableOpacity
                key={ratio.value}
                style={[
                  styles.ratioOption,
                  selectedRatio?.value === ratio.value && styles.selectedRatio,
                ]}
                onPress={() => setSelectedRatio(ratio)}
              >
                <View
                  style={[
                    styles.ratioIcon,
                    getRatioStyle(ratio.value),
                    selectedRatio?.value === ratio.value && styles.selectedRatioIcon,
                  ]}
                />
                <Text
                  style={[
                    styles.ratioLabel,
                    selectedRatio?.value === ratio.value && styles.selectedRatioLabel,
                  ]}
                >
                  {ratio.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <MaterialCommunityIcons
            name="gesture-pinch"
            size={32}
            color={COLORS.primary}
          />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Astuce</Text>
            <Text style={styles.infoText}>
              Sélectionnez un format puis déplacez et redimensionnez la zone de recadrage sur la vidéo.
            </Text>
          </View>
        </View>

        {/* Current Selection Info */}
        {selectedRatio && (
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionLabel}>Format sélectionné:</Text>
            <Text style={styles.selectionValue}>
              {selectedRatio.label} ({selectedRatio.width}x{selectedRatio.height})
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.processingText}>Recadrage en cours...</Text>
          </View>
        ) : (
          <Button
            title="Appliquer le recadrage"
            onPress={handleCrop}
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
  const baseSize = 24;

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
    position: 'relative',
  },
  videoPlayer: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  cropOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cropFrame: {
    width: '80%',
    height: '80%',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: COLORS.primary,
    borderWidth: 3,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
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
  ratioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  ratioOption: {
    width: 70,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedRatio: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  ratioIcon: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xs,
  },
  selectedRatioIcon: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '40',
  },
  ratioLabel: {
    color: COLORS.text,
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  selectedRatioLabel: {
    color: COLORS.primary,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  infoContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  infoTitle: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    lineHeight: 18,
  },
  selectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary + '20',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  selectionLabel: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
  },
  selectionValue: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    marginLeft: SPACING.sm,
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
