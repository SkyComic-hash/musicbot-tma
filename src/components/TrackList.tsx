import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { TrackItem } from './TrackItem';
import { Music2 } from 'lucide-react';

export const TrackList: React.FC = () => {
  const { filteredTracks } = usePlayer();

  if (filteredTracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-tg-hint mb-3">
          <Music2 className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-white">Треки не найдены</h3>
        <p className="text-xs text-tg-hint mt-1 max-w-xs">
          Попробуйте изменить поисковый запрос или переключить категорию фильтров
        </p>
      </div>
    );
  }

  return (
    <div className="px-3 mt-3 pb-28 space-y-1">
      {filteredTracks.map((track) => (
        <TrackItem key={track.id} track={track} />
      ))}
    </div>
  );
};
