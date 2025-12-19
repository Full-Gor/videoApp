import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { VideoFile } from '../types';

interface MediaPickerProps {
  onVideoPicked: (video: VideoFile) => void;
  allowMultiple?: boolean;
  onMultipleVideosPicked?: (videos: VideoFile[]) => void;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({
  onVideoPicked,
  allowMultiple = false,
  onMultipleVideosPicked,
}) => {
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission requise',
        'Nous avons besoin de votre permission pour accéder à vos médias.',
      );
      return false;
    }
    return true;
  };

  const pickFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
        allowsMultipleSelection: allowMultiple,
      });

      if (!result.canceled && result.assets.length > 0) {
        if (allowMultiple && onMultipleVideosPicked) {
          const videos: VideoFile[] = result.assets.map((asset) => ({
            uri: asset.uri,
            duration: asset.duration || 0,
            width: asset.width,
            height: asset.height,
            filename: asset.fileName || 'video.mp4',
            type: asset.type || 'video',
          }));
          onMultipleVideosPicked(videos);
        } else {
          const asset = result.assets[0];
          const video: VideoFile = {
            uri: asset.uri,
            duration: asset.duration || 0,
            width: asset.width,
            height: asset.height,
            filename: asset.fileName || 'video.mp4',
            type: asset.type || 'video',
          };
          onVideoPicked(video);
        }
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger la vidéo.');
    }
  };

  const recordVideo = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission requise',
        'Nous avons besoin de votre permission pour accéder à la caméra.',
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
        videoMaxDuration: 300,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        const video: VideoFile = {
          uri: asset.uri,
          duration: asset.duration || 0,
          width: asset.width,
          height: asset.height,
          filename: asset.fileName || 'recorded_video.mp4',
          type: asset.type || 'video',
        };
        onVideoPicked(video);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'enregistrer la vidéo.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.option} onPress={pickFromGallery}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight]}
          style={styles.gradient}
        >
          <MaterialCommunityIcons
            name="folder-video"
            size={48}
            color={COLORS.text}
          />
          <Text style={styles.optionTitle}>Galerie</Text>
          <Text style={styles.optionDescription}>
            Choisir depuis vos fichiers
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={recordVideo}>
        <LinearGradient
          colors={[COLORS.secondary, COLORS.secondaryLight]}
          style={styles.gradient}
        >
          <MaterialCommunityIcons
            name="video-plus"
            size={48}
            color={COLORS.text}
          />
          <Text style={styles.optionTitle}>Caméra</Text>
          <Text style={styles.optionDescription}>
            Enregistrer une nouvelle vidéo
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  option: {
    flex: 1,
    marginHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  gradient: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
  },
  optionTitle: {
    color: COLORS.text,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    marginTop: SPACING.md,
  },
  optionDescription: {
    color: COLORS.text,
    fontSize: FONTS.sizes.sm,
    opacity: 0.8,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});
