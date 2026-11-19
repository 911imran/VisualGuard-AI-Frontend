import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { WORKFLOW_STEPS, SELECTION_MODES, CONCEALMENT_STYLES } from '../../utils/constants';
import { 
  UploadCloud, 
  Target, 
  Sliders, 
  Cpu, 
  Eye, 
  RotateCcw,
  Sparkles 
} from 'lucide-react';
import Badge from '../common/Badge';

export default function WorkflowStepper() {
  const { 
    currentStep, 
    setCurrentStep, 
    activeMedia, 
    setMedia,
    loadDetections,
    resetAll,
    isDemoDetections 
  } = useWorkflow();

  const stages = [
    {
      id: 1,
      name: 'Upload & Validate',
      icon: UploadCloud,
      stepValue: WORKFLOW_STEPS.UPLOAD,
      activeOn: [WORKFLOW_STEPS.UPLOAD, WORKFLOW_STEPS.VALIDATE],
    },
    {
      id: 2,
      name: 'Detect & Select',
      icon: Target,
      stepValue: WORKFLOW_STEPS.DETECT,
      activeOn: [WORKFLOW_STEPS.DETECT, WORKFLOW_STEPS.SELECT],
    },
    {
      id: 3,
      name: 'Protection Style',
      icon: Sliders,
      stepValue: WORKFLOW_STEPS.PROTECTION_STYLE,
      activeOn: [WORKFLOW_STEPS.PROTECTION_STYLE],
    },
    {
      id: 4,
      name: 'Processing',
      icon: Cpu,
      stepValue: WORKFLOW_STEPS.PROCESS,
      activeOn: [WORKFLOW_STEPS.PROCESS],
    },
    {
      id: 5,
      name: 'Preview & Export',
      icon: Eye,
      stepValue: WORKFLOW_STEPS.PREVIEW,
      activeOn: [WORKFLOW_STEPS.PREVIEW, WORKFLOW_STEPS.EXPORT],
    },
  ];

  const handleStepClick = (stage) => {
    // If user clicks a later step without an uploaded media, populate demonstration evaluation media
    if (!activeMedia && stage.stepValue > WORKFLOW_STEPS.VALIDATE) {
      const evaluationSample = {
        media_id: 101,
        file_name: 'fyp_evaluation_traffic_sample.mp4',
        file_path: 'backend/uploads/sample.mp4',
        status: 'evaluation_preview',
        metadata: {
          width: 1280,
          height: 720,
          duration_seconds: 18.4,
          fps: 30.0,
          file_size: 14680064,
        },
      };
      setMedia(evaluationSample, null);
      loadDetections(true);
    }
    setCurrentStep(stage.stepValue);
  };

  return (
    <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Stages list */}
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto w-full md:w-auto py-1">
          {stages.map((stage, idx) => {
            const isCurrent = stage.activeOn.includes(currentStep);
            const isCompleted = stages.findIndex((s) => s.activeOn.includes(currentStep)) > idx;

            return (
              <React.Fragment key={stage.id}>
                {idx > 0 && <span className="text-slate-300 text-xs px-1">→</span>}
                <button
                  type="button"
                  onClick={() => handleStepClick(stage)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    isCurrent
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={`Navigate to Step ${stage.id}: ${stage.name}`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-indigo-600 text-white'
                        : isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isCompleted ? '✓' : stage.id}
                  </span>
                  <span>{stage.name}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Action badges and reset */}
        <div className="flex items-center space-x-3 shrink-0 self-end md:self-auto">
          {isDemoDetections && (
            <Badge variant="demo" size="sm" className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>UI Evaluation Mode</span>
            </Badge>
          )}

          {activeMedia && (
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              title="Reset workflow to upload a new media file"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start Over</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
