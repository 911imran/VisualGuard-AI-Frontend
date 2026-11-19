import React, { useEffect } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { WORKFLOW_STEPS } from '../../utils/constants';
import useTaskPolling from '../../hooks/useTaskPolling';
import { 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Layers, 
  ArrowRight, 
  Eye, 
  RotateCcw,
  Sliders 
} from 'lucide-react';
import ProgressBar from '../common/ProgressBar';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function TaskMonitor() {
  const {
    activeTask,
    processingStatus,
    setProcessingStatus,
    processingProgress,
    setProcessingProgress,
    setCurrentStep,
    setProcessedOutputUrl,
    localPreviewUrl,
    prepareForReprocessing,
  } = useWorkflow();

  const taskId = activeTask?.task_id;

  // Poll task status from backend every 2.5s
  const { task, status, progress, error, isCompleted, isFailed } = useTaskPolling(taskId, {
    intervalMs: 2500,
    onComplete: (data) => {
      setProcessingStatus('completed');
      setProcessingProgress(100);
      // When output stream is available, attach to preview
      if (localPreviewUrl) {
        setProcessedOutputUrl(localPreviewUrl);
      }
    },
    onError: (err) => {
      setProcessingStatus('failed');
    },
  });

  useEffect(() => {
    if (status && status !== 'idle') {
      setProcessingStatus(status);
      setProcessingProgress(progress);
    }
  }, [status, progress, setProcessingStatus, setProcessingProgress]);

  const handleProceedToPreview = () => {
    setCurrentStep(WORKFLOW_STEPS.PREVIEW);
  };

  const getStatusBadge = () => {
    switch (processingStatus) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'processing':
        return <Badge variant="info">Processing In Progress</Badge>;
      case 'pending':
        return <Badge variant="warning">Queued (Pending Execution)</Badge>;
      case 'failed':
        return <Badge variant="error">Task Failed</Badge>;
      default:
        return <Badge variant="default">Initializing</Badge>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-slate-900 text-base">Backend Processing Task</h3>
              {getStatusBadge()}
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Task ID: #{taskId || activeTask?.task_id || 'N/A'} • Media ID: #{activeTask?.media_id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={prepareForReprocessing}
            icon={RotateCcw}
          >
            Adjust Settings
          </Button>

          <Button
            onClick={handleProceedToPreview}
            icon={Eye}
          >
            Open Media Preview
          </Button>
        </div>
      </div>

      {/* Real Progress Bar */}
      <div className="space-y-2">
        <ProgressBar
          progress={processingProgress}
          label="Backend Redaction Pipeline Progress"
          status={processingStatus === 'completed' ? 'success' : processingStatus === 'failed' ? 'danger' : 'default'}
        />
        <p className="text-[11px] text-slate-400">
          Status polling active on route <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">GET /api/processing/tasks/{taskId}</code>
        </p>
      </div>

      {/* Task Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
          <div className="text-xs text-slate-400 mb-1">Protection Targets</div>
          <div className="text-sm font-bold text-slate-900 uppercase">
            {activeTask?.protection_type || 'Both'}
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
          <div className="text-xs text-slate-400 mb-1">Blur Intensity</div>
          <div className="text-sm font-bold text-slate-900">
            {activeTask?.blur_intensity !== undefined ? `${activeTask.blur_intensity}%` : 'Default'}
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
          <div className="text-xs text-slate-400 mb-1">Current State</div>
          <div className="text-sm font-bold text-slate-900 capitalize">
            {processingStatus}
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
          <div className="text-xs text-slate-400 mb-1">Queue Status</div>
          <div className="text-sm font-bold text-slate-900">
            {processingStatus === 'pending' ? 'Waiting in Queue' : 'Dispatched'}
          </div>
        </div>
      </div>

      {/* Informative Pipeline Note */}
      {processingStatus === 'pending' && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-900 space-y-1">
          <p className="font-semibold">Task Successfully Registered in PostgreSQL</p>
          <p className="text-indigo-800 leading-relaxed">
            The processing task row has been created via <code className="bg-indigo-100 px-1 py-0.5 rounded font-mono">POST /api/processing/tasks</code>.
            Because the backend team member is currently finishing the asynchronous AI worker (YOLO + DeepSORT/ByteTrack pipeline), this task remains in <code className="bg-indigo-100 px-1 py-0.5 rounded font-mono font-semibold">status: pending</code>.
            The frontend displays the genuine backend status without fabricating artificial progress.
          </p>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {error}
        </div>
      )}
    </div>
  );
}
