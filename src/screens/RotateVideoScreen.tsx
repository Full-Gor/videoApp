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
import { Header, VideoPlayer, Button } from '../components';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/theme';
import { RootStackParamList } from '../types';

type RotateVideoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RotateVideo'>;
type RotateVideoScreenRouteProp = RouteProp<RootStackParamList, 'RotateVideo'>;

interface RotateVideoScreenProps {
  navigation: RotateVideoScreenNavigationProp;
  route: RotateVideoScreenRouteProp;
}

const ROTATION_OPTIONS = [
  { value: 0, label: '0°', icon: 'rotate-right' },
  { value: 90, label: '90°', icon: 'rotate-right' },
  { value: 180, label: '180°', icon: 'rotate-right' },
  { value: 270, label: '270°', icon: 'rotate-right' },
];

const FLIP_OPTIONS = [
  { id: 'horizontal', label: 'Horizontal', icon: 'flip-horizontal' },
  { id: 'vertical', label: 'Vertical', icon: 'flip-vertical' },
];

export const RotateVideoScreen: React.FC<RotateVideoScreenProps> = ({
  navigation,
  route,
}) => {
  const { video } = route.params;
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const rotateLeft = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const rotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleApply = async () => {
    if (rotation === 0 && !flipHorizontal && !flipVertical) {
      Alert.alert('Info', 'Aucune modification à appliquer.');
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Succès',
        'Transformation appliquée!',
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

  const getTransformStyle = () => {
    const transforms = [];
    if (rotation !== 0) {
      transforms.push({ rotate: `${rotation}deg` });
    }
    if (flipHorizontal) {
      transforms.push({ scaleX: -1 });
    }
    if (flipVertical) {
      transforms.push({ scaleY: -1 });
    }
    return transforms;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Rotation & Retournement"
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <View style={styles.previewContainer}>
          <View style={[styles.videoWrapper, { transform: getTransformStyle() }]}>
            <VideoPlayer uri={video.uri} style={styles.videoPlayer} />
          </View>
        </View>

        {/* Rotation Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rotation</Text>
          <View style={styles.rotationControls}>
            <TouchableOpacity style={styles.rotateButton} onPress={rotateLeft}>
              <MaterialCommunityIcons
                name="rotate-left"
                size={32}
                color={COLORS.text}
              />
              <Text style={styles.rotateButtonText}>-90°</Text>
            </TouchableOpacity>

            <View style={styles.rotationDisplay}>
              <Text style={styles.rotationValue}>{rotation}°</Text>
            </View>

            <TouchableOpacity style={styles.rotateButton} onPress={rotateRight}>
              <MaterialCommunityIcons
                name="rotate-right"
                size={32}
                color={COLORS.text}
              />
              <Text style={styles.rotateButtonText}>+90°</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Rotation Presets */}
          <View style={styles.presetRow}>
            {ROTATION_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.presetButton,
                  rotation === option.value && styles.selectedPreset,
                ]}
                onPress={() => setRotation(option.value)}
              >
                <Text
                  style={[
                    styles.presetText,
                    rotation === option.value && styles.selectedPresetText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Flip Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Retournement</Text>
          <View style={styles.flipControls}>
            <TouchableOpacity
              style={[
                styles.flipButton,
                flipHorizontal && styles.activeFlip,
              ]}
              onPress={() => setFlipHorizontal(!flipHorizontal)}
            >
              <MaterialCommunityIcons
                name="flip-horizontal"
                size={28}
                color={flipHorizontal ? COLORS.primary : COLORS.text}
              />
              <Text
                style={[
                  styles.flipButtonText,
                  flipHorizontal && styles.activeFlipText,
                ]}
              >
                Horizontal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.flipButton,
                flipVertical && styles.activeFlip,
              ]}
              onPress={() => setFlipVertical(!flipVertical)}
            >
              <MaterialCommunityIcons
                name="flip-vertical"
                size={28}
                color={flipVertical ? COLORS.primary : COLORS.text}
              />
              <Text
                style={[
                  styles.flipButtonText,
                  flipVertical && styles.activeFlipText,
                ]}
              >
                Vertical
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reset Button */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            setRotation(0);
            setFlipHorizontal(false);
            setFlipVertical(false);
          }}
        >
          <MaterialCommunityIcons
            name="refresh"
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.resetButtonText}>Réinitialiser</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.processingText}>Application en cours...</Text>
          </View>
        ) : (
          <Button
            title="Appliquer les modifications"
            onPress={handleApply}
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
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  videoWrapper: {
    width: '100%',
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
  rotationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  rotateButton: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    width: 80,
  },
  rotateButtonText: {
    color: COLORS.text,
    fontSize: FONTS.sizes.sm,
    marginTop: SPACING.xs,
  },
  rotationDisplay: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.round,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotationValue: {
    color: COLORS.text,
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  presetButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
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
  flipControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flipButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginHorizontal: SPACING.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeFlip: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  flipButtonText: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  activeFlipText: {
    color: COLORS.primary,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  resetButtonText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
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
