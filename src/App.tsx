import React, { useEffect } from 'react';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { Header } from './components/Header';
import { StorageBanner } from './components/StorageBanner';
import { SearchAndFilters } from './components/SearchAndFilters';
import { TrackList } from './components/TrackList';
import { ThemesView } from './components/ThemesView';
import { MiniPlayer } from './components/MiniPlayer';
import { FullPlayer } from './components/FullPlayer';
import { TrackOptionsModal } from './components/TrackOptionsModal';
import { InstructionModal } from './components/InstructionModal';
import { AddTrackModal } from './components/AddTrackModal';
import { ToastContainer } from './components/ToastContainer';

const MainLayout: React.FC = () => {
  const { mainTab, isAddModalOpen, setIsAddModalOpen } = usePlayer();

  useEffect(() => {
    // Initialize Telegram WebApp SDK if running inside Telegram
    const tg = (window as unknown as { Telegram?: { WebApp?: { ready: () => void; expand: () => void; enableClosingConfirmation: () => void } } }).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.enableClosingConfirmation();
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col max-w-md mx-auto shadow-2xl relative overflow-x-hidden">
      <ToastContainer />
      <Header />
      <StorageBanner />

      {/* View switching */}
      {mainTab === 'themes' ? (
        <ThemesView />
      ) : (
        <>
          <SearchAndFilters />
          <TrackList />
        </>
      )}

      {/* Players & Modals */}
      <MiniPlayer />
      <FullPlayer />
      <TrackOptionsModal />
      <InstructionModal />
      <AddTrackModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PlayerProvider>
      <MainLayout />
    </PlayerProvider>
  );
};

export default App;
