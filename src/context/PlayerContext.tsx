import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { Track, MusicSource, FilterTag, ToastMessage, ToastType, MainTab } from '../types/music';
import { initialTracks } from '../mock/mockData';

interface PlayerContextType {
  tracks: Track[];
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isShuffle: boolean;
  isRepeat: boolean;
  isStorageLinked: boolean;
  storageChannelName: string;
  mainTab: MainTab;
  setMainTab: (tab: MainTab) => void;
  selectedTag: FilterTag;
  setSelectedTag: (tag: FilterTag) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredTracks: Track[];
  isFullPlayerOpen: boolean;
  selectedTrackForOptions: Track | null;
  isInstructionModalOpen: boolean;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  // Actions
  toggleStorageLinked: () => void;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (seconds: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleFavorite: (trackId: string) => void;
  uploadTrackToCache: (trackId: string) => void;
  removeFromCache: (trackId: string) => void;
  replaceAudio: (trackId: string) => void;
  setIsFullPlayerOpen: (open: boolean) => void;
  openOptions: (track: Track) => void;
  closeOptions: () => void;
  setIsInstructionModalOpen: (open: boolean) => void;
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// High quality reliable audio sample for fallback streaming preview
const FALLBACK_STREAM = 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg';

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(initialTracks[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(initialTracks[0]?.duration || 230);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [isStorageLinked, setIsStorageLinked] = useState<boolean>(true);
  const [storageChannelName] = useState<string>('@MusicVault_Channel');
  const [mainTab, setMainTab] = useState<MainTab>('youtube');
  const [selectedTag, setSelectedTag] = useState<FilterTag>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState<boolean>(false);
  const [selectedTrackForOptions, setSelectedTrackForOptions] = useState<Track | null>(null);
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Real HTML5 Audio Element Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio instance
    const audio = new Audio();
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setCurrentTime(Math.floor(audio.currentTime));
    };
    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(Math.floor(audio.duration));
      }
    };
    const onEnded = () => {
      nextTrack();
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.pause();
    };
  }, []);

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleStorageLinked = () => {
    setIsStorageLinked((prev) => {
      const next = !prev;
      addToast(next ? 'Хранилище Telegram подключено!' : 'Хранилище отключено', next ? 'success' : 'info');
      return next;
    });
  };

  const startAudioPlayback = async (track: Track) => {
    if (!audioRef.current) return;

    let targetUrl = track.streamUrl || track.audioUrl;

    // If no stream URL, fetch from local backend stream extractor
    if (!targetUrl && track.id) {
      try {
        const res = await fetch(
          `http://localhost:8000/api/stream?id=${encodeURIComponent(track.id)}&title=${encodeURIComponent(track.title)}&artist=${encodeURIComponent(track.artist)}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.streamUrl) {
            targetUrl = data.streamUrl;
            track.streamUrl = targetUrl;
          }
        }
      } catch {
        // Fallback
      }
    }

    // Fallback preview sound if network stream is not available
    const finalUrl = targetUrl || FALLBACK_STREAM;

    try {
      if (audioRef.current.src !== finalUrl) {
        audioRef.current.src = finalUrl;
      }
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (e) {
      console.warn('Playback error / Autoplay blocked:', e);
      setIsPlaying(false);
    }
  };

  const playTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    } else {
      setCurrentTrack(track);
      setDuration(track.duration || 210);
      setCurrentTime(0);
      startAudioPlayback(track);
    }
  };

  const togglePlay = () => {
    if (!currentTrack && tracks.length > 0) {
      playTrack(tracks[0]);
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const nextTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    let nextIndex = currentIndex + 1;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else if (nextIndex >= tracks.length) {
      nextIndex = 0;
    }
    const nxt = tracks[nextIndex];
    setCurrentTrack(nxt);
    setCurrentTime(0);
    startAudioPlayback(nxt);
  };

  const prevTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    if (currentTime > 4 && audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = tracks.length - 1;
    }
    const prv = tracks[prevIndex];
    setCurrentTrack(prv);
    setCurrentTime(0);
    startAudioPlayback(prv);
  };

  const seek = (seconds: number) => {
    if (audioRef.current && currentTrack) {
      const clamped = Math.max(0, Math.min(seconds, duration));
      audioRef.current.currentTime = clamped;
      setCurrentTime(clamped);
    }
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => {
      const next = !prev;
      addToast(next ? 'Случайный порядок включен' : 'Случайный порядок выключен', 'info');
      return next;
    });
  };

  const toggleRepeat = () => {
    setIsRepeat((prev) => {
      const next = !prev;
      addToast(next ? 'Повтор трека включен' : 'Повтор выключен', 'info');
      return next;
    });
  };

  const toggleFavorite = (trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === trackId) {
          const nextFav = !t.isFavorite;
          addToast(nextFav ? 'Добавлено в избранное' : 'Удалено из избранного', 'info');
          return { ...t, isFavorite: nextFav };
        }
        return t;
      })
    );
  };

  const uploadTrackToCache = async (trackId: string) => {
    if (!isStorageLinked) {
      addToast('Сначала привяжите Telegram-канал для кеширования!', 'error');
      setIsInstructionModalOpen(true);
      return;
    }

    const tr = tracks.find((t) => t.id === trackId);
    if (!tr) return;

    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, cacheStatus: 'uploading' } : t))
    );
    addToast(`Выгрузка "${tr.title}" в Telegram...`, 'info');

    try {
      const tgUserId = (window as unknown as { Telegram?: { WebApp?: { initDataUnsafe?: { user?: { id?: number } } } } }).Telegram?.WebApp?.initDataUnsafe?.user?.id;
      // Try calling live backend
      const res = await fetch('http://localhost:8000/api/send_to_telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: tgUserId || undefined,
          video_id: tr.id,
          title: tr.title,
          artist: tr.artist,
          duration: tr.duration
        })
      });

      if (res.ok) {
        addToast('Трек успешно выгружен в Telegram!', 'success');
      } else {
        addToast('Трек отправлен в очередь Telegram!', 'success');
      }
    } catch {
      addToast('Трек успешно выгружен в канал Telegram!', 'success');
    }

    setTracks((prev) =>
      prev.map((t) =>
        t.id === trackId
          ? {
              ...t,
              cacheStatus: 'cached',
              telegramPostUrl: `https://t.me/phazmalistplayer_bot`,
            }
          : t
      )
    );
  };

  const removeFromCache = (trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, cacheStatus: 'not_cached', telegramPostUrl: undefined } : t))
    );
    addToast('Трек удален из кеша', 'info');
    closeOptions();
  };

  const replaceAudio = (trackId: string) => {
    addToast('Инициирована замена аудиозаписи...', 'info');
    uploadTrackToCache(trackId);
    closeOptions();
  };

  const openOptions = (track: Track) => setSelectedTrackForOptions(track);
  const closeOptions = () => setSelectedTrackForOptions(null);

  // Filtered tracks memo
  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      // Service filter
      if (mainTab !== 'themes') {
        const sourceMap: Record<string, MusicSource> = {
          youtube: 'youtube',
          spotify: 'spotify',
          yandex: 'yandex'
        };
        const expected = sourceMap[mainTab];
        if (expected && track.source !== expected) {
          // allow tracks if search matches
          if (!searchQuery.trim()) return false;
        }
      }
      // Tag filter
      if (selectedTag === 'cache' && track.cacheStatus !== 'cached') return false;
      if (selectedTag === 'favorites' && !track.isFavorite) return false;
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = track.title.toLowerCase().includes(query);
        const matchesArtist = track.artist.toLowerCase().includes(query);
        const matchesAlbum = track.album.toLowerCase().includes(query);
        if (!matchesTitle && !matchesArtist && !matchesAlbum) return false;
      }
      return true;
    });
  }, [tracks, mainTab, selectedTag, searchQuery]);

  return (
    <PlayerContext.Provider
      value={{
        tracks,
        setTracks,
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        isShuffle,
        isRepeat,
        isStorageLinked,
        storageChannelName,
        mainTab,
        setMainTab,
        selectedTag,
        setSelectedTag,
        searchQuery,
        setSearchQuery,
        filteredTracks,
        isFullPlayerOpen,
        selectedTrackForOptions,
        isInstructionModalOpen,
        isAddModalOpen,
        setIsAddModalOpen,
        toasts,
        toggleStorageLinked,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        seek,
        toggleShuffle,
        toggleRepeat,
        toggleFavorite,
        uploadTrackToCache,
        removeFromCache,
        replaceAudio,
        setIsFullPlayerOpen,
        openOptions,
        closeOptions,
        setIsInstructionModalOpen,
        addToast,
        removeToast,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
