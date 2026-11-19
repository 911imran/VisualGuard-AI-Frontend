import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { ShieldCheck, Sliders, ArrowRight, Loader2 } from 'lucide-react';
import Button from '../common/Button';

export default function IntensitySlider() {
  const { 
    intensity, 
    setIntensity, 
    applyProcessing, 
    processingStatus, 
    processingError 
  } = useWorkflow();

  const presets = [
    { label: 'Light', value: 15 },
    { label: 'Medium', value: 40 },
    { label: 'Heavy', value: 75 },
    { label: 'Maximum', value: 100 },
  ];

  const isSubmitting = processingStatus === 'creating';

  const handleApply = async () => {
    try {
      await applyProcessing();
    } catch {
      // Error handled inside context
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Adjust Concealment Intensity
            </h4>
          </div>
          <span className="font-mono font-bold text-sm text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
            {intensity.toFixed(0)}%
          </span>
        </div>

        {/* Range Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={intensity}
            onChange={(e) => setIntensity(parseFloat(e.target.value))}
            className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 border border-slate-200"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>0% (Minimal)</span>
            <span>50% (Standard)</span>
            <span>100% (Maximum Privacy)</span>
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 mr-1">Presets:</span>
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setIntensity(preset.value)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
                intensity === preset.value
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {preset.label} ({preset.value}%)
            </button>
          ))}
        </div>
      </div>

      {/* Explicit Processing Action */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs text-slate-500">
          Submits task payload to backend endpoint <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">POST /api/processing/tasks</code>
        </div>

        <Button
          onClick={handleApply}
          loading={isSubmitting}
          icon={ShieldCheck}
          size="lg"
        >
          {isSubmitting ? 'Registering Task...' : 'Apply Privacy Protection'}
        </Button>
      </div>

      {processingError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {processingError}
        </div>
      )}
    </div>
  );
}
