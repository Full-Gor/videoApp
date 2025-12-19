import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Header, VideoPlayer, VideoTrimmer, Button } from '../components';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { RootStackParamList } from '../types';

type TrimVideoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TrimVideo'>;
type TrimVideoScreenRouteProp = RouteProp<RootStackParamList, 'TrimVideo'>;

interface TrimVideoScreenProps {
  navigation: TrimVideoScreenNavigationProp;
  route: TrimVideoScreenRouteProp;
}

export const TrimVideoScreen: React.FC<TrimVideoScreenProps> = ({
  navigation,
  route,
}) => {
  const { video } = route.params;
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(video.duration);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTrim = async () => {
    if (endTime - startTime < 1000) {
      Alert.alert('Erreur', 'La durée minimale est de 1 seconde.');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Succès',
        `Vidéo découpée de ${formatTime(startTime)} à ${formatTime(endTime)}`,
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
      Alert.alert('Erreur', 'Une erreur est survenue lors du découpage.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Couper la vidéo"
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <VideoPlayer
          uri={video.uri}
          style={styles.videoPlayer}
          startPosition={startTime}
          endPosition={endTime}
          loop={true}
        />

        <View style={styles.trimmerSection}>
          <Text style={styles.sectionTitle}>Sélectionner la portion</Text>
          <VideoTrimmer
            duration={video.duration}
            startTime={startTime}
            endTime={endTime}
            onStartChange={setStartTime}
            onEndChange={setEndTime}
          />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Durée originale</Text>
            <Text style={styles.infoValue}>{formatTime(video.duration)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Nouvelle durée</Text>
            <Text style={[styles.infoValue, styles.highlight]}>
              {formatTime(endTime - startTime)}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.processingText}>Traitement en cours...</Text>
            </View>
          ) : (
            <Button
              title="Découper la vidéo"
              onPress={handleTrim}
              fullWidth
              size="lg"
            />
          )}
        </View>
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
  videoPlayer: {
    marginBottom: SPACING.xl,
  },
  trimmerSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: SPACING.xs,
  },
  infoValue: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
  },
  highlight: {
    color: COLORS.primary,
  },
  actions: {
    marginTop: 'auto',
  },
  processingContainer: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  processingText: {
    color: COLORS.text,
    marginTop: SPACING.md,
    fontSize: 16,
  },
});
