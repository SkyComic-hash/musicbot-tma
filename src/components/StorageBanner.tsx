import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { ShieldAlert, ArrowRight, HelpCircle } from 'lucide-react';

export const StorageBanner: React.FC = () => {
  const { isStorageLinked, setIsInstructionModalOpen } = usePlayer();

  if (isStorageLinked) return null;

  return (
    <div className="mx-4 mt-3 p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-rose-900/20 to-purple-950/30 border border-rose-500/30 shadow-lg backdrop-blur-md">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-rose-200">Хранилище не подключено</h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold">
              NO_ACTIVE_GROUP
            </span>
          </div>
          <p className="text-xs text-rose-200/70 mt-1 leading-relaxed">
            Музыка не сможет кешироваться в Telegram-канал без привязанного чата хранилища.
          </p>
          <button
            onClick={() => setIsInstructionModalOpen(true)}
            className="mt-3 flex items-center gap-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 active:scale-95 px-3 py-1.5 rounded-xl transition-all shadow-md shadow-rose-950"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Как привязать канал</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
