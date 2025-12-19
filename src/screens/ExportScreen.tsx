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
  Share,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { Header, VideoPlayer, Button } from '../components';
import { VIDEO_QUALITIES } from '../constants/tools';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/theme';
import { RootStackParamList } from '../types';

type ExportScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Export'>;
type ExportScreenRouteProp = RouteProp<RootStackParamList, 'Export'>;

interface ExportScreenProps {
  navigation: ExportScreenNavigationProp;
  route: ExportScreenRouteProp;
}

const EXPORT_FORMATS = [
  { id: 'mp4', name: 'MP4', description: 'Format le plus compatible' },
  { id: 'mov', name: 'MOV', description: 'Qualité Apple' },
  { id: 'webm', name: 'WebM', description: 'Optimisé pour le web' },
];

export const ExportScreen: React.FC<ExportScreenProps> = ({
  navigation,
  route,
}) => {
  const { video, outputUri } = route.params;
  const [selectedFormat, setSelectedFormat] = useState(EXPORT_FORMATS[0]);
  const [selectedQuality, setSelectedQuality] = useState(VIDEO_QUALITIES[2]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  };

  const handleSaveToGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission requise', 'Nous avons besoin de la permission pour sauvegarder dans votre galerie.');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setExportProgress(i);
      }

      await MediaLibrary.saveToLibraryAsync(outputUri || video.uri);

      Alert.alert(
        'Succès!',
        'Votre vidéo a été sauvegardée dans la galerie.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ],
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder la vidéo.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleShare = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Erreur', 'Le partage n\'est pas disponible sur cet appareil.');
        return;
      }

      await Sharing.shareAsync(outputUri || video.uri, {
        mimeType: 'video/mp4',
        dialogTitle: 'Partager la vidéo',
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager la vidéo.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Exporter"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.previewContainer}>
          <VideoPlayer uri={outputUri || video.uri} style={styles.videoPlayer} />
        </View>

        {/* Format Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Format de sortie</Text>
          <View style={styles.formatGrid}>
            {EXPORT_FORMATS.map((format) => (
              <TouchableOpacity
                key={format.id}
                style={[
                  styles.formatOption,
                  selectedFormat.id === format.id && styles.selectedFormat,
                ]}
                onPress={() => setSelectedFormat(format)}
              >
                <Text
                  style={[
                    styles.formatName,
                    selectedFormat.id === format.id && styles.selectedFormatName,
                  ]}
                >
                  {format.name}
                </Text>
                <Text style={styles.formatDescription}>{format.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quality Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Qualité</Text>
          <View style={styles.qualityList}>
            {VIDEO_QUALITIES.map((quality) => (
              <TouchableOpacity
                key={quality.value}
                style={[
                  styles.qualityOption,
                  selectedQuality.value === quality.value && styles.selectedQuality,
                ]}
                onPress={() => setSelectedQuality(quality)}
              >
                <View style={styles.qualityInfo}>
                  <Text
                    style={[
                      styles.qualityLabel,
                      selectedQuality.value === quality.value && styles.selectedQualityLabel,
                    ]}
                  >
                    {quality.label}
                  </Text>
                </View>
                {selectedQuality.value === quality.value && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={24}
                    color={COLORS.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Export Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="file-video" size={24} color={COLORS.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Format</Text>
              <Text style={styles.infoValue}>{selectedFormat.name}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="quality-high" size={24} color={COLORS.secondary} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Résolution</Text>
              <Text style={styles.infoValue}>{selectedQuality.label}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="timer" size={24} color={COLORS.warning} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Durée estimée</Text>
              <Text style={styles.infoValue}>~30 secondes</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isExporting ? (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${exportProgress}%` }]} />
            </View>
            <Text style={styles.progressText}>Export en cours... {exportProgress}%</Text>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <Button
              title="Sauvegarder"
              onPress={handleSaveToGallery}
              fullWidth
              size="lg"
              icon={
                <MaterialCommunityIcons name="content-save" size={20} color={COLORS.text} />
              }
            />
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <MaterialCommunityIcons name="share-variant" size={24} color={COLORS.primary} />
              <Text style={styles.shareButtonText}>Partager</Text>
            </TouchableOpacity>
          </View>
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
  formatGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formatOption: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedFormat: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  formatName: {
    color: COLORS.text,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  selectedFormatName: {
    color: COLORS.primary,
  },
  formatDescription: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    textAlign: 'center',
  },
  qualityList: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  qualityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectedQuality: {
    backgroundColor: COLORS.primary + '10',
  },
  qualityInfo: {
    flex: 1,
  },
  qualityLabel: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
  },
  selectedQualityLabel: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.backgroundLight,
  },
  buttonContainer: {
    gap: SPACING.md,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  shareButtonText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  progressText: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
  },
});
