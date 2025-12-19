import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '../components';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/theme';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [autoSave, setAutoSave] = useState(true);
  const [highQuality, setHighQuality] = useState(true);
  const [notifications, setNotifications] = useState(false);

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  const renderSettingRow = (
    icon: string,
    title: string,
    subtitle: string,
    rightComponent: React.ReactNode,
  ) => (
    <View style={styles.settingRow}>
      <View style={styles.settingIcon}>
        <MaterialCommunityIcons name={icon as any} size={24} color={COLORS.primary} />
      </View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      {rightComponent}
    </View>
  );

  const renderLinkRow = (
    icon: string,
    title: string,
    onPress: () => void,
  ) => (
    <TouchableOpacity style={styles.linkRow} onPress={onPress}>
      <View style={styles.settingIcon}>
        <MaterialCommunityIcons name={icon as any} size={24} color={COLORS.text} />
      </View>
      <Text style={styles.linkTitle}>{title}</Text>
      <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textMuted} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Paramètres" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderSection(
          'Général',
          <>
            {renderSettingRow(
              'content-save-settings',
              'Sauvegarde automatique',
              'Sauvegarder les projets automatiquement',
              <Switch
                value={autoSave}
                onValueChange={setAutoSave}
                trackColor={{ false: COLORS.surface, true: COLORS.primary }}
                thumbColor={COLORS.text}
              />,
            )}
            {renderSettingRow(
              'quality-high',
              'Export haute qualité',
              'Utiliser la meilleure qualité par défaut',
              <Switch
                value={highQuality}
                onValueChange={setHighQuality}
                trackColor={{ false: COLORS.surface, true: COLORS.primary }}
                thumbColor={COLORS.text}
              />,
            )}
            {renderSettingRow(
              'bell',
              'Notifications',
              'Recevoir des notifications de progression',
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: COLORS.surface, true: COLORS.primary }}
                thumbColor={COLORS.text}
              />,
            )}
          </>,
        )}

        {renderSection(
          'Stockage',
          <>
            {renderLinkRow('folder', 'Dossier d\'export', () => {
              Alert.alert('Info', 'Dossier par défaut: Galerie');
            })}
            {renderLinkRow('delete-sweep', 'Vider le cache', () => {
              Alert.alert(
                'Vider le cache',
                'Voulez-vous supprimer tous les fichiers temporaires ?',
                [
                  { text: 'Annuler', style: 'cancel' },
                  { text: 'Confirmer', onPress: () => Alert.alert('Succès', 'Cache vidé!') },
                ],
              );
            })}
          </>,
        )}

        {renderSection(
          'À propos',
          <>
            {renderLinkRow('information', 'Version de l\'app', () => {
              Alert.alert('Version', 'VideoEdit Pro v1.0.0');
            })}
            {renderLinkRow('file-document', 'Conditions d\'utilisation', () => {
              Alert.alert('Info', 'Ouverture des conditions...');
            })}
            {renderLinkRow('shield-check', 'Politique de confidentialité', () => {
              Alert.alert('Info', 'Ouverture de la politique...');
            })}
            {renderLinkRow('help-circle', 'Aide & Support', () => {
              Alert.alert('Support', 'Contactez-nous à support@videoedit.com');
            })}
            {renderLinkRow('star', 'Noter l\'application', () => {
              Alert.alert('Merci!', 'Votre avis compte beaucoup pour nous.');
            })}
          </>,
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>VideoEdit Pro</Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
          <Text style={styles.footerCopyright}>© 2024 Tous droits réservés</Text>
        </View>
      </ScrollView>
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
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
    marginLeft: SPACING.sm,
  },
  sectionContent: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  settingTitle: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  settingSubtitle: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    marginTop: 2,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  linkTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    marginLeft: SPACING.md,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  footerText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  footerVersion: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    marginTop: SPACING.xs,
  },
  footerCopyright: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    marginTop: SPACING.sm,
  },
});
