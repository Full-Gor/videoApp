export interface VideoFile {
  uri: string;
  duration: number;
  width: number;
  height: number;
  filename: string;
  type: string;
  size?: number;
}

export interface AudioFile {
  uri: string;
  duration: number;
  filename: string;
}

export interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  startTime: number;
  endTime: number;
}

export interface TrimConfig {
  startTime: number;
  endTime: number;
}

export interface ResizeConfig {
  width: number;
  height: number;
  aspectRatio: string;
}

export interface CompressionConfig {
  quality: 'low' | 'medium' | 'high' | 'ultra';
  bitrate: number;
}

export interface ExportConfig {
  format: 'mp4' | 'mov' | 'avi' | 'webm';
  resolution: '480p' | '720p' | '1080p' | '4k';
  fps: number;
}

export interface EditingTool {
  id: string;
  name: string;
  icon: string;
  description: string;
  screen: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  videos: VideoFile[];
  audioTracks: AudioFile[];
  textOverlays: TextOverlay[];
  thumbnail?: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  TrimVideo: { video: VideoFile };
  MergeVideos: { videos?: VideoFile[] };
  ResizeVideo: { video: VideoFile };
  AddText: { video: VideoFile };
  AddMusic: { video: VideoFile };
  CompressVideo: { video: VideoFile };
  SpeedVideo: { video: VideoFile };
  RotateVideo: { video: VideoFile };
  CropVideo: { video: VideoFile };
  FilterVideo: { video: VideoFile };
  Export: { video: VideoFile; outputUri?: string };
  Projects: undefined;
  Settings: undefined;
  Preview: { uri: string };
};
