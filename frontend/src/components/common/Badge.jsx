import React from 'react';

export default function Badge({
  children,
  variant = 'default', // 'default' | 'success' | 'warning' | 'error' | 'info' | 'demo'
  size = 'md', // 'sm' | 'md'
  className = '',
}) {
  const baseStyles = 'inline-flex items-center font-semibold rounded-full border';

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    demo: 'bg-purple-50 text-purple-700 border-purple-200 uppercase tracking-wide',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
