import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Text,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface VideoTrimmerProps {
  duration: number;
  startTime: number;
  endTime: number;
  onStartChange: (time: number) => void;
  onEndChange: (time: number) => void;
  thumbnails?: string[];
}

export const VideoTrimmer: React.FC<VideoTrimmerProps> = ({
  duration,
  startTime,
  endTime,
  onStartChange,
  onEndChange,
  thumbnails = [],
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const minDuration = 1000;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const getPositionFromTime = (time: number) => {
    return (time / duration) * containerWidth;
  };

  const getTimeFromPosition = (position: number) => {
    return (position / containerWidth) * duration;
  };

  const leftHandlePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const currentPosition = getPositionFromTime(startTime);
      const newPosition = Math.max(0, currentPosition + gestureState.dx);
      const newTime = getTimeFromPosition(newPosition);

      if (newTime >= 0 && endTime - newTime >= minDuration) {
        onStartChange(Math.round(newTime));
      }
    },
  });

  const rightHandlePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const currentPosition = getPositionFromTime(endTime);
      const newPosition = Math.min(containerWidth, currentPosition + gestureState.dx);
      const newTime = getTimeFromPosition(newPosition);

      if (newTime <= duration && newTime - startTime >= minDuration) {
        onEndChange(Math.round(newTime));
      }
    },
  });

  const onLayout = (event: any) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const leftPosition = getPositionFromTime(startTime);
  const rightPosition = getPositionFromTime(endTime);

  return (
    <View style={styles.container}>
      <View style={styles.timeLabels}>
        <Text style={styles.timeLabel}>{formatTime(startTime)}</Text>
        <Text style={styles.durationLabel}>
          Durée: {formatTime(endTime - startTime)}
        </Text>
        <Text style={styles.timeLabel}>{formatTime(endTime)}</Text>
      </View>

      <View style={styles.trimmerContainer} onLayout={onLayout}>
        <View style={styles.timeline}>
          {thumbnails.length > 0 ? (
            thumbnails.map((thumb, index) => (
              <View key={index} style={styles.thumbnailContainer}>
                {/* Thumbnail would be rendered here */}
              </View>
            ))
          ) : (
            <View style={styles.placeholderTimeline} />
          )}
        </View>

        {/* Left overlay */}
        <View
          style={[
            styles.overlay,
            styles.leftOverlay,
            { width: leftPosition },
          ]}
        />

        {/* Right overlay */}
        <View
          style={[
            styles.overlay,
            styles.rightOverlay,
            { width: containerWidth - rightPosition },
          ]}
        />

        {/* Selected region */}
        <View
          style={[
            styles.selectedRegion,
            {
              left: leftPosition,
              width: rightPosition - leftPosition,
            },
          ]}
        />

        {/* Left handle */}
        <View
          style={[styles.handle, styles.leftHandle, { left: leftPosition - 15 }]}
          {...leftHandlePanResponder.panHandlers}
        >
          <View style={styles.handleBar} />
          <View style={styles.handleBar} />
        </View>

        {/* Right handle */}
        <View
          style={[styles.handle, styles.rightHandle, { left: rightPosition - 5 }]}
          {...rightHandlePanResponder.panHandlers}
        >
          <View style={styles.handleBar} />
          <View style={styles.handleBar} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  timeLabel: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  durationLabel: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  trimmerContainer: {
    height: 60,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
  },
  timeline: {
    flex: 1,
    flexDirection: 'row',
  },
  thumbnailContainer: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
  },
  placeholderTimeline: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  leftOverlay: {
    left: 0,
  },
  rightOverlay: {
    right: 0,
  },
  selectedRegion: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  handle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  leftHandle: {
    borderTopLeftRadius: BORDER_RADIUS.md,
    borderBottomLeftRadius: BORDER_RADIUS.md,
  },
  rightHandle: {
    borderTopRightRadius: BORDER_RADIUS.md,
    borderBottomRightRadius: BORDER_RADIUS.md,
  },
  handleBar: {
    width: 3,
    height: 20,
    backgroundColor: COLORS.text,
    borderRadius: 2,
    marginHorizontal: 1,
  },
});
