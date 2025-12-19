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
import * as DocumentPicker from 'expo-document-picker';
import { Header, VideoPlayer, Button, Slider } from '../components';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/theme';
import { RootStackParamList, AudioFile } from '../types';

type AddMusicScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddMusic'>;
type AddMusicScreenRouteProp = RouteProp<RootStackParamList, 'AddMusic'>;

interface AddMusicScreenProps {
  navigation: AddMusicScreenNavigationProp;
  route: AddMusicScreenRouteProp;
}

export const AddMusicScreen: React.FC<AddMusicScreenProps> = ({
  navigation,
  route,
}) => {
  const { video } = route.params;
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null);
  const [videoVolume, setVideoVolume] = useState(100);
  const [musicVolume, setMusicVolume] = useState(100);
  const [keepOriginalAudio, setKeepOriginalAudio] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const pickAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        setAudioFile({
          uri: asset.uri,
          duration: 0,
          filename: asset.name,
        });
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger le fichier audio.');
    }
  };

  const handleAddMusic = async () => {
    if (!audioFile) {
      Alert.alert('Erreur', 'Veuillez sélectionner un fichier audio.');
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Succès',
        'Musique ajoutée à la vidéo!',
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
        title="Ajouter de la musique"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.previewContainer}>
          <VideoPlayer uri={video.uri} style={styles.videoPlayer} />
        </View>

        {/* Audio Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fichier audio</Text>

          {audioFile ? (
            <View style={styles.audioFileCard}>
              <View style={styles.audioFileIcon}>
                <MaterialCommunityIcons
                  name="music-note"
                  size={32}
                  color={COLORS.primary}
                />
              </View>
              <View style={styles.audioFileInfo}>
                <Text style={styles.audioFileName} numberOfLines={1}>
                  {audioFile.filename}
                </Text>
                <Text style={styles.audioFileType}>Fichier audio</Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setAudioFile(null)}
              >
                <MaterialCommunityIcons
                  name="close-circle"
                  size={24}
                  color={COLORS.error}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.pickButton} onPress={pickAudioFile}>
              <MaterialCommunityIcons
                name="folder-music"
                size={48}
                color={COLORS.primary}
              />
              <Text style={styles.pickButtonText}>
                Sélectionner un fichier audio
              </Text>
              <Text style={styles.pickButtonHint}>
                MP3, WAV, M4A, AAC...
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Volume Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Volume</Text>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setKeepOriginalAudio(!keepOriginalAudio)}
          >
            <View style={styles.optionInfo}>
              <MaterialCommunityIcons
                name="volume-high"
                size={24}
                color={COLORS.text}
              />
              <Text style={styles.optionText}>Conserver l'audio original</Text>
            </View>
            <MaterialCommunityIcons
              name={keepOriginalAudio ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={24}
              color={keepOriginalAudio ? COLORS.primary : COLORS.textMuted}
            />
          </TouchableOpacity>

          {keepOriginalAudio && (
            <Slider
              label="Volume de la vidéo"
              value={videoVolume}
              min={0}
              max={100}
              step={5}
              onValueChange={setVideoVolume}
              formatValue={(v) => `${v}%`}
            />
          )}

          <Slider
            label="Volume de la musique"
            value={musicVolume}
            min={0}
            max={100}
            step={5}
            onValueChange={setMusicVolume}
            formatValue={(v) => `${v}%`}
          />
        </View>

        {/* Audio Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Options</Text>

          <View style={styles.optionCard}>
            <View style={styles.optionItem}>
              <MaterialCommunityIcons
                name="repeat"
                size={24}
                color={COLORS.primary}
              />
              <View style={styles.optionItemInfo}>
                <Text style={styles.optionItemTitle}>Boucle audio</Text>
                <Text style={styles.optionItemDescription}>
                  Répéter la musique si elle est plus courte que la vidéo
                </Text>
              </View>
            </View>

            <View style={styles.optionItem}>
              <MaterialCommunityIcons
                name="volume-variant-off"
                size={24}
                color={COLORS.secondary}
              />
              <View style={styles.optionItemInfo}>
                <Text style={styles.optionItemTitle}>Fade in/out</Text>
                <Text style={styles.optionItemDescription}>
                  Ajouter un fondu au début et à la fin
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.processingText}>Ajout de la musique...</Text>
          </View>
        ) : (
          <Button
            title="Ajouter la musique"
            onPress={handleAddMusic}
            fullWidth
            size="lg"
            disabled={!audioFile}
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
  pickButton: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xxl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  pickButtonText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    marginTop: SPACING.md,
  },
  pickButtonHint: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.sm,
    marginTop: SPACING.xs,
  },
  audioFileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  audioFileIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioFileInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  audioFileName: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  audioFileType: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    marginTop: SPACING.xs,
  },
  removeButton: {
    padding: SPACING.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    marginLeft: SPACING.md,
  },
  optionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.md,
  },
  optionItemInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  optionItemTitle: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  optionItemDescription: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    marginTop: SPACING.xs,
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
