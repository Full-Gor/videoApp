import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface VideoPlayerProps {
  uri: string;
  style?: any;
  showControls?: boolean;
  onPlaybackStatusUpdate?: (status: AVPlaybackStatus) => void;
  startPosition?: number;
  endPosition?: number;
  loop?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  uri,
  style,
  showControls = true,
  onPlaybackStatusUpdate,
  startPosition,
  endPosition,
  loop = false,
}) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);

      if (endPosition && status.positionMillis >= endPosition) {
        if (loop && startPosition !== undefined) {
          videoRef.current?.setPositionAsync(startPosition);
        } else {
          videoRef.current?.pauseAsync();
        }
      }
    }
    onPlaybackStatusUpdate?.(status);
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await videoRef.current?.pauseAsync();
    } else {
      if (startPosition !== undefined && position < startPosition) {
        await videoRef.current?.setPositionAsync(startPosition);
      }
      await videoRef.current?.playAsync();
    }
  };

  const toggleMute = async () => {
    setIsMuted(!isMuted);
    await videoRef.current?.setIsMutedAsync(!isMuted);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const seekToPosition = async (percent: number) => {
    const newPosition = duration * percent;
    await videoRef.current?.setPositionAsync(newPosition);
  };

  return (
    <View style={[styles.container, style]}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        shouldPlay={false}
        isLooping={loop && !endPosition}
        isMuted={isMuted}
      />

      {showControls && (
        <View style={styles.controls}>
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${(position / duration) * 100}%` },
              ]}
            />
          </View>

          <View style={styles.controlButtons}>
            <Text style={styles.time}>{formatTime(position)}</Text>

            <View style={styles.centerControls}>
              <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
                <MaterialCommunityIcons
                  name={isPlaying ? 'pause' : 'play'}
                  size={32}
                  color={COLORS.text}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.rightControls}>
              <TouchableOpacity onPress={toggleMute} style={styles.iconButton}>
                <MaterialCommunityIcons
                  name={isMuted ? 'volume-off' : 'volume-high'}
                  size={24}
                  color={COLORS.text}
                />
              </TouchableOpacity>
              <Text style={styles.time}>{formatTime(duration)}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  video: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.overlay,
    padding: SPACING.md,
  },
  progressContainer: {
    height: 4,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
  },
  controlButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    padding: SPACING.sm,
  },
  time: {
    color: COLORS.text,
    fontSize: 12,
    minWidth: 40,
  },
});
