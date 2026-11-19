import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { WORKFLOW_STEPS, SELECTION_MODES } from '../../utils/constants';
import { 
  User, 
  Car, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Layers 
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function EntityList() {
  const {
    detectedEntities,
    selectedEntityIds,
    toggleEntitySelection,
    selectAllEntities,
    selectionMode,
    setCurrentStep,
    isDemoDetections,
  } = useWorkflow();

  const handleProceed = () => {
    setCurrentStep(WORKFLOW_STEPS.PROTECTION_STYLE);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header with Title and bulk actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Detected Entities</h3>
          <Badge variant="default" size="sm">
            {detectedEntities.length} identified
          </Badge>
          {isDemoDetections && <Badge variant="demo" size="sm">Evaluation Data</Badge>}
        </div>

        {detectedEntities.length > 0 && (
          <div className="flex items-center space-x-2 text-xs">
            <button
              type="button"
              onClick={() => selectAllEntities(true)}
              className="text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
            >
              Select All
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={() => selectAllEntities(false)}
              className="text-slate-500 hover:text-slate-700 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* List items */}
      {detectedEntities.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400 space-y-2">
          <p>No detection results returned for this media.</p>
          <p className="text-[11px] text-slate-400">
            Click "Load Evaluation Targets" above to test the target selector.
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {detectedEntities.map((entity) => {
            const isSelected = selectedEntityIds.includes(entity.entity_id);
            const isFace = entity.entity_type === 'face';

            return (
              <div
                key={entity.entity_id}
                onClick={() => toggleEntitySelection(entity.entity_id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/40 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="flex items-center space-x-2">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isFace ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                      }`}
                    >
                      {isFace ? <User className="w-3.5 h-3.5" /> : <Car className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">
                        {entity.label || (isFace ? 'Human Face' : 'Number Plate')}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        ID: #{entity.entity_id} {entity.tracking_id ? `• Track: ${entity.tracking_id}` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Confidence: {(entity.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Proceed Button */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Selected: <strong>{selectedEntityIds.length}</strong> of {detectedEntities.length}
        </span>

        <Button
          onClick={handleProceed}
          icon={ArrowRight}
        >
          Configure Protection Style
        </Button>
      </div>
    </div>
  );
}
