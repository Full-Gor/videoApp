import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Header, VideoPlayer, Button, Slider } from '../components';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/theme';
import { RootStackParamList, TextOverlay } from '../types';

type AddTextScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddText'>;
type AddTextScreenRouteProp = RouteProp<RootStackParamList, 'AddText'>;

interface AddTextScreenProps {
  navigation: AddTextScreenNavigationProp;
  route: AddTextScreenRouteProp;
}

const TEXT_COLORS = [
  '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
];

const FONT_STYLES = [
  { id: 'normal', name: 'Normal', style: {} },
  { id: 'bold', name: 'Gras', style: { fontWeight: 'bold' } },
  { id: 'italic', name: 'Italique', style: { fontStyle: 'italic' } },
  { id: 'underline', name: 'Souligné', style: { textDecorationLine: 'underline' } },
];

export const AddTextScreen: React.FC<AddTextScreenProps> = ({
  navigation,
  route,
}) => {
  const { video } = route.params;
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [selectedStyle, setSelectedStyle] = useState('normal');
  const [textX, setTextX] = useState(50);
  const [textY, setTextY] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddText = async () => {
    if (!text.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer du texte.');
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Succès',
        'Texte ajouté à la vidéo!',
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
        title="Ajouter du texte"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Video Preview with Text Overlay */}
        <View style={styles.previewContainer}>
          <VideoPlayer uri={video.uri} style={styles.videoPlayer} />
          {text && (
            <View
              style={[
                styles.textOverlay,
                {
                  left: `${textX}%`,
                  top: `${textY}%`,
                },
              ]}
            >
              <Text
                style={[
                  styles.overlayText,
                  {
                    fontSize: fontSize,
                    color: selectedColor,
                    ...(FONT_STYLES.find(s => s.id === selectedStyle)?.style as any),
                  },
                ]}
              >
                {text}
              </Text>
            </View>
          )}
        </View>

        {/* Text Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Texte</Text>
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={setText}
            placeholder="Entrez votre texte ici..."
            placeholderTextColor={COLORS.textMuted}
            multiline
          />
        </View>

        {/* Font Size */}
        <View style={styles.section}>
          <Slider
            label="Taille de police"
            value={fontSize}
            min={12}
            max={72}
            step={2}
            onValueChange={setFontSize}
            formatValue={(v) => `${v}px`}
          />
        </View>

        {/* Text Color */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Couleur</Text>
          <View style={styles.colorGrid}>
            {TEXT_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor,
                ]}
                onPress={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color={color === '#FFFFFF' ? '#000000' : '#FFFFFF'}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Font Style */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Style</Text>
          <View style={styles.styleGrid}>
            {FONT_STYLES.map((style) => (
              <TouchableOpacity
                key={style.id}
                style={[
                  styles.styleOption,
                  selectedStyle === style.id && styles.selectedStyle,
                ]}
                onPress={() => setSelectedStyle(style.id)}
              >
                <Text
                  style={[
                    styles.styleText,
                    style.style as any,
                    selectedStyle === style.id && styles.selectedStyleText,
                  ]}
                >
                  {style.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Position */}
        <View style={styles.section}>
          <Slider
            label="Position horizontale"
            value={textX}
            min={0}
            max={100}
            step={1}
            onValueChange={setTextX}
            formatValue={(v) => `${v}%`}
          />
          <Slider
            label="Position verticale"
            value={textY}
            min={0}
            max={100}
            step={1}
            onValueChange={setTextY}
            formatValue={(v) => `${v}%`}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.processingText}>Ajout du texte...</Text>
          </View>
        ) : (
          <Button
            title="Appliquer le texte"
            onPress={handleAddText}
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
    position: 'relative',
  },
  videoPlayer: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  textOverlay: {
    position: 'absolute',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  overlayText: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
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
  textInput: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: COLORS.primary,
  },
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  styleOption: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedStyle: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  styleText: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
  },
  selectedStyleText: {
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
});
