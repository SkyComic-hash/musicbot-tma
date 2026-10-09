import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { X, RefreshCw, Trash2, ExternalLink, Heart, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TrackOptionsModal: React.FC = () => {
  const {
    selectedTrackForOptions,
    closeOptions,
    uploadTrackToCache,
    removeFromCache,
    replaceAudio,
    toggleFavorite,
  } = usePlayer();

  if (!selectedTrackForOptions) return null;

  const track = selectedTrackForOptions;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={closeOptions} />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="relative w-full max-w-lg glass-modal rounded-t-3xl p-5 text-white max-h-[80vh] overflow-y-auto"
        >
          {/* Header Track Info */}
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/10">
            <img
              src={track.coverUrl}
              alt={track.title}
              className="w-12 h-12 rounded-xl object-cover shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white truncate">{track.title}</h3>
              <p className="text-xs text-tg-hint truncate">{track.artist}</p>
            </div>
            <button
              onClick={closeOptions}
              className="p-1.5 rounded-full bg-white/10 text-tg-hint hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action List */}
          <div className="space-y-1.5">
            {/* Favorite toggle */}
            <button
              onClick={() => {
                toggleFavorite(track.id);
                closeOptions();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all text-xs font-medium"
            >
              <Heart
                className={`w-4 h-4 ${track.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-tg-hint'}`}
              />
              <span>{track.isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}</span>
            </button>

            {/* Telegram Post link if cached */}
            {track.cacheStatus === 'cached' && track.telegramPostUrl && (
              <a
                href={track.telegramPostUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeOptions}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all text-xs font-medium text-blue-400"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Открыть пост в Telegram-канале</span>
              </a>
            )}

            {/* Upload to cache if not cached */}
            {track.cacheStatus === 'not_cached' && (
              <button
                onClick={() => {
                  uploadTrackToCache(track.id);
                  closeOptions();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all text-xs font-medium text-emerald-400"
              >
                <Download className="w-4 h-4" />
                <span>Выгрузить в Telegram-канал</span>
              </button>
            )}

            {/* Replace Audio in channel */}
            <button
              onClick={() => replaceAudio(track.id)}
              className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all text-xs font-medium text-amber-300"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Заменить аудиозапись в канале</span>
            </button>

            {/* Delete from cache */}
            {track.cacheStatus === 'cached' && (
              <button
                onClick={() => removeFromCache(track.id)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 active:scale-[0.98] transition-all text-xs font-medium text-rose-400"
              >
                <Trash2 className="w-4 h-4" />
                <span>Удалить аудиозапись из кеша</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
