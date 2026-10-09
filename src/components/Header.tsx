import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { mockUser } from '../mock/mockData';
import { MainTab } from '../types/music';
import { CheckCircle2, AlertCircle, Plus } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    isStorageLinked,
    toggleStorageLinked,
    setIsInstructionModalOpen,
    mainTab,
    setMainTab,
    setIsAddModalOpen,
  } = usePlayer();

  const tabs: { id: MainTab; label: string; activeColor: string }[] = [
    { id: 'themes', label: '🎨 Темы', activeColor: 'bg-purple-600/30 text-purple-200 border-purple-500/40' },
    { id: 'youtube', label: '🔴 YouTube', activeColor: 'bg-[#FF0000]/25 text-[#FF6B6B] border-[#FF0000]/40' },
    { id: 'spotify', label: '🟢 Spotify', activeColor: 'bg-[#1DB954]/25 text-[#1DB954] border-[#1DB954]/40' },
    { id: 'yandex', label: '🟡 Яндекс', activeColor: 'bg-[#FFCC00]/25 text-[#FFD633] border-[#FFCC00]/40' },
  ];

  return (
    <header className="sticky top-0 z-30 pt-3 pb-2 px-4 glass-panel border-b border-white/5">
      {/* Top row: Profile, Storage status & Add button */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={mockUser.avatarUrl}
              alt={mockUser.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0d1117]" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white leading-tight flex items-center gap-1.5">
              {mockUser.name}
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-normal">TMA</span>
            </h1>
            <p className="text-xs text-tg-hint">{mockUser.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Storage status button */}
          <button
            onClick={() => {
              if (!isStorageLinked) {
                setIsInstructionModalOpen(true);
              } else {
                toggleStorageLinked();
              }
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-all active:scale-95 border ${
              isStorageLinked
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25 animate-pulse'
            }`}
          >
            {isStorageLinked ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Канал</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Привязать</span>
              </>
            )}
          </button>

          {/* Add Track Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-[11px] font-semibold transition-all shadow-md shadow-blue-950"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Добавить</span>
          </button>
        </div>
      </div>

      {/* Main Tabs (Темы, YouTube, Spotify, Яндекс) */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
        {tabs.map((tab) => {
          const isActive = mainTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setMainTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? `${tab.activeColor} shadow-sm`
                  : 'bg-white/5 text-tg-hint border-transparent hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
