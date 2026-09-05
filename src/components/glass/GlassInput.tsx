import React from 'react';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export function GlassInput({ label, icon, className = '', ...props }: GlassInputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">{icon}</div>}
        <input
          className={`glass-input ${icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}

interface GlassTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function GlassTextArea({ label, className = '', ...props }: GlassTextAreaProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{label}</label>}
      <textarea
        className={`glass-input resize-none min-h-[100px] ${className}`}
        {...props}
      />
    </div>
  );
}

interface GlassSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function GlassSelect({ label, options, className = '', ...props }: GlassSelectProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{label}</label>}
      <select className={`glass-input appearance-none bg-no-repeat bg-[right_12px_center] ${className}`} {...props}>
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
}
