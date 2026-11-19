import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { WORKFLOW_STEPS } from '../../utils/constants';
import { formatBytes, formatDuration } from '../../utils/formatters';
import { 
  CheckCircle2, 
  Film, 
  Clock, 
  Layers, 
  HardDrive, 
  Info, 
  ArrowRight,
  AlertTriangle 
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function ValidationCard() {
  const { 
    activeMedia, 
    mediaType, 
    setCurrentStep, 
    loadDetections 
  } = useWorkflow();

  if (!activeMedia) return null;

  const metadata = activeMedia.metadata || {};

  const handleProceedToDetection = async () => {
    setCurrentStep(WORKFLOW_STEPS.DETECT);
    // Trigger detection load
    loadDetections(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header with Title and Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-slate-900 text-base">{activeMedia.file_name}</h3>
              <Badge variant="success">Validated</Badge>
              {activeMedia.is_image_pending_backend && (
                <Badge variant="warning">Image Support Pending</Badge>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Media ID: <span className="font-mono font-semibold text-slate-700">#{activeMedia.media_id}</span> • Type:{' '}
              <span className="font-semibold uppercase text-slate-700">{mediaType}</span>
            </p>
          </div>
        </div>

        <Button
          onClick={handleProceedToDetection}
          icon={ArrowRight}
          className="self-end sm:self-auto"
        >
          Proceed to Detection
        </Button>
      </div>

      {/* Metadata Specification Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <HardDrive className="w-3.5 h-3.5 text-slate-400" />
            <span>File Size</span>
          </div>
          <div className="text-sm font-bold text-slate-900">
            {formatBytes(metadata.file_size || 0)}
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Resolution</span>
          </div>
          <div className="text-sm font-bold text-slate-900">
            {metadata.width && metadata.height ? `${metadata.width} × ${metadata.height} px` : 'Auto'}
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Duration</span>
          </div>
          <div className="text-sm font-bold text-slate-900">
            {mediaType === 'video' ? formatDuration(metadata.duration_seconds) : 'Single Frame'}
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Film className="w-3.5 h-3.5 text-slate-400" />
            <span>Frame Rate</span>
          </div>
          <div className="text-sm font-bold text-slate-900">
            {metadata.fps ? `${metadata.fps.toFixed(1)} FPS` : 'N/A'}
          </div>
        </div>
      </div>

      {/* Backend Acceptance Notes */}
      {activeMedia.is_image_pending_backend ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Pending Backend Image Endpoint</p>
            <p className="text-amber-800">
              The existing backend route <code className="bg-amber-100 px-1 py-0.5 rounded">/api/videos/upload</code> only accepts container formats (.mp4, .avi, etc.). Image support requires your teammate to mount <code className="bg-amber-100 px-1 py-0.5 rounded">POST /api/images/upload</code> as documented in the Integration Checklist.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Verified by backend OpenCV service and stored in PostgreSQL <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">Media</code> table.
          </span>
        </div>
      )}
    </div>
  );
}
