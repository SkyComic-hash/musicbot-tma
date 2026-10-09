import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, SkipForward } from 'lucide-react';

export const MiniPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    nextTrack,
    setIsFullPlayerOpen,
  } = usePlayer();

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-3 left-3 right-3 z-40">
      <div
        onClick={() => setIsFullPlayerOpen(true)}
        className="relative overflow-hidden glass-panel rounded-2xl p-2.5 flex items-center gap-3 shadow-2xl border border-white/10 active:scale-[0.99] transition-transform cursor-pointer"
      >
        {/* Track Cover */}
        <div className="relative w-11 h-11 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 bg-white rounded-full animate-equalizer-1" />
                <span className="w-0.5 bg-white rounded-full animate-equalizer-2" />
                <span className="w-0.5 bg-white rounded-full animate-equalizer-3" />
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-white truncate">{currentTrack.title}</h4>
          <p className="text-[11px] text-tg-hint truncate">{currentTrack.artist}</p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={togglePlay}
            className="p-2.5 rounded-full bg-white text-black hover:bg-white/90 active:scale-90 transition-all shadow-md"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black" />
            ) : (
              <Play className="w-4 h-4 fill-black ml-0.5" />
            )}
          </button>
          <button
            onClick={nextTrack}
            className="p-2 text-tg-hint hover:text-white active:scale-90 transition-all"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Subtle Bottom Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
