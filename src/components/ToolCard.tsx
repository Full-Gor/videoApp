import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { EditingTool } from '../types';

interface ToolCardProps {
  tool: EditingTool;
  onPress: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[tool.color + '20', tool.color + '10']}
        style={styles.gradient}
      >
        <View style={[styles.iconContainer, { backgroundColor: tool.color + '30' }]}>
          <MaterialCommunityIcons
            name={tool.icon as any}
            size={28}
            color={tool.color}
          />
        </View>
        <Text style={styles.name}>{tool.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {tool.description}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  gradient: {
    padding: SPACING.lg,
    alignItems: 'center',
    minHeight: 140,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  name: {
    color: COLORS.text,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    textAlign: 'center',
  },
});
