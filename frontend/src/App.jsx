import React from 'react';
import { useWorkflow } from './context/WorkflowContext';
import { WORKFLOW_STEPS } from './utils/constants';

// Layout & Navigation
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WorkflowStepper from './components/navigation/WorkflowStepper';

// Upload & Validation
import MediaUploadZone from './components/upload/MediaUploadZone';
import ValidationCard from './components/upload/ValidationCard';
import RecentMediaLibrary from './components/upload/RecentMediaLibrary';

// Detection & Target Selection
import TargetCategoryFilter from './components/detection/TargetCategoryFilter';
import SelectionModeControls from './components/detection/SelectionModeControls';
import DetectionViewer from './components/detection/DetectionViewer';
import EntityList from './components/detection/EntityList';

// Protection Settings
import ProtectionStylePicker from './components/protection/ProtectionStylePicker';
import IntensitySlider from './components/protection/IntensitySlider';

// Processing Monitor
import TaskMonitor from './components/processing/TaskMonitor';
import TaskListHistory from './components/processing/TaskListHistory';

// Preview & Export
import MediaComparisonPlayer from './components/preview/MediaComparisonPlayer';
import ExportToolbar from './components/preview/ExportToolbar';

export default function App() {
  const { currentStep, activeMedia } = useWorkflow();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <WorkflowStepper />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Step 1: Upload Media */}
        {currentStep === WORKFLOW_STEPS.UPLOAD && (
          <div className="space-y-8">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Upload Image or Video Media
              </h2>
              <p className="text-xs text-slate-500">
                Select media containing sensitive visual elements (human faces or vehicle license plates).
              </p>
            </div>

            <MediaUploadZone />
            <RecentMediaLibrary />
          </div>
        )}

        {/* Step 2: Validate Media */}
        {currentStep === WORKFLOW_STEPS.VALIDATE && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Media Validation & Metadata Extraction
              </h2>
              <p className="text-xs text-slate-500">
                Review technical media parameters verified by backend OpenCV pipeline.
              </p>
            </div>

            <ValidationCard />
          </div>
        )}

        {/* Step 3 & 4: Detection & Target Selection */}
        {(currentStep === WORKFLOW_STEPS.DETECT || currentStep === WORKFLOW_STEPS.SELECT) && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Object Detection & Target Selection
              </h2>
              <p className="text-xs text-slate-500">
                Identify human faces and vehicle license plates. Choose your protection selection mode and configure individual targets.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <TargetCategoryFilter />
              <SelectionModeControls />
              <DetectionViewer />
              <EntityList />
            </div>
          </div>
        )}

        {/* Step 5: Choose Protection Style */}
        {currentStep === WORKFLOW_STEPS.PROTECTION_STYLE && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Privacy Protection Settings
              </h2>
              <p className="text-xs text-slate-500">
                Select your preferred concealing technique (Gaussian Blur, Mosaic Pixelation, or Solid Mask) and configure strength.
              </p>
            </div>

            <ProtectionStylePicker />
            <IntensitySlider />
          </div>
        )}

        {/* Step 6: Processing Task Monitor */}
        {currentStep === WORKFLOW_STEPS.PROCESS && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Processing Task Execution
              </h2>
              <p className="text-xs text-slate-500">
                Real-time tracking of backend redaction tasks via FastAPI task management API.
              </p>
            </div>

            <TaskMonitor />
            <TaskListHistory />
          </div>
        )}

        {/* Step 7 & 8: Preview, Corrections & Export */}
        {(currentStep === WORKFLOW_STEPS.PREVIEW || currentStep === WORKFLOW_STEPS.EXPORT) && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Preview & Export Protected Media
              </h2>
              <p className="text-xs text-slate-500">
                Inspect before-and-after comparisons with interactive controls. Apply corrections or export the final protected media.
              </p>
            </div>

            <MediaComparisonPlayer />
            <ExportToolbar />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
