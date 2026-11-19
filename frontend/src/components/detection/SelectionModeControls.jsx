import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { SELECTION_MODES } from '../../utils/constants';
import { CheckCheck, CheckSquare, XSquare } from 'lucide-react';

export default function SelectionModeControls() {
  const { selectionMode, setSelectionMode, detectedEntities, selectedEntityIds } = useWorkflow();

  const modes = [
    {
      id: SELECTION_MODES.ALL,
      title: '1. All Objects',
      description: 'Conceal every detected face and number plate automatically.',
      icon: CheckCheck,
      badge: `${detectedEntities.length} Targets`,
    },
    {
      id: SELECTION_MODES.SELECTED_ONLY,
      title: '2. Selected Only',
      description: 'Conceal only the individually chosen entities.',
      icon: CheckSquare,
      badge: `${selectedEntityIds.length} Selected`,
    },
    {
      id: SELECTION_MODES.ALL_EXCEPT_SELECTED,
      title: '3. All Except Selected',
      description: 'Conceal everything except the chosen exceptions.',
      icon: XSquare,
      badge: `${Math.max(0, detectedEntities.length - selectedEntityIds.length)} Protected`,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Protection Selection Mode
        </label>
        <span className="text-xs text-slate-400">Choose which detected items to conceal</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {modes.map((mode) => {
          const isSelected = selectionMode === mode.id;
          const Icon = mode.icon;

          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => setSelectionMode(mode.id)}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2.5 ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">{mode.title}</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                  {mode.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-snug">{mode.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
