import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export default function Alert({
  children,
  title = '',
  variant = 'info', // 'info' | 'success' | 'warning' | 'error'
  className = '',
}) {
  const configs = {
    info: {
      bg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
      icon: Info,
      iconColor: 'text-indigo-600',
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
    },
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
      icon: AlertCircle,
      iconColor: 'text-rose-600',
    },
  };

  const config = configs[variant] || configs.info;
  const IconComponent = config.icon;

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${config.bg} ${className}`}>
      <IconComponent className={`w-4 h-4 shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="space-y-1 flex-1">
        {title && <div className="font-semibold">{title}</div>}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
