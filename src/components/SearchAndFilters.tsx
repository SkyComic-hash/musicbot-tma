import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Search, X, Cloud, Heart, Clock, ListMusic } from 'lucide-react';
import { FilterTag } from '../types/music';

export const SearchAndFilters: React.FC = () => {
  const { searchQuery, setSearchQuery, selectedTag, setSelectedTag, tracks } = usePlayer();

  const tags: { id: FilterTag; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'all', label: 'Все треки', icon: null, count: tracks.length },
    {
      id: 'cache',
      label: 'Мой кеш',
      icon: <Cloud className="w-3.5 h-3.5" />,
      count: tracks.filter((t) => t.cacheStatus === 'cached').length,
    },
    {
      id: 'favorites',
      label: 'Любимое',
      icon: <Heart className="w-3.5 h-3.5" />,
      count: tracks.filter((t) => t.isFavorite).length,
    },
    { id: 'playlists', label: 'Плейлисты', icon: <ListMusic className="w-3.5 h-3.5" /> },
    { id: 'recent', label: 'Недавние', icon: <Clock className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="px-4 mt-3 space-y-2.5">
      {/* Search Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-tg-hint pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск треков, артистов или альбомов..."
          className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-tg-hint focus:outline-none focus:border-tg-link/50 focus:bg-white/[0.08] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 p-1 rounded-full text-tg-hint hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Horizontal Chips */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1">
        {tags.map((tag) => {
          const isActive = selectedTag === tag.id;
          return (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border active:scale-95 ${
                isActive
                  ? 'bg-blue-600/30 text-blue-300 border-blue-500/40 shadow-sm'
                  : 'bg-white/5 text-tg-hint border-white/5 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tag.icon}
              <span>{tag.label}</span>
              {tag.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive ? 'bg-blue-500/30 text-white' : 'bg-white/10 text-tg-hint'
                  }`}
                >
                  {tag.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
