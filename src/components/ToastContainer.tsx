import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = usePlayer();

  return (
    <div className="fixed top-4 left-4 right-4 z-50 pointer-events-none flex flex-col items-center gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-xl border text-xs font-medium max-w-sm w-full ${
              toast.type === 'success'
                ? 'bg-emerald-950/80 text-emerald-200 border-emerald-500/30 shadow-emerald-950/40'
                : toast.type === 'error'
                ? 'bg-rose-950/80 text-rose-200 border-rose-500/30 shadow-rose-950/40'
                : 'bg-slate-900/85 text-slate-200 border-white/10 shadow-black/50'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
            )}

            <span className="flex-1 leading-snug">{toast.message}</span>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 -mr-1 rounded-full opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
