import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  CloudCheck,
  Download,
  Loader2,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FullPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isShuffle,
    isRepeat,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite,
    uploadTrackToCache,
    isFullPlayerOpen,
    setIsFullPlayerOpen,
    addToast,
  } = usePlayer();

  if (!isFullPlayerOpen || !currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getSourceColor = () => {
    switch (currentTrack.source) {
      case 'spotify':
        return '#1DB954';
      case 'yandex':
        return '#FFCC00';
      case 'youtube':
        return '#FF0000';
      default:
        return '#3b82f6';
    }
  };

  const sourceColor = getSourceColor();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsFullPlayerOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Player Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          drag="y"
          dragConstraints={{ top: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.y > 140) {
              setIsFullPlayerOpen(false);
            }
          }}
          className="relative w-full h-[94vh] bg-[#0d1117] border-t border-white/10 rounded-t-4xl px-6 pt-3 pb-8 flex flex-col justify-between overflow-hidden shadow-2xl"
        >
          {/* Top Drag Handle & Bar */}
          <div>
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsFullPlayerOpen(false)}
                className="p-2 -ml-2 rounded-full text-tg-hint hover:text-white transition-colors"
              >
                <ChevronDown className="w-6 h-6" />
              </button>
              <div className="text-center">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-tg-hint">
                  Сейчас играет
                </span>
                <p className="text-xs font-medium text-white truncate max-w-[200px]">
                  {currentTrack.album}
                </p>
              </div>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: currentTrack.title,
                      text: `Слушаю ${currentTrack.title} — ${currentTrack.artist}`,
                    });
                  } else {
                    addToast('Ссылка на трек скопирована!', 'info');
                  }
                }}
                className="p-2 -mr-2 rounded-full text-tg-hint hover:text-white transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Glowing Album Art */}
          <div className="relative my-auto flex flex-col items-center">
            {/* Dynamic Ambient Glow */}
            <div
              className="absolute -inset-4 rounded-3xl opacity-35 blur-3xl transition-colors duration-700 pointer-events-none"
              style={{ backgroundColor: sourceColor }}
            />

            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden shadow-2xl border border-white/15">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Dynamic Sound Visualizer */}
            <div className="flex items-end justify-center gap-1.5 h-6 mt-6">
              {[...Array(12)].map((_, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isPlaying ? 'opacity-90' : 'opacity-20 h-1.5'
                  }`}
                  style={{
                    backgroundColor: sourceColor,
                    height: isPlaying ? `${Math.sin(i + currentTime) * 40 + 50}%` : '6px',
                    animation: isPlaying
                      ? `equalizer 0.${6 + (i % 5)}s ease-in-out infinite alternate`
                      : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Bottom Area: Metadata, Seekbar, Controls */}
          <div className="space-y-5">
            {/* Title & Artist & Favorite */}
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1 mr-3">
                <h2 className="text-xl font-bold text-white truncate leading-tight">
                  {currentTrack.title}
                </h2>
                <p className="text-sm text-tg-hint truncate mt-0.5">{currentTrack.artist}</p>
              </div>
              <button
                onClick={() => toggleFavorite(currentTrack.id)}
                className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 active:scale-90 transition-all"
              >
                <Heart
                  className={`w-6 h-6 ${
                    currentTrack.isFavorite ? 'text-rose-500 fill-rose-500' : 'text-tg-hint'
                  }`}
                />
              </button>
            </div>

            {/* Seek Bar */}
            <div className="space-y-1.5">
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = clickX / rect.width;
                  seek(ratio * duration);
                }}
                className="relative h-2 bg-white/10 rounded-full cursor-pointer group"
              >
                <div
                  className="h-full rounded-full transition-all duration-150"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: sourceColor,
                  }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 -ml-2 w-4 h-4 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform"
                  style={{ left: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-tg-hint">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between px-2">
              <button
                onClick={toggleShuffle}
                className={`p-2 transition-colors ${
                  isShuffle ? 'text-blue-400' : 'text-tg-hint hover:text-white'
                }`}
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button
                onClick={prevTrack}
                className="p-2 text-white hover:text-white/80 active:scale-90 transition-all"
              >
                <SkipBack className="w-7 h-7 fill-white" />
              </button>

              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-xl active:scale-95 transition-all"
                style={{
                  boxShadow: `0 0 28px ${sourceColor}50`,
                }}
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-black" />
                ) : (
                  <Play className="w-7 h-7 fill-black ml-1" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="p-2 text-white hover:text-white/80 active:scale-90 transition-all"
              >
                <SkipForward className="w-7 h-7 fill-white" />
              </button>

              <button
                onClick={toggleRepeat}
                className={`p-2 transition-colors ${
                  isRepeat ? 'text-blue-400' : 'text-tg-hint hover:text-white'
                }`}
              >
                <Repeat className="w-5 h-5" />
              </button>
            </div>

            {/* Storage status & Source Info */}
            <div className="pt-2 flex items-center justify-between text-xs border-t border-white/5">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: sourceColor }}
                />
                <span className="text-tg-hint uppercase tracking-wider text-[10px] font-semibold">
                  {currentTrack.source === 'spotify'
                    ? 'Spotify Premium'
                    : currentTrack.source === 'yandex'
                    ? 'Яндекс.Плюс'
                    : 'YouTube Music'}
                </span>
              </div>

              {currentTrack.cacheStatus === 'cached' ? (
                <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full text-[11px] font-medium">
                  <CloudCheck className="w-3.5 h-3.5" />
                  <span>Кешировано в канале</span>
                </div>
              ) : currentTrack.cacheStatus === 'uploading' ? (
                <div className="flex items-center gap-1.5 text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full text-[11px] font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Выгрузка в Telegram...</span>
                </div>
              ) : (
                <button
                  onClick={() => uploadTrackToCache(currentTrack.id)}
                  className="flex items-center gap-1.5 text-tg-hint hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Выгрузить в канал</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
