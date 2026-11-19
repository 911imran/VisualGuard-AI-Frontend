import { useState, useEffect, useRef, useCallback } from 'react';
import processingService from '../services/processingService';

/**
 * Hook to poll a FastAPI processing task until completion or failure
 * 
 * @param {number|null} taskId - Processing task ID to poll
 * @param {Object} options
 * @param {number} [options.intervalMs=2500] - Polling interval in milliseconds
 * @param {function} [options.onComplete] - Callback on task status === 'completed'
 * @param {function} [options.onError] - Callback on task status === 'failed' or API error
 */
export function useTaskPolling(taskId, { intervalMs = 2500, onComplete, onError } = {}) {
  const [task, setTask] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const fetchTaskStatus = useCallback(async (id) => {
    try {
      const data = await processingService.getTaskById(id);
      setTask(data);

      if (data.status === 'completed') {
        stopPolling();
        if (onComplete) onComplete(data);
      } else if (data.status === 'failed') {
        stopPolling();
        const errMessage = data.error_message || 'Backend processing failed.';
        setError(errMessage);
        if (onError) onError(errMessage, data);
      }
    } catch (err) {
      const msg = err?.userFriendlyMessage || err.message || 'Error fetching task status.';
      setError(msg);
      stopPolling();
      if (onError) onError(msg);
    }
  }, [stopPolling, onComplete, onError]);

  useEffect(() => {
    if (!taskId) {
      setTask(null);
      stopPolling();
      return;
    }

    setIsPolling(true);
    setError(null);

    // Initial fetch
    fetchTaskStatus(taskId);

    // Set polling interval
    timerRef.current = setInterval(() => {
      fetchTaskStatus(taskId);
    }, intervalMs);

    return () => {
      stopPolling();
    };
  }, [taskId, intervalMs, fetchTaskStatus, stopPolling]);

  return {
    task,
    status: task?.status || 'idle',
    progress: task?.progress ?? 0,
    isPolling,
    isPending: task?.status === 'pending',
    isProcessing: task?.status === 'processing',
    isCompleted: task?.status === 'completed',
    isFailed: task?.status === 'failed',
    error,
    stopPolling,
  };
}

export default useTaskPolling;
