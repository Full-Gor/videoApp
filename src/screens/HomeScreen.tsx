import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ToolCard, MediaPicker } from '../components';
import { EDITING_TOOLS } from '../constants/tools';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { VideoFile, RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [showMultiplePicker, setShowMultiplePicker] = useState(false);

  const handleToolPress = (tool: typeof EDITING_TOOLS[0]) => {
    if (tool.id === 'merge') {
      setShowMultiplePicker(true);
      setSelectedTool(tool.screen);
    } else {
      setSelectedTool(tool.screen);
      setShowMediaPicker(true);
    }
  };

  const handleVideoPicked = (video: VideoFile) => {
    setShowMediaPicker(false);
    if (selectedTool) {
      navigation.navigate(selectedTool as any, { video });
    }
  };

  const handleMultipleVideosPicked = (videos: VideoFile[]) => {
    setShowMultiplePicker(false);
    navigation.navigate('MergeVideos', { videos });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.appName}>VideoEdit Pro</Text>
              <Text style={styles.tagline}>Éditeur vidéo professionnel</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <MaterialCommunityIcons
                name="account-circle"
                size={40}
                color={COLORS.text}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Action rapide</Text>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => setShowMediaPicker(true)}
          >
            <LinearGradient
              colors={[COLORS.secondary, COLORS.secondaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quickActionGradient}
            >
              <MaterialCommunityIcons
                name="plus-circle"
                size={32}
                color={COLORS.text}
              />
              <View style={styles.quickActionText}>
                <Text style={styles.quickActionTitle}>Nouveau projet</Text>
                <Text style={styles.quickActionDescription}>
                  Commencer l'édition d'une vidéo
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={28}
                color={COLORS.text}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Tools Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Outils d'édition</Text>
          <View style={styles.toolsGrid}>
            {EDITING_TOOLS.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onPress={() => handleToolPress(tool)}
              />
            ))}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fonctionnalités</Text>
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons
                name="cloud-upload"
                size={28}
                color={COLORS.primary}
              />
              <Text style={styles.featureText}>Export HD</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={28}
                color={COLORS.warning}
              />
              <Text style={styles.featureText}>Rapide</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons
                name="shield-check"
                size={28}
                color={COLORS.success}
              />
              <Text style={styles.featureText}>Sécurisé</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons
                name="infinity"
                size={28}
                color={COLORS.accent}
              />
              <Text style={styles.featureText}>Illimité</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Media Picker Modal */}
      <Modal
        visible={showMediaPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMediaPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choisir une vidéo</Text>
              <TouchableOpacity
                onPress={() => setShowMediaPicker(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={COLORS.text}
                />
              </TouchableOpacity>
            </View>
            <MediaPicker onVideoPicked={handleVideoPicked} />
          </View>
        </View>
      </Modal>

      {/* Multiple Media Picker Modal */}
      <Modal
        visible={showMultiplePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMultiplePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choisir des vidéos</Text>
              <TouchableOpacity
                onPress={() => setShowMultiplePicker(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={COLORS.text}
                />
              </TouchableOpacity>
            </View>
            <MediaPicker
              onVideoPicked={handleVideoPicked}
              allowMultiple={true}
              onMultipleVideosPicked={handleMultipleVideosPicked}
            />
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
  header: {
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: BORDER_RADIUS.xxl,
    borderBottomRightRadius: BORDER_RADIUS.xxl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.lg,
  },
  appName: {
    color: COLORS.text,
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '800',
  },
  tagline: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    opacity: 0.8,
    marginTop: SPACING.xs,
  },
  profileButton: {
    padding: SPACING.sm,
  },
  section: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    marginBottom: SPACING.lg,
  },
  quickAction: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  quickActionText: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  quickActionTitle: {
    color: COLORS.text,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  quickActionDescription: {
    color: COLORS.text,
    fontSize: FONTS.sizes.sm,
    opacity: 0.8,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    marginTop: SPACING.sm,
  },
  bottomSpacing: {
    height: 100,
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
});
