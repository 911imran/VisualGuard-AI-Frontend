import apiClient from './apiClient.js';

/**
 * Processing Task Service
 * Manages privacy protection processing tasks via the FastAPI backend.
 * Directly integrates with:
 *   - POST /api/processing/tasks
 *   - GET  /api/processing/tasks
 *   - GET  /api/processing/tasks/{task_id}
 * 
 * Pending backend requirements:
 *   - Extended selection parameters (selected_entity_ids, selection_mode, concealment_style)
 *   - Processed media stream/download route (/api/processing/tasks/{task_id}/download)
 */
export const processingService = {
  /**
   * Create a new video processing task in the backend
   * Endpoint: POST /api/processing/tasks
   * 
   * Strict Backend Schema (ProcessingTaskCreate):
   *   - media_id: number (must be > 0)
   *   - protection_type: "faces" | "number_plates" | "both"
   *   - blur_intensity: number between 0.0 and 100.0 (optional)
   * 
   * @param {Object} params
   * @param {number} params.mediaId - Primary key ID in Media table
   * @param {"faces" | "number_plates" | "both"} params.protectionType - Target object type
   * @param {number} [params.blurIntensity] - Blur intensity (0 - 100)
   * @returns {Promise<Object>} ProcessingTaskResponse
   */
  async createTask({ mediaId, protectionType = 'both', blurIntensity = 25.0 }) {
    if (!mediaId || mediaId <= 0) {
      throw new Error('Valid media_id must be provided to create a processing task.');
    }

    const validTypes = ['faces', 'number_plates', 'both'];
    if (!validTypes.includes(protectionType)) {
      throw new Error(`Invalid protection_type: ${protectionType}. Allowed values: ${validTypes.join(', ')}`);
    }

    const payload = {
      media_id: parseInt(mediaId, 10),
      protection_type: protectionType,
    };

    if (blurIntensity !== undefined && blurIntensity !== null) {
      payload.blur_intensity = parseFloat(blurIntensity);
    }

    const response = await apiClient.post('/api/processing/tasks', payload);
    return response.data;
  },

  /**
   * Retrieve status and progress for a specific processing task
   * Endpoint: GET /api/processing/tasks/{task_id}
   * 
   * @param {number} taskId - Processing task ID
   * @returns {Promise<Object>} ProcessingTaskResponse (status: "pending" | "processing" | "completed" | "failed", progress: float)
   */
  async getTaskById(taskId) {
    if (!taskId) {
      throw new Error('A valid taskId is required.');
    }

    const response = await apiClient.get(`/api/processing/tasks/${taskId}`);
    return response.data;
  },

  /**
   * Retrieve a paginated list of all processing tasks (newest first)
   * Endpoint: GET /api/processing/tasks
   * 
   * @param {number} skip - Number of records to skip
   * @param {number} limit - Maximum records to return
   * @returns {Promise<{ total: number, items: Array }>} ProcessingTaskListResponse
   */
  async listTasks(skip = 0, limit = 50) {
    const response = await apiClient.get(`/api/processing/tasks?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  /**
   * Download the processed media output file.
   * Endpoint: GET /api/processing/tasks/{task_id}/download (Pending Backend Implementation)
   * 
   * @param {number} taskId
   * @returns {Promise<Blob>}
   */
  async downloadProcessedOutput(taskId) {
    try {
      const response = await apiClient.get(`/api/processing/tasks/${taskId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        const missingEndpointError = new Error(
          `Backend download endpoint GET /api/processing/tasks/${taskId}/download is not yet implemented by the backend.`
        );
        missingEndpointError.isBackendEndpointMissing = true;
        missingEndpointError.requiredEndpoint = `/api/processing/tasks/${taskId}/download`;
        throw missingEndpointError;
      }
      throw error;
    }
  },
};

export default processingService;
