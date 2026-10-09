import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { PlaylistTheme, Track } from '../types/music';
import { Play, Download, Layers } from 'lucide-react';

const STATIC_THEMES: PlaylistTheme[] = [
  {
    id: 'phonk',
    title: 'Drift Phonk',
    description: 'Мощный бас, ковбеллы и энергетика ночного дрифта',
    coverUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=500&q=80',
    tracks: [
      { title: 'Close Eyes', artist: 'DVRST', query: 'DVRST Close Eyes' },
      { title: 'Murder In My Mind', artist: 'KORDHELL', query: 'KORDHELL Murder In My Mind' },
      { title: 'Flare', artist: 'Hensonn', query: 'Hensonn Flare' },
      { title: 'METAMORPHOSIS', artist: 'INTERWORLD', query: 'INTERWORLD METAMORPHOSIS' },
    ]
  },
  {
    id: 'synthwave',
    title: 'Cyberpunk & Synthwave',
    description: 'Неоновый синтвейв, 80-е и атмосфера Найт-Сити',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80',
    tracks: [
      { title: 'Midnight City', artist: 'M83', query: 'M83 Midnight City' },
      { title: 'Resonance', artist: 'HOME', query: 'HOME Resonance' },
      { title: 'Nightcall', artist: 'Kavinsky', query: 'Kavinsky Nightcall' },
      { title: 'Starboy', artist: 'The Weeknd', query: 'The Weeknd Starboy' },
    ]
  },
  {
    id: 'lofi',
    title: 'Lo-Fi Chill & Study',
    description: 'Мягкие ламповые биты для концентрации и кодинга',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80',
    tracks: [
      { title: 'controlla', artist: 'idealism', query: 'idealism controlla' },
      { title: 'Twilight', artist: 'Kupla', query: 'Kupla Twilight' },
      { title: 'Affection', artist: 'Jinsang', query: 'Jinsang Affection' },
    ]
  },
  {
    id: 'rock',
    title: 'Rock Legends',
    description: 'Бессмертный драйв, гитарные риффы и классика',
    coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=500&q=80',
    tracks: [
      { title: 'Прыгну со скалы', artist: 'Король и Шут', query: 'Король и Шут Прыгну со скалы' },
      { title: 'In the End', artist: 'Linkin Park', query: 'Linkin Park In the End' },
      { title: 'Группа крови', artist: 'Кино', query: 'Кино Группа крови' },
      { title: 'Smells Like Teen Spirit', artist: 'Nirvana', query: 'Nirvana Smells Like Teen Spirit' },
    ]
  },
  {
    id: 'night_drive',
    title: 'Night Drive & Darkwave',
    description: 'Пост-панк, меланхолия и пустые ночные трассы',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=500&q=80',
    tracks: [
      { title: 'After Dark', artist: 'Mr.Kitty', query: 'Mr.Kitty After Dark' },
      { title: 'Судно', artist: 'Молчат Дома', query: 'Молчат Дома Судно' },
      { title: 'The Perfect Girl', artist: 'Mareux', query: 'Mareux The Perfect Girl' },
    ]
  }
];

export const ThemesView: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<PlaylistTheme | null>(null);
  const { playTrack, uploadTrackToCache, setTracks, addToast } = usePlayer();

  const handlePlayTheme = (theme: PlaylistTheme) => {
    // Generate tracks from theme
    const themeTracks: Track[] = theme.tracks.map((t, idx) => ({
      id: `${theme.id}_${idx}`,
      title: t.title,
      artist: t.artist,
      album: theme.title,
      duration: 210,
      coverUrl: theme.coverUrl,
      source: 'youtube',
      cacheStatus: 'not_cached'
    }));

    setTracks(prev => {
      const existingIds = new Set(prev.map(item => item.id));
      const fresh = themeTracks.filter(item => !existingIds.has(item.id));
      return [...fresh, ...prev];
    });

    playTrack(themeTracks[0]);
    addToast(`Запущена тема: ${theme.title}`, 'success');
  };

  return (
    <div className="px-4 mt-3 pb-28 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-blue-400" />
          Тематические подборки
        </h2>
        <span className="text-[11px] text-tg-hint">5 тем доступно</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {STATIC_THEMES.map((theme) => {
          const isSelected = selectedTheme?.id === theme.id;
          return (
            <div
              key={theme.id}
              className="relative overflow-hidden rounded-2xl glass-card border border-white/10 transition-all hover:border-white/20 p-3.5"
            >
              <div className="flex items-center gap-3">
                <img
                  src={theme.coverUrl}
                  alt={theme.title}
                  className="w-16 h-16 rounded-xl object-cover shadow-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{theme.title}</h3>
                  <p className="text-xs text-tg-hint line-clamp-1 mt-0.5">{theme.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handlePlayTheme(theme)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium active:scale-95 transition-all shadow-sm"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Слушать подборку</span>
                    </button>
                    <button
                      onClick={() => setSelectedTheme(isSelected ? null : theme)}
                      className="text-xs text-tg-hint hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      {isSelected ? 'Скрыть треки' : `Треки (${theme.tracks.length})`}
                    </button>
                  </div>
                </div>
              </div>

              {/* Collapsible tracks list */}
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                  {theme.tracks.map((t, idx) => {
                    const trackObj: Track = {
                      id: `${theme.id}_${idx}`,
                      title: t.title,
                      artist: t.artist,
                      album: theme.title,
                      duration: 210,
                      coverUrl: theme.coverUrl,
                      source: 'youtube',
                      cacheStatus: 'not_cached'
                    };
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xs"
                      >
                        <div className="min-w-0 flex-1 mr-2">
                          <p className="font-semibold text-white truncate">{t.title}</p>
                          <p className="text-[11px] text-tg-hint truncate">{t.artist}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => playTrack(trackObj)}
                            className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 active:scale-95 transition-all"
                            title="Слушать"
                          >
                            <Play className="w-3.5 h-3.5 fill-blue-400" />
                          </button>
                          <button
                            onClick={() => uploadTrackToCache(trackObj.id)}
                            className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 active:scale-95 transition-all"
                            title="Выгрузить в Telegram"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
