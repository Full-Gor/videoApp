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
import { Header, VideoPlayer, Button, Slider } from '../components';
import { VIDEO_FILTERS } from '../constants/tools';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/theme';
import { RootStackParamList } from '../types';

type FilterVideoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FilterVideo'>;
type FilterVideoScreenRouteProp = RouteProp<RootStackParamList, 'FilterVideo'>;

interface FilterVideoScreenProps {
  navigation: FilterVideoScreenNavigationProp;
  route: FilterVideoScreenRouteProp;
}

const ADJUSTMENTS = [
  { id: 'brightness', name: 'Luminosité', icon: 'brightness-6', min: -100, max: 100, default: 0 },
  { id: 'contrast', name: 'Contraste', icon: 'contrast-circle', min: -100, max: 100, default: 0 },
  { id: 'saturation', name: 'Saturation', icon: 'palette', min: -100, max: 100, default: 0 },
  { id: 'exposure', name: 'Exposition', icon: 'white-balance-sunny', min: -100, max: 100, default: 0 },
];

export const FilterVideoScreen: React.FC<FilterVideoScreenProps> = ({
  navigation,
  route,
}) => {
  const { video } = route.params;
  const [selectedFilter, setSelectedFilter] = useState(VIDEO_FILTERS[0]);
  const [adjustments, setAdjustments] = useState<{ [key: string]: number }>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    exposure: 0,
  });
  const [filterIntensity, setFilterIntensity] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);

  const updateAdjustment = (id: string, value: number) => {
    setAdjustments({ ...adjustments, [id]: value });
  };

  const resetAll = () => {
    setSelectedFilter(VIDEO_FILTERS[0]);
    setAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      exposure: 0,
    });
    setFilterIntensity(100);
  };

  const handleApply = async () => {
    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Succès',
        'Filtres appliqués avec succès!',
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
        title="Filtres & Ajustements"
        showBack
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity onPress={resetAll}>
            <MaterialCommunityIcons name="refresh" size={24} color={COLORS.text} />
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.previewContainer}>
          <VideoPlayer uri={video.uri} style={styles.videoPlayer} />
        </View>

        {/* Filter Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filtres</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          >
            {VIDEO_FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterOption,
                  selectedFilter.id === filter.id && styles.selectedFilter,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <View
                  style={[
                    styles.filterPreview,
                    selectedFilter.id === filter.id && styles.selectedFilterPreview,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="image-filter-vintage"
                    size={24}
                    color={
                      selectedFilter.id === filter.id
                        ? COLORS.primary
                        : COLORS.textMuted
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.filterName,
                    selectedFilter.id === filter.id && styles.selectedFilterName,
                  ]}
                >
                  {filter.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {selectedFilter.id !== 'none' && (
            <Slider
              label="Intensité du filtre"
              value={filterIntensity}
              min={0}
              max={100}
              step={5}
              onValueChange={setFilterIntensity}
              formatValue={(v) => `${v}%`}
            />
          )}
        </View>

        {/* Adjustments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ajustements</Text>
          {ADJUSTMENTS.map((adj) => (
            <View key={adj.id} style={styles.adjustmentItem}>
              <Slider
                label={adj.name}
                value={adjustments[adj.id]}
                min={adj.min}
                max={adj.max}
                step={1}
                onValueChange={(value) => updateAdjustment(adj.id, value)}
                formatValue={(v) => v > 0 ? `+${v}` : `${v}`}
              />
            </View>
          ))}
        </View>

        {/* Quick Presets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préréglages rapides</Text>
          <View style={styles.presetGrid}>
            <TouchableOpacity
              style={styles.presetCard}
              onPress={() => {
                setAdjustments({ brightness: 10, contrast: 10, saturation: 20, exposure: 5 });
              }}
            >
              <MaterialCommunityIcons name="white-balance-sunny" size={28} color={COLORS.warning} />
              <Text style={styles.presetName}>Éclaircir</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.presetCard}
              onPress={() => {
                setAdjustments({ brightness: -20, contrast: 30, saturation: -10, exposure: -10 });
              }}
            >
              <MaterialCommunityIcons name="movie-open" size={28} color={COLORS.secondary} />
              <Text style={styles.presetName}>Cinéma</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.presetCard}
              onPress={() => {
                setAdjustments({ brightness: 5, contrast: 15, saturation: 40, exposure: 0 });
              }}
            >
              <MaterialCommunityIcons name="palette" size={28} color={COLORS.accent} />
              <Text style={styles.presetName}>Vibrant</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.presetCard}
              onPress={() => {
                setSelectedFilter(VIDEO_FILTERS.find(f => f.id === 'grayscale') || VIDEO_FILTERS[0]);
                setAdjustments({ brightness: 0, contrast: 20, saturation: -100, exposure: 0 });
              }}
            >
              <MaterialCommunityIcons name="circle-half-full" size={28} color={COLORS.textSecondary} />
              <Text style={styles.presetName}>N&B</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.processingText}>Application des filtres...</Text>
          </View>
        ) : (
          <Button
            title="Appliquer les filtres"
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
  filterList: {
    paddingVertical: SPACING.sm,
  },
  filterOption: {
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  filterPreview: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedFilter: {},
  selectedFilterPreview: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  filterName: {
    color: COLORS.text,
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
  },
  selectedFilterName: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  adjustmentItem: {
    marginBottom: SPACING.sm,
  },
  presetGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  presetCard: {
    width: '23%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
  },
  presetName: {
    color: COLORS.text,
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    marginTop: SPACING.sm,
    textAlign: 'center',
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
