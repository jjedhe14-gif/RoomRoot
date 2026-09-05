import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '../../stores/toastStore';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  const icons = {
    success: <CheckCircle size={18} className="text-green-500" />,
    error: <XCircle size={18} className="text-red-500" />,
    warning: <AlertCircle size={18} className="text-yellow-500" />,
    info: <Info size={18} className="text-blue-500" />,
  };

  return (
    <div className="toast-container fixed top-4 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            className="glass-card glass-toast px-4 py-3 flex items-center gap-3 pointer-events-auto"
            initial={{ y: -50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {icons[toast.type]}
            <span className="flex-1 text-sm font-medium text-[var(--text-primary)]">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="glass-toast-close p-1 rounded-lg">
              <X size={14} className="text-[var(--text-tertiary)]" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
