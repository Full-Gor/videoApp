import { EditingTool } from '../types';
import { TOOL_COLORS } from './theme';

export const EDITING_TOOLS: EditingTool[] = [
  {
    id: 'trim',
    name: 'Couper',
    icon: 'content-cut',
    description: 'Couper et rogner vos vidéos',
    screen: 'TrimVideo',
    color: TOOL_COLORS.trim,
  },
  {
    id: 'merge',
    name: 'Fusionner',
    icon: 'call-merge',
    description: 'Combiner plusieurs vidéos',
    screen: 'MergeVideos',
    color: TOOL_COLORS.merge,
  },
  {
    id: 'resize',
    name: 'Redimensionner',
    icon: 'aspect-ratio',
    description: 'Changer la taille et le ratio',
    screen: 'ResizeVideo',
    color: TOOL_COLORS.resize,
  },
  {
    id: 'text',
    name: 'Texte',
    icon: 'format-text',
    description: 'Ajouter du texte et titres',
    screen: 'AddText',
    color: TOOL_COLORS.text,
  },
  {
    id: 'music',
    name: 'Musique',
    icon: 'music-note',
    description: 'Ajouter de la musique',
    screen: 'AddMusic',
    color: TOOL_COLORS.music,
  },
  {
    id: 'compress',
    name: 'Compresser',
    icon: 'compress',
    description: 'Réduire la taille du fichier',
    screen: 'CompressVideo',
    color: TOOL_COLORS.compress,
  },
  {
    id: 'speed',
    name: 'Vitesse',
    icon: 'speedometer',
    description: 'Accélérer ou ralentir',
    screen: 'SpeedVideo',
    color: TOOL_COLORS.speed,
  },
  {
    id: 'rotate',
    name: 'Rotation',
    icon: 'rotate-right',
    description: 'Pivoter et retourner',
    screen: 'RotateVideo',
    color: TOOL_COLORS.rotate,
  },
  {
    id: 'crop',
    name: 'Recadrer',
    icon: 'crop',
    description: 'Recadrer la vidéo',
    screen: 'CropVideo',
    color: TOOL_COLORS.crop,
  },
  {
    id: 'filter',
    name: 'Filtres',
    icon: 'auto-fix',
    description: 'Appliquer des filtres',
    screen: 'FilterVideo',
    color: TOOL_COLORS.filter,
  },
];

export const ASPECT_RATIOS = [
  { label: '16:9', value: '16:9', width: 1920, height: 1080 },
  { label: '9:16', value: '9:16', width: 1080, height: 1920 },
  { label: '1:1', value: '1:1', width: 1080, height: 1080 },
  { label: '4:3', value: '4:3', width: 1440, height: 1080 },
  { label: '4:5', value: '4:5', width: 1080, height: 1350 },
  { label: '21:9', value: '21:9', width: 2560, height: 1080 },
];

export const VIDEO_QUALITIES = [
  { label: '480p (SD)', value: '480p', height: 480 },
  { label: '720p (HD)', value: '720p', height: 720 },
  { label: '1080p (Full HD)', value: '1080p', height: 1080 },
  { label: '4K (Ultra HD)', value: '4k', height: 2160 },
];

export const COMPRESSION_PRESETS = [
  { label: 'Basse qualité', value: 'low', bitrate: 1000000 },
  { label: 'Qualité moyenne', value: 'medium', bitrate: 2500000 },
  { label: 'Haute qualité', value: 'high', bitrate: 5000000 },
  { label: 'Ultra qualité', value: 'ultra', bitrate: 10000000 },
];

export const SPEED_OPTIONS = [
  { label: '0.25x', value: 0.25 },
  { label: '0.5x', value: 0.5 },
  { label: '0.75x', value: 0.75 },
  { label: '1x', value: 1 },
  { label: '1.25x', value: 1.25 },
  { label: '1.5x', value: 1.5 },
  { label: '2x', value: 2 },
  { label: '3x', value: 3 },
];

export const VIDEO_FILTERS = [
  { id: 'none', name: 'Original', filter: '' },
  { id: 'grayscale', name: 'Noir & Blanc', filter: 'grayscale' },
  { id: 'sepia', name: 'Sépia', filter: 'sepia' },
  { id: 'vivid', name: 'Vif', filter: 'saturate(1.5)' },
  { id: 'cold', name: 'Froid', filter: 'hue-rotate(180deg)' },
  { id: 'warm', name: 'Chaud', filter: 'sepia(0.3)' },
  { id: 'vintage', name: 'Vintage', filter: 'sepia(0.5) contrast(1.1)' },
  { id: 'dramatic', name: 'Dramatique', filter: 'contrast(1.3) saturate(0.8)' },
];
