import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  hover?: boolean;
  className?: string;
  onClick?: () => void;
  noPadding?: boolean;
}

export function GlassCard({ children, hover = true, className = '', onClick, noPadding = false, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={`glass-card ${noPadding ? '' : 'p-5'} ${className}`}
      whileHover={hover ? { y: -2, boxShadow: '0 12px 40px rgba(31,38,135,0.12)' } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : undefined }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
