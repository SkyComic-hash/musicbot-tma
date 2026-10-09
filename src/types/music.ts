export type MusicSource = 'spotify' | 'yandex' | 'youtube';

export type MainTab = 'themes' | 'youtube' | 'spotify' | 'yandex';

export type CacheStatus = 'not_cached' | 'uploading' | 'cached';

export type FilterTag = 'all' | 'cache' | 'playlists' | 'favorites' | 'recent';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
  source: MusicSource;
  cacheStatus: CacheStatus;
  streamUrl?: string;
  webpageUrl?: string;
  telegramPostUrl?: string;
  audioUrl?: string;
  isFavorite?: boolean;
}

export interface PlaylistTheme {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  tracks: { title: string; artist: string; query: string }[];
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export interface UserProfile {
  name: string;
  username: string;
  avatarUrl: string;
}
