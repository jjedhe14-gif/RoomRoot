import React from 'react';
import { motion } from 'framer-motion';

interface GlassButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function GlassButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  icon,
  disabled = false,
  fullWidth = false,
}: GlassButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30',
    secondary: 'glass-card text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]',
    ghost: 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20',
  };

  return (
    <motion.button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {icon}
      {children}
    </motion.button>
  );
}
