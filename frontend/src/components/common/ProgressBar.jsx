import React from 'react';

export default function ProgressBar({
  progress = 0,
  label = '',
  status = 'default', // 'default' | 'success' | 'danger'
  showPercent = true,
  className = '',
}) {
  const clamped = Math.min(100, Math.max(0, progress));

  const barColors = {
    default: 'bg-indigo-600',
    success: 'bg-emerald-500',
    danger: 'bg-rose-500',
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-700">
          <span>{label}</span>
          {showPercent && <span className="font-mono text-slate-500">{clamped.toFixed(0)}%</span>}
        </div>
      )}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
        <div
          className={`h-full transition-all duration-300 rounded-full ${barColors[status] || barColors.default}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
