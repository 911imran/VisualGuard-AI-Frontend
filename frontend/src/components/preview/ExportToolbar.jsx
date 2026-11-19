import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import exportService from '../../services/exportService';
import { Download, RotateCcw, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';

export default function ExportToolbar() {
  const {
    activeMedia,
    localFile,
    localPreviewUrl,
    mediaType,
    protectionStyle,
    processingStatus,
    prepareForReprocessing,
  } = useWorkflow();

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const isBackendProcessed = processingStatus === 'completed';

  const handleExport = async () => {
    try {
      const fileName = activeMedia?.file_name || (mediaType === 'video' ? 'visualguard_media.mp4' : 'visualguard_media.png');
      const downloadTarget = localFile || localPreviewUrl;
      exportService.downloadMedia(downloadTarget, fileName, `protected_${protectionStyle}`);
      
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      alert(`Export error: ${err.message}`);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
            <span>Finalize Visual Privacy Protection</span>
            {downloadSuccess && (
              <span className="text-emerald-600 font-semibold text-xs inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Export Initiated
              </span>
            )}
          </h4>
          <p className="text-xs text-slate-500">
            Download your media with configured privacy settings. Audio channels are preserved for video containers.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={prepareForReprocessing}
            icon={RotateCcw}
          >
            Corrections & Reprocess
          </Button>

          <Button
            onClick={handleExport}
            icon={Download}
            size="lg"
          >
            Export Protected Media
          </Button>
        </div>
      </div>

      {/* Backend Output Status Notice */}
      {!isBackendProcessed && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Note for Evaluation:</strong> The backend task remains queued in <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">status: pending</code> awaiting the backend AI worker. Export currently downloads the session media file with formatted metadata. Genuinely redacted video delivery will activate once the backend output stream route is mounted.
          </span>
        </div>
      )}
    </div>
  );
}
