import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { CONCEALMENT_STYLES, TARGET_CATEGORIES, SELECTION_MODES } from '../../utils/constants';
import { 
  Columns2, 
  SplitSquareVertical, 
  Eye, 
  Film, 
  Image as ImageIcon,
  ShieldCheck,
  AlertCircle 
} from 'lucide-react';
import Badge from '../common/Badge';

export default function MediaComparisonPlayer() {
  const {
    activeMedia,
    localPreviewUrl,
    mediaType,
    protectionStyle,
    intensity,
    detectedEntities,
    selectedEntityIds,
    selectionMode,
    targetCategory,
  } = useWorkflow();

  const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side' | 'split' | 'protected-only'
  const [sliderPos, setSliderPos] = useState(50); // for split slider (0 - 100)

  // Filter entities according to category
  const filteredEntities = detectedEntities.filter((entity) => {
    if (targetCategory === TARGET_CATEGORIES.FACES) return entity.entity_type === 'face';
    if (targetCategory === TARGET_CATEGORIES.NUMBER_PLATES) return entity.entity_type === 'license_plate';
    return true;
  });

  const isEntityConcealed = (entityId) => {
    if (selectionMode === SELECTION_MODES.ALL) return true;
    if (selectionMode === SELECTION_MODES.SELECTED_ONLY) return selectedEntityIds.includes(entityId);
    if (selectionMode === SELECTION_MODES.ALL_EXCEPT_SELECTED) return !selectedEntityIds.includes(entityId);
    return true;
  };

  const getConcealmentStyle = () => {
    if (protectionStyle === CONCEALMENT_STYLES.BLUR) {
      const px = Math.max(4, Math.round((intensity / 100) * 24));
      return {
        backdropFilter: `blur(${px}px)`,
        WebkitBackdropFilter: `blur(${px}px)`,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      };
    }
    if (protectionStyle === CONCEALMENT_STYLES.PIXELATE) {
      return {
        backdropFilter: 'blur(10px) contrast(150%)',
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.6) 20%, transparent 20%)',
        backgroundSize: `${Math.max(4, Math.round((intensity / 100) * 16))}px ${Math.max(4, Math.round((intensity / 100) * 16))}px`,
        backgroundColor: 'rgba(100, 116, 139, 0.4)',
      };
    }
    if (protectionStyle === CONCEALMENT_STYLES.SOLID_MASK) {
      return {
        backgroundColor: '#0f172a',
      };
    }
    return {};
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Top Header & View Modes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900">Protected Media Preview & Comparison</h3>
            <Badge variant="success">Review Mode</Badge>
          </div>
          <p className="text-xs text-slate-500">
            Compare original media with applied privacy concealment ({protectionStyle.toUpperCase()}, {intensity}%)
          </p>
        </div>

        {/* Comparison Mode Toggles */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl self-end sm:self-auto border border-slate-200/60">
          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'side-by-side'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Side-by-Side</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'split'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split Slider</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('protected-only')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'protected-only'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Protected Only</span>
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      {viewMode === 'side-by-side' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Original View */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400" /> Original Unmodified Media
              </span>
              <span className="font-mono text-slate-400">Source</span>
            </div>

            <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 aspect-video flex items-center justify-center">
              {localPreviewUrl ? (
                mediaType === 'video' ? (
                  <video src={localPreviewUrl} controls className="w-full h-full object-contain" />
                ) : (
                  <img src={localPreviewUrl} alt="Original" className="w-full h-full object-contain" />
                )
              ) : (
                <div className="p-6 text-center space-y-1.5 text-slate-400 text-xs">
                  <Film className="w-6 h-6 mx-auto text-slate-600" />
                  <p className="font-semibold text-slate-300">{activeMedia?.file_name || 'Stored Library Media'}</p>
                  <p className="text-[11px] text-slate-500">
                    Direct video streaming requires the backend to mount static file serving for <code className="bg-slate-900 px-1 py-0.5 rounded">backend/uploads/</code>.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Protected View */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-700">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600" /> Protected Privacy Result
              </span>
              <Badge variant="info" size="sm">{protectionStyle.toUpperCase()}</Badge>
            </div>

            <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 aspect-video flex items-center justify-center">
              {localPreviewUrl ? (
                mediaType === 'video' ? (
                  <video src={localPreviewUrl} controls className="w-full h-full object-contain" />
                ) : (
                  <img src={localPreviewUrl} alt="Protected" className="w-full h-full object-contain" />
                )
              ) : (
                <div className="p-6 text-center space-y-1.5 text-slate-400 text-xs">
                  <ShieldCheck className="w-6 h-6 mx-auto text-indigo-500" />
                  <p className="font-semibold text-slate-300">Privacy Redaction Filter Active</p>
                  <p className="text-[11px] text-slate-500">
                    Configured for {protectionStyle.toUpperCase()} ({intensity}% intensity).
                  </p>
                </div>
              )}

              {/* Render Concealment Masks over active targets */}
              {filteredEntities.map((entity) => {
                const willConceal = isEntityConcealed(entity.entity_id);
                if (!willConceal) return null;
                const bbox = entity.bbox || { x: 50, y: 50, width: 100, height: 100 };

                return (
                  <div
                    key={entity.entity_id}
                    style={{
                      left: `${bbox.x}px`,
                      top: `${bbox.y}px`,
                      width: `${bbox.width}px`,
                      height: `${bbox.height}px`,
                      ...getConcealmentStyle(),
                    }}
                    className="absolute z-20 rounded-md border border-white/20 shadow-sm pointer-events-none transition-all flex items-center justify-center"
                  >
                    <ShieldCheck className="w-4 h-4 text-white/40" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : viewMode === 'split' ? (
        <div className="space-y-3">
          <div className="relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 aspect-video max-h-[500px] flex items-center justify-center select-none">
            {localPreviewUrl ? (
              mediaType === 'video' ? (
                <video src={localPreviewUrl} controls className="w-full h-full object-contain" />
              ) : (
                <img src={localPreviewUrl} alt="Original" className="w-full h-full object-contain" />
              )
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">
                Media preview available when freshly uploaded in session.
              </div>
            )}

            {/* Clipped Protected Overlay */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPos}%` }}
            >
              {localPreviewUrl ? (
                mediaType === 'video' ? (
                  <video src={localPreviewUrl} className="w-full h-full object-contain" />
                ) : (
                  <img src={localPreviewUrl} alt="Protected Clip" className="w-full h-full object-contain" />
                )
              ) : null}

              {/* Concealment Masks on clipped side */}
              {filteredEntities.map((entity) => {
                const willConceal = isEntityConcealed(entity.entity_id);
                if (!willConceal) return null;
                const bbox = entity.bbox || { x: 50, y: 50, width: 100, height: 100 };

                return (
                  <div
                    key={entity.entity_id}
                    style={{
                      left: `${bbox.x}px`,
                      top: `${bbox.y}px`,
                      width: `${bbox.width}px`,
                      height: `${bbox.height}px`,
                      ...getConcealmentStyle(),
                    }}
                    className="absolute z-20 rounded-md border border-white/20 shadow-sm"
                  />
                );
              })}

              <div className="absolute top-3 left-3 bg-indigo-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                Protected View
              </div>
            </div>

            {/* Split Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none z-30"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white shadow-md text-slate-800 flex items-center justify-center text-[10px] font-bold">
                ⬌
              </div>
            </div>

            <div className="absolute top-3 right-3 bg-slate-900/80 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              Original View
            </div>
          </div>

          <div className="flex items-center gap-3 px-2">
            <span className="text-xs font-semibold text-slate-500">Compare Slider:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-ew-resize accent-indigo-600"
            />
            <span className="font-mono text-xs text-slate-600">{sliderPos}%</span>
          </div>
        </div>
      ) : (
        /* Protected Only View */
        <div className="relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 aspect-video max-h-[500px] flex items-center justify-center">
          {localPreviewUrl ? (
            mediaType === 'video' ? (
              <video src={localPreviewUrl} controls className="w-full h-full object-contain" />
            ) : (
              <img src={localPreviewUrl} alt="Protected Media" className="w-full h-full object-contain" />
            )
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">
              Select or upload a media file to inspect protected output.
            </div>
          )}

          {/* Concealment Masks */}
          {filteredEntities.map((entity) => {
            const willConceal = isEntityConcealed(entity.entity_id);
            if (!willConceal) return null;
            const bbox = entity.bbox || { x: 50, y: 50, width: 100, height: 100 };

            return (
              <div
                key={entity.entity_id}
                style={{
                  left: `${bbox.x}px`,
                  top: `${bbox.y}px`,
                  width: `${bbox.width}px`,
                  height: `${bbox.height}px`,
                  ...getConcealmentStyle(),
                }}
                className="absolute z-20 rounded-md border border-white/20 shadow-sm"
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
