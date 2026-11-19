import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { SELECTION_MODES, CONCEALMENT_STYLES, TARGET_CATEGORIES, WORKFLOW_STEPS } from '../utils/constants';
import mediaService from '../services/mediaService';
import processingService from '../services/processingService';
import detectionService from '../services/detectionService';

const WorkflowContext = createContext(null);

export function WorkflowProvider({ children }) {
  // Navigation & Step tracking
  const [currentStep, setCurrentStep] = useState(WORKFLOW_STEPS.UPLOAD);

  // Active Media State
  const [activeMedia, setActiveMedia] = useState(null);
  const [localFile, setLocalFile] = useState(null);
  const [mediaType, setMediaType] = useState('video'); // 'video' | 'image'
  const [localPreviewUrl, setLocalPreviewUrl] = useState(null);

  // Detection & Target Selection State
  const [targetCategory, setTargetCategory] = useState(TARGET_CATEGORIES.BOTH);
  const [selectionMode, setSelectionMode] = useState(SELECTION_MODES.ALL);
  const [detectedEntities, setDetectedEntities] = useState([]);
  const [selectedEntityIds, setSelectedEntityIds] = useState([]);
  const [isDemoDetections, setIsDemoDetections] = useState(false);
  const [detectionError, setDetectionError] = useState(null);

  // Protection Style Settings
  const [protectionStyle, setProtectionStyle] = useState(CONCEALMENT_STYLES.BLUR);
  const [intensity, setIntensity] = useState(25.0);

  // Processing Task State
  const [activeTask, setActiveTask] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingError, setProcessingError] = useState(null);

  // Protected Output State
  const [processedOutputUrl, setProcessedOutputUrl] = useState(null);

  // General Loading & Status Indicators
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  // Support URL query param ?step=detect, ?step=protection, ?step=preview for instant step inspection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const stepParam = params.get('step');
      if (stepParam) {
        // Automatically attach sample media and evaluation targets
        const sampleMedia = {
          media_id: 101,
          file_name: 'visualguard_sample_road_surveillance.mp4',
          file_path: 'backend/uploads/sample.mp4',
          status: 'ready',
          metadata: {
            duration_seconds: 14.5,
            fps: 30.0,
            width: 1920,
            height: 1080,
            file_size: 15420000,
          },
        };
        setActiveMedia(sampleMedia);
        const demoData = detectionService.getDemoEvaluationEntities('video');
        setDetectedEntities(demoData);
        setSelectedEntityIds([101]); // First face selected
        setIsDemoDetections(true);

        if (stepParam === 'validate') setCurrentStep(WORKFLOW_STEPS.VALIDATE);
        else if (stepParam === 'detect' || stepParam === 'select') setCurrentStep(WORKFLOW_STEPS.DETECT);
        else if (stepParam === 'protection') setCurrentStep(WORKFLOW_STEPS.PROTECTION_STYLE);
        else if (stepParam === 'process') {
          setCurrentStep(WORKFLOW_STEPS.PROCESS);
          setActiveTask({
            task_id: 42,
            media_id: 101,
            status: 'pending',
            progress: 0,
            protection_type: 'both',
            blur_intensity: 35.0,
          });
        }
        else if (stepParam === 'preview' || stepParam === 'export') {
          setCurrentStep(WORKFLOW_STEPS.PREVIEW);
          setActiveTask({
            task_id: 42,
            media_id: 101,
            status: 'completed',
            progress: 100,
            protection_type: 'both',
            blur_intensity: 35.0,
          });
        }
      }
    }
  }, []);

  const setMedia = useCallback((mediaData, file = null) => {
    setActiveMedia(mediaData);
    setLocalFile(file);

    const isImg = file?.type?.startsWith('image/') || 
      ['.jpg', '.jpeg', '.png', '.webp'].some((ext) => mediaData?.file_name?.toLowerCase().endsWith(ext));
    setMediaType(isImg ? 'image' : 'video');

    if (file) {
      const url = URL.createObjectURL(file);
      setLocalPreviewUrl(url);
    } else {
      setLocalPreviewUrl(null);
    }

    setCurrentStep(WORKFLOW_STEPS.VALIDATE);
  }, []);

  const loadDetections = useCallback(async (useDemoIfBackendMissing = false) => {
    if (!activeMedia?.media_id) return;
    setDetectionError(null);

    try {
      const result = await detectionService.getMediaDetections(activeMedia.media_id);
      setDetectedEntities(result?.entities || []);
      setIsDemoDetections(false);
    } catch (err) {
      if (err.isBackendEndpointMissing) {
        if (useDemoIfBackendMissing) {
          const demoData = detectionService.getDemoEvaluationEntities(mediaType);
          setDetectedEntities(demoData);
          setIsDemoDetections(true);
        } else {
          setDetectedEntities([]);
          setIsDemoDetections(false);
          setDetectionError(err.message);
        }
      } else {
        setDetectionError(err.userFriendlyMessage || err.message);
      }
    }
  }, [activeMedia, mediaType]);

  const toggleEntitySelection = useCallback((entityId) => {
    setSelectedEntityIds((prev) => {
      if (prev.includes(entityId)) {
        return prev.filter((id) => id !== entityId);
      }
      return [...prev, entityId];
    });
  }, []);

  const selectAllEntities = useCallback((selectAll = true) => {
    if (selectAll) {
      setSelectedEntityIds(detectedEntities.map((e) => e.entity_id));
    } else {
      setSelectedEntityIds([]);
    }
  }, [detectedEntities]);

  const applyProcessing = useCallback(async () => {
    if (!activeMedia?.media_id) {
      setProcessingError('No active media found to process.');
      return;
    }

    setProcessingStatus('creating');
    setProcessingError(null);
    setProcessingProgress(0);
    setCurrentStep(WORKFLOW_STEPS.PROCESS);

    try {
      const protectionType = targetCategory === TARGET_CATEGORIES.FACES 
        ? 'faces' 
        : targetCategory === TARGET_CATEGORIES.NUMBER_PLATES 
          ? 'number_plates' 
          : 'both';

      const task = await processingService.createTask({
        mediaId: activeMedia.media_id,
        protectionType,
        blurIntensity: intensity,
      });

      setActiveTask(task);
      setProcessingStatus(task.status || 'pending');
      setProcessingProgress(task.progress || 0);

      return task;
    } catch (err) {
      setProcessingStatus('failed');
      const msg = err.userFriendlyMessage || err.message || 'Failed to submit processing task.';
      setProcessingError(msg);
      throw err;
    }
  }, [activeMedia, targetCategory, intensity]);

  const prepareForReprocessing = useCallback(() => {
    setCurrentStep(WORKFLOW_STEPS.SELECT);
    setProcessingStatus('idle');
    setProcessingProgress(0);
    setProcessingError(null);
  }, []);

  const resetAll = useCallback(() => {
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    setActiveMedia(null);
    setLocalFile(null);
    setLocalPreviewUrl(null);
    setMediaType('video');
    setDetectedEntities([]);
    setSelectedEntityIds([]);
    setIsDemoDetections(false);
    setDetectionError(null);
    setActiveTask(null);
    setProcessingStatus('idle');
    setProcessingProgress(0);
    setProcessingError(null);
    setProcessedOutputUrl(null);
    setCurrentStep(WORKFLOW_STEPS.UPLOAD);
  }, [localPreviewUrl]);

  const value = {
    currentStep,
    setCurrentStep,
    WORKFLOW_STEPS,
    activeMedia,
    localFile,
    mediaType,
    localPreviewUrl,
    setMedia,
    isUploading,
    setIsUploading,
    uploadProgress,
    setUploadProgress,
    uploadError,
    setUploadError,
    targetCategory,
    setTargetCategory,
    selectionMode,
    setSelectionMode,
    detectedEntities,
    selectedEntityIds,
    toggleEntitySelection,
    selectAllEntities,
    isDemoDetections,
    detectionError,
    loadDetections,
    protectionStyle,
    setProtectionStyle,
    intensity,
    setIntensity,
    activeTask,
    processingStatus,
    setProcessingStatus,
    processingProgress,
    setProcessingProgress,
    processingError,
    applyProcessing,
    processedOutputUrl,
    setProcessedOutputUrl,
    prepareForReprocessing,
    resetAll,
  };

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}

export default WorkflowContext;
