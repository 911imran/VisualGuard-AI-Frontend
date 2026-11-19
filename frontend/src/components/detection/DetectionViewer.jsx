import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { SELECTION_MODES, TARGET_CATEGORIES } from '../../utils/constants';
import { 
  Shield, 
  ShieldAlert, 
  User, 
  Car, 
  Sparkles, 
  Info, 
  AlertCircle 
} from 'lucide-react';
import Badge from '../common/Badge';

export default function DetectionViewer() {
  const {
    activeMedia,
    localPreviewUrl,
    mediaType,
    detectedEntities,
    selectedEntityIds,
    toggleEntitySelection,
    selectionMode,
    targetCategory,
    isDemoDetections,
    detectionError,
    loadDetections,
  } = useWorkflow();

  // Filter entities according to category
  const filteredEntities = detectedEntities.filter((entity) => {
    if (targetCategory === TARGET_CATEGORIES.FACES) return entity.entity_type === 'face';
    if (targetCategory === TARGET_CATEGORIES.NUMBER_PLATES) return entity.entity_type === 'license_plate';
    return true;
  });

  // Determine if a specific entity will be concealed based on the selectionMode
  const isEntityConcealed = (entityId) => {
    if (selectionMode === SELECTION_MODES.ALL) {
      return true;
    }
    if (selectionMode === SELECTION_MODES.SELECTED_ONLY) {
      return selectedEntityIds.includes(entityId);
    }
    if (selectionMode === SELECTION_MODES.ALL_EXCEPT_SELECTED) {
      return !selectedEntityIds.includes(entityId);
    }
    return true;
  };

  return (
    <div className="space-y-4">
      {/* Missing Backend Detection Endpoint Notice */}
      {detectionError && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-3">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-amber-950">Backend Detection API Pending</p>
              <p className="text-amber-800">
                The backend route <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">GET /api/media/&#123;id&#125;/detections</code> has not yet been exposed by your backend developer.
                (Database models <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">DetectedEntity</code> and <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">Detection</code> exist in the backend schema).
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-amber-200/60">
            <span className="text-amber-700">
              You can enable standard UI evaluation targets to test the selection modes:
            </span>
            <button
              type="button"
              onClick={() => loadDetections(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Evaluation Targets (Demo)</span>
            </button>
          </div>
        </div>
      )}

      {/* Media Canvas with Bounding Boxes */}
      <div className="relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-md aspect-video max-h-[520px] flex items-center justify-center select-none">
        {localPreviewUrl ? (
          mediaType === 'video' ? (
            <video
              src={localPreviewUrl}
              controls
              className="w-full h-full object-contain pointer-events-auto"
            />
          ) : (
            <img
              src={localPreviewUrl}
              alt="Uploaded Preview"
              className="w-full h-full object-contain"
            />
          )
        ) : (
          <div className="text-center p-8 text-slate-500 text-xs">
            No local preview stream available.
          </div>
        )}

        {/* Overlay Bounding Boxes (Absolute Scaled Coordinates) */}
        {filteredEntities.map((entity) => {
          const isSelected = selectedEntityIds.includes(entity.entity_id);
          const willConceal = isEntityConcealed(entity.entity_id);
          const isFace = entity.entity_type === 'face';

          // Bounding box placement (normalized percentage or pixel coords)
          const bbox = entity.bbox || { x: 50, y: 50, width: 100, height: 100 };

          return (
            <div
              key={entity.entity_id}
              onClick={(e) => {
                e.stopPropagation();
                toggleEntitySelection(entity.entity_id);
              }}
              style={{
                left: `${bbox.x}px`,
                top: `${bbox.y}px`,
                width: `${bbox.width}px`,
                height: `${bbox.height}px`,
              }}
              className={`absolute cursor-pointer transition-all duration-150 rounded-md border-2 z-20 flex flex-col justify-between p-1.5 ${
                willConceal
                  ? isFace
                    ? 'border-indigo-400 bg-indigo-500/20 shadow-lg shadow-indigo-500/20'
                    : 'border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                  : 'border-slate-400/60 bg-black/40 hover:border-white'
              }`}
            >
              {/* Top Label Tag */}
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 leading-none ${
                    willConceal ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {isFace ? <User className="w-2.5 h-2.5" /> : <Car className="w-2.5 h-2.5" />}
                  <span>{entity.label || (isFace ? 'Face' : 'Plate')}</span>
                </span>

                <span className="text-[9px] font-mono text-white/80 bg-black/60 px-1 rounded">
                  {entity.confidence ? `${(entity.confidence * 100).toFixed(0)}%` : ''}
                </span>
              </div>

              {/* Bottom Target State Pill */}
              <div className="flex items-center justify-end">
                {willConceal ? (
                  <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-1 py-0.2 rounded flex items-center gap-0.5">
                    <Shield className="w-2.5 h-2.5" /> Protected
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-slate-400 bg-slate-900/80 px-1 py-0.2 rounded">
                    Exempt
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Demo Tag Indicator in Corner */}
        {isDemoDetections && (
          <div className="absolute top-3 left-3 z-30">
            <Badge variant="demo" size="sm" className="shadow-md bg-purple-900/80 text-purple-200 border-purple-500">
              Interactive Evaluation Overlay
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
