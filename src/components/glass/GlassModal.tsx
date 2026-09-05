import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function GlassModal({ isOpen, onClose, title, children, size = 'md' }: GlassModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className={`relative w-full ${sizeClasses[size]} glass-card p-6 max-h-[90vh] overflow-y-auto`}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {title && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{title}</h2>
                <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
                  <X size={20} className="text-[var(--text-secondary)]" />
                </button>
              </div>
            )}
            {!title && (
              <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors z-10">
                <X size={20} className="text-[var(--text-secondary)]" />
              </button>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
