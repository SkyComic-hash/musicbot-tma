import React from 'react';
import { Track, MusicSource } from '../types/music';
import { usePlayer } from '../context/PlayerContext';
import { Play, MoreVertical, CloudCheck, Download, Loader2, Sparkles } from 'lucide-react';

interface TrackItemProps {
  track: Track;
}

export const TrackItem: React.FC<TrackItemProps> = ({ track }) => {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    uploadTrackToCache,
    openOptions,
  } = usePlayer();

  const isCurrent = currentTrack?.id === track.id;

  const sourceBadge = (source: MusicSource) => {
    switch (source) {
      case 'spotify':
        return (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[#1DB954]/15 text-[#1DB954] border border-[#1DB954]/25 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]" />
            Spotify
          </span>
        );
      case 'yandex':
        return (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[#FFCC00]/15 text-[#FFCC00] border border-[#FFCC00]/25 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFCC00]" />
            Яндекс
          </span>
        );
      case 'youtube':
        return (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[#FF0000]/15 text-[#FF0000] border border-[#FF0000]/25 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000]" />
            YouTube
          </span>
        );
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      onClick={() => playTrack(track)}
      className={`group relative flex items-center gap-3 p-2.5 rounded-2xl transition-all duration-200 cursor-pointer ${
        isCurrent
          ? 'bg-white/10 border border-white/15 shadow-md backdrop-blur-md'
          : 'hover:bg-white/5 border border-transparent active:bg-white/[0.08]'
      }`}
    >
      {/* Cover Image & Play/Pause overlay */}
      <div className="relative w-13 h-13 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
        <img
          src={track.coverUrl}
          alt={track.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
            isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          {isCurrent && isPlaying ? (
            <div className="flex items-end gap-0.5 h-4">
              <span className="w-1 bg-white rounded-full animate-equalizer-1" />
              <span className="w-1 bg-white rounded-full animate-equalizer-2" />
              <span className="w-1 bg-white rounded-full animate-equalizer-3" />
            </div>
          ) : (
            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
          )}
        </div>
      </div>

      {/* Track Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h4
            className={`text-xs font-semibold truncate ${
              isCurrent ? 'text-blue-400' : 'text-white'
            }`}
          >
            {track.title}
          </h4>
          {track.isFavorite && (
            <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
          )}
        </div>
        <p className="text-[11px] text-tg-hint truncate mt-0.5">{track.artist}</p>
        <div className="flex items-center gap-2 mt-1.5">
          {sourceBadge(track.source)}
          <span className="text-[10px] text-tg-hint">{formatDuration(track.duration)}</span>
        </div>
      </div>

      {/* Cache Status & Actions */}
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        {/* Cache status button */}
        {track.cacheStatus === 'cached' ? (
          <a
            href={track.telegramPostUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            title="Выгружено в Telegram-канал"
            className="p-2 rounded-xl text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all"
          >
            <CloudCheck className="w-4 h-4" />
          </a>
        ) : track.cacheStatus === 'uploading' ? (
          <div
            title="Выгрузка в Telegram..."
            className="p-2 rounded-xl text-blue-400 bg-blue-500/10"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        ) : (
          <button
            onClick={() => uploadTrackToCache(track.id)}
            title="Кешировать в Telegram"
            className="p-2 rounded-xl text-tg-hint hover:text-white bg-white/5 hover:bg-white/10 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
          </button>
        )}

        {/* 3-dots Options */}
        <button
          onClick={() => openOptions(track)}
          className="p-2 rounded-xl text-tg-hint hover:text-white hover:bg-white/10 active:scale-95 transition-all"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
