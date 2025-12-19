import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '../components';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/theme';
import { Project } from '../types';

interface ProjectsScreenProps {
  navigation: any;
}

const SAMPLE_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Vacances été 2024',
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2024-08-20'),
    videos: [],
    audioTracks: [],
    textOverlays: [],
  },
  {
    id: '2',
    name: 'Anniversaire Marie',
    createdAt: new Date('2024-07-10'),
    updatedAt: new Date('2024-07-12'),
    videos: [],
    audioTracks: [],
    textOverlays: [],
  },
  {
    id: '3',
    name: 'Projet travail',
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-15'),
    videos: [],
    audioTracks: [],
    textOverlays: [],
  },
];

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({ navigation }) => {
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const deleteProject = (id: string) => {
    Alert.alert(
      'Supprimer le projet',
      'Êtes-vous sûr de vouloir supprimer ce projet ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setProjects(projects.filter((p) => p.id !== id));
          },
        },
      ],
    );
  };

  const renderProject = ({ item }: { item: Project }) => (
    <TouchableOpacity
      style={styles.projectCard}
      onPress={() => {
        Alert.alert('Info', 'Ouvrir le projet ' + item.name);
      }}
    >
      <View style={styles.projectThumbnail}>
        <MaterialCommunityIcons
          name="movie-outline"
          size={32}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.projectInfo}>
        <Text style={styles.projectName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.projectDate}>
          Modifié le {formatDate(item.updatedAt)}
        </Text>
      </View>

      <View style={styles.projectActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => deleteProject(item.id)}
        >
          <MaterialCommunityIcons
            name="delete-outline"
            size={24}
            color={COLORS.error}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="folder-video"
        size={80}
        color={COLORS.textMuted}
      />
      <Text style={styles.emptyTitle}>Aucun projet</Text>
      <Text style={styles.emptyDescription}>
        Vos projets vidéo apparaîtront ici
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Mes projets" />

      <FlatList
        data={projects}
        renderItem={renderProject}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.lg,
    flexGrow: 1,
  },
  projectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  projectThumbnail: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  projectName: {
    color: COLORS.text,
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
  },
  projectDate: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    marginTop: SPACING.xs,
  },
  projectActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: SPACING.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    marginTop: SPACING.lg,
  },
  emptyDescription: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
});
