import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { CONCEALMENT_STYLES } from '../../utils/constants';
import { EyeOff, Grid, Square } from 'lucide-react';

export default function ProtectionStylePicker() {
  const { protectionStyle, setProtectionStyle } = useWorkflow();

  const styles = [
    {
      id: CONCEALMENT_STYLES.BLUR,
      name: 'Gaussian Blur',
      description: 'Smooth visual blurring that obscures facial details and characters while maintaining visual context.',
      icon: EyeOff,
      badge: 'Recommended',
    },
    {
      id: CONCEALMENT_STYLES.PIXELATE,
      name: 'Mosaic Pixelation',
      description: 'Converts target bounding regions into coarse pixel blocks for high-privacy redaction.',
      icon: Grid,
      badge: 'High Anonymity',
    },
    {
      id: CONCEALMENT_STYLES.SOLID_MASK,
      name: 'Solid Blackout Mask',
      description: 'Completely covers sensitive visual features with an opaque solid black block.',
      icon: Square,
      badge: 'Complete Redaction',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          1. Choose Privacy Protection Style
        </label>
        <span className="text-xs text-slate-400">3 Anonymization Techniques</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {styles.map((style) => {
          const isSelected = protectionStyle === style.id;
          const Icon = style.icon;

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => setProtectionStyle(style.id)}
              className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                  {style.badge}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">{style.name}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{style.description}</p>
              </div>

              {/* Visual Preview Swatch */}
              <div className="w-full h-12 rounded-lg bg-slate-100 border border-slate-200/60 overflow-hidden flex items-center justify-center relative">
                {style.id === CONCEALMENT_STYLES.BLUR && (
                  <div className="w-16 h-8 bg-indigo-500 rounded-md filter blur-xs" />
                )}
                {style.id === CONCEALMENT_STYLES.PIXELATE && (
                  <div className="grid grid-cols-4 gap-0.5 w-16 h-8">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="bg-indigo-400/80 rounded-xs" />
                    ))}
                  </div>
                )}
                {style.id === CONCEALMENT_STYLES.SOLID_MASK && (
                  <div className="w-16 h-8 bg-slate-900 rounded-md shadow-xs" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
