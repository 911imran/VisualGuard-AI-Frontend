import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { TARGET_CATEGORIES } from '../../utils/constants';
import { User, Car, Layers } from 'lucide-react';

export default function TargetCategoryFilter() {
  const { targetCategory, setTargetCategory, detectedEntities } = useWorkflow();

  const faceCount = detectedEntities.filter((e) => e.entity_type === 'face').length;
  const plateCount = detectedEntities.filter((e) => e.entity_type === 'license_plate').length;

  const filters = [
    {
      id: TARGET_CATEGORIES.BOTH,
      label: 'All Targets (Faces & Plates)',
      count: detectedEntities.length,
      icon: Layers,
    },
    {
      id: TARGET_CATEGORIES.FACES,
      label: 'Human Faces Only',
      count: faceCount,
      icon: User,
    },
    {
      id: TARGET_CATEGORIES.NUMBER_PLATES,
      label: 'Vehicle Plates Only',
      count: plateCount,
      icon: Car,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-slate-500 mr-1">Target Categories:</span>
      {filters.map((filter) => {
        const isSelected = targetCategory === filter.id;
        const Icon = filter.icon;
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => setTargetCategory(filter.id)}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isSelected
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{filter.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {filter.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
