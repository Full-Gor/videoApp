import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Text,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number) => void;
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onValueChange,
  label,
  showValue = true,
  formatValue,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);

  const getPositionFromValue = (val: number) => {
    return ((val - min) / (max - min)) * containerWidth;
  };

  const getValueFromPosition = (position: number) => {
    const rawValue = (position / containerWidth) * (max - min) + min;
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.max(min, Math.min(max, steppedValue));
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => {
      const position = event.nativeEvent.locationX;
      onValueChange(getValueFromPosition(position));
    },
    onPanResponderMove: (event) => {
      const position = event.nativeEvent.locationX;
      onValueChange(getValueFromPosition(position));
    },
  });

  const onLayout = (event: any) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const position = getPositionFromValue(value);
  const displayValue = formatValue ? formatValue(value) : value.toString();

  return (
    <View style={styles.container}>
      {(label || showValue) && (
        <View style={styles.labelContainer}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showValue && <Text style={styles.value}>{displayValue}</Text>}
        </View>
      )}

      <View
        style={styles.sliderContainer}
        onLayout={onLayout}
        {...panResponder.panHandlers}
      >
        <View style={styles.track} />
        <View style={[styles.filledTrack, { width: position }]} />
        <View style={[styles.thumb, { left: position - 12 }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    height: 6,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
  },
  filledTrack: {
    position: 'absolute',
    height: 6,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: COLORS.text,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});
