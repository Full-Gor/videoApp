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
  Modal,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Header, Button, MediaPicker, VideoPlayer } from '../components';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/theme';
import { RootStackParamList, VideoFile } from '../types';

type MergeVideosScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MergeVideos'>;
type MergeVideosScreenRouteProp = RouteProp<RootStackParamList, 'MergeVideos'>;

interface MergeVideosScreenProps {
  navigation: MergeVideosScreenNavigationProp;
  route: MergeVideosScreenRouteProp;
}

export const MergeVideosScreen: React.FC<MergeVideosScreenProps> = ({
  navigation,
  route,
}) => {
  const initialVideos = route.params?.videos || [];
  const [videos, setVideos] = useState<VideoFile[]>(initialVideos);
  const [showPicker, setShowPicker] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);

  const addVideo = (video: VideoFile) => {
    setVideos([...videos, video]);
    setShowPicker(false);
  };

  const removeVideo = (index: number) => {
    const newVideos = [...videos];
    newVideos.splice(index, 1);
    setVideos(newVideos);
  };

  const moveVideo = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= videos.length) return;

    const newVideos = [...videos];
    [newVideos[fromIndex], newVideos[toIndex]] = [newVideos[toIndex], newVideos[fromIndex]];
    setVideos(newVideos);
  };

  const getTotalDuration = () => {
    return videos.reduce((total, video) => total + video.duration, 0);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMerge = async () => {
    if (videos.length < 2) {
      Alert.alert('Erreur', 'Ajoutez au moins 2 vidéos pour fusionner.');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      Alert.alert(
        'Succès',
        `${videos.length} vidéos fusionnées avec succès!`,
        [
          {
            text: 'Exporter',
            onPress: () => navigation.navigate('Export', {
              video: videos[0],
              outputUri: videos[0].uri
            }),
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ],
      );
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la fusion.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Fusionner les vidéos"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Video List */}
        <View style={styles.videoList}>
          {videos.map((video, index) => (
            <View key={index} style={styles.videoItem}>
              <TouchableOpacity
                style={styles.videoPreview}
                onPress={() => setSelectedVideoIndex(index)}
              >
                <MaterialCommunityIcons
                  name="play-circle"
                  size={40}
                  color={COLORS.primary}
                />
              </TouchableOpacity>

              <View style={styles.videoInfo}>
                <Text style={styles.videoName} numberOfLines={1}>
                  Vidéo {index + 1}
                </Text>
                <Text style={styles.videoDuration}>
                  {formatTime(video.duration)}
                </Text>
              </View>

              <View style={styles.videoActions}>
                <TouchableOpacity
                  onPress={() => moveVideo(index, 'up')}
                  disabled={index === 0}
                  style={[styles.actionButton, index === 0 && styles.disabled]}
                >
                  <MaterialCommunityIcons
                    name="chevron-up"
                    size={24}
                    color={COLORS.text}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => moveVideo(index, 'down')}
                  disabled={index === videos.length - 1}
                  style={[
                    styles.actionButton,
                    index === videos.length - 1 && styles.disabled,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={24}
                    color={COLORS.text}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => removeVideo(index)}
                  style={styles.deleteButton}
                >
                  <MaterialCommunityIcons
                    name="delete"
                    size={24}
                    color={COLORS.error}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Add Video Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowPicker(true)}
          >
            <MaterialCommunityIcons
              name="plus"
              size={32}
              color={COLORS.primary}
            />
            <Text style={styles.addButtonText}>Ajouter une vidéo</Text>
          </TouchableOpacity>
        </View>

        {/* Summary */}
        {videos.length > 0 && (
          <View style={styles.summary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Nombre de vidéos</Text>
              <Text style={styles.summaryValue}>{videos.length}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Durée totale</Text>
              <Text style={[styles.summaryValue, styles.highlight]}>
                {formatTime(getTotalDuration())}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Merge Button */}
      <View style={styles.footer}>
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.processingText}>Fusion en cours...</Text>
          </View>
        ) : (
          <Button
            title={`Fusionner ${videos.length} vidéos`}
            onPress={handleMerge}
            fullWidth
            size="lg"
            disabled={videos.length < 2}
          />
        )}
      </View>

      {/* Video Picker Modal */}
      <Modal
        visible={showPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ajouter une vidéo</Text>
              <TouchableOpacity
                onPress={() => setShowPicker(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={COLORS.text}
                />
              </TouchableOpacity>
            </View>
            <MediaPicker onVideoPicked={addVideo} />
          </View>
        </View>
      </Modal>

      {/* Video Preview Modal */}
      <Modal
        visible={selectedVideoIndex !== null}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedVideoIndex(null)}
      >
        <View style={styles.previewModalOverlay}>
          <View style={styles.previewModalContent}>
            <TouchableOpacity
              style={styles.previewCloseButton}
              onPress={() => setSelectedVideoIndex(null)}
            >
              <MaterialCommunityIcons
                name="close"
                size={32}
                color={COLORS.text}
              />
            </TouchableOpacity>
            {selectedVideoIndex !== null && videos[selectedVideoIndex] && (
              <VideoPlayer
                uri={videos[selectedVideoIndex].uri}
                style={styles.previewVideo}
              />
            )}
          </View>
        </View>
      </Modal>
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
  videoList: {
    marginBottom: SPACING.xl,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  videoPreview: {
    width: 80,
    height: 60,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  videoName: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  videoDuration: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    marginTop: SPACING.xs,
  },
  videoActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: SPACING.sm,
  },
  disabled: {
    opacity: 0.3,
  },
  deleteButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.sm,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    marginLeft: SPACING.md,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
  },
  summaryValue: {
    color: COLORS.text,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
  },
  highlight: {
    color: COLORS.primary,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.backgroundLight,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    paddingBottom: SPACING.xxxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
  },
  closeButton: {
    padding: SPACING.sm,
  },
  previewModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewModalContent: {
    width: '100%',
    padding: SPACING.lg,
  },
  previewCloseButton: {
    alignSelf: 'flex-end',
    padding: SPACING.md,
  },
  previewVideo: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
});
