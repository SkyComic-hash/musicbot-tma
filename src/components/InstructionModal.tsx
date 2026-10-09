import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { X, CheckCircle, ShieldCheck, Send, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const InstructionModal: React.FC = () => {
  const { isInstructionModalOpen, setIsInstructionModalOpen, toggleStorageLinked, isStorageLinked } = usePlayer();

  if (!isInstructionModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
        {/* Backdrop click to close */}
        <div
          className="absolute inset-0"
          onClick={() => setIsInstructionModalOpen(false)}
        />

        {/* Modal content */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="relative w-full max-w-lg glass-modal rounded-t-3xl p-6 text-white max-h-[85vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-tg-button/20 text-tg-link">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold">Привязка Telegram-хранилища</h2>
                <p className="text-xs text-tg-hint">Инструкция добавления бота в канал</p>
              </div>
            </div>
            <button
              onClick={() => setIsInstructionModalOpen(false)}
              className="p-1.5 rounded-full bg-white/10 text-tg-hint hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Steps */}
          <div className="space-y-4 mb-6">
            {/* Step 1 */}
            <div className="flex gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs">
                1
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
                  Создайте приватный канал
                </p>
                <p className="text-tg-hint mt-1 leading-relaxed">
                  В Telegram нажмите "Создать канал", задайте любое имя (например, <em>Моя Музыка</em>) и выберите тип "Частный".
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                2
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Назначьте бота администратором
                </p>
                <p className="text-tg-hint mt-1 leading-relaxed">
                  Перейдите в настройки канала $\to$ <strong>Администраторы</strong> $\to$ Добавьте нашего бота с правом <strong>публикации сообщений</strong>.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                3
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                  Подтвердите привязку
                </p>
                <p className="text-tg-hint mt-1 leading-relaxed">
                  Отправьте боту команду <code>/set_channel @your_channel</code> или перешлите любой пост из канала в диалог с ботом.
                </p>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (!isStorageLinked) toggleStorageLinked();
                setIsInstructionModalOpen(false);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all active:scale-[0.98]"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Я настроил канал (Проверить связь)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
