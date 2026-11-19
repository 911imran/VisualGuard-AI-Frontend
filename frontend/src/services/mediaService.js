import apiClient from './apiClient.js';

/**
 * Media Service
 * Handles uploading and managing media files via the FastAPI backend.
 * Directly integrates with:
 *   - POST   /api/videos/upload?user_id={user_id}
 *   - GET    /api/videos/{media_id}
 *   - GET    /api/videos?skip={skip}&limit={limit}
 *   - DELETE /api/videos/{media_id}
 * 
 * Pending backend requirements:
 *   - POST   /api/images/upload (or unified /api/media/upload)
 */
export const mediaService = {
  /**
   * Upload an original video file to the backend
   * Endpoint: POST /api/videos/upload
   * 
   * @param {File} file - Video file object (.mp4, .avi, .mov, .mkv, .webm)
   * @param {number} userId - ID of user (default: 1)
   * @param {function} onUploadProgress - Progress event callback
   * @returns {Promise<Object>} MediaUploadResponse from FastAPI
   */
  async uploadVideo(file, userId = 1, onUploadProgress = null) {
    if (!file) {
      throw new Error('A video file must be provided for upload.');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(`/api/videos/upload?user_id=${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(percentCompleted, progressEvent.loaded, progressEvent.total);
        }
      },
    });

    return response.data;
  },

  /**
   * Upload an image file to the backend
   * Endpoint: POST /api/images/upload (Pending Backend Implementation)
   * 
   * If backend endpoint is unavailable (HTTP 404), reports explicit requirement.
   * 
   * @param {File} file - Image file object (.jpg, .png, .webp)
   * @param {number} userId - User ID (default: 1)
   * @returns {Promise<Object>}
   */
  async uploadImage(file, userId = 1) {
    if (!file) {
      throw new Error('An image file must be provided for upload.');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post(`/api/images/upload?user_id=${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        const errorDetails = new Error(
          'Backend route POST /api/images/upload is not yet implemented by the backend. ' +
          'Currently, the backend only accepts video files via POST /api/videos/upload.'
        );
        errorDetails.isBackendEndpointMissing = true;
        errorDetails.requiredEndpoint = 'POST /api/images/upload';
        errorDetails.file = file;
        throw errorDetails;
      }
      throw error;
    }
  },

  /**
   * Retrieve metadata for an uploaded media record by its ID
   * Endpoint: GET /api/videos/{media_id}
   * 
   * @param {number} mediaId - Primary key ID in Media table
   * @returns {Promise<Object>} MediaResponse
   */
  async getMediaById(mediaId) {
    const response = await apiClient.get(`/api/videos/${mediaId}`);
    return response.data;
  },

  /**
   * Retrieve a paginated list of media records
   * Endpoint: GET /api/videos
   * 
   * @param {number} skip - Number of records to skip
   * @param {number} limit - Maximum number of records to return
   * @returns {Promise<{ total: number, items: Array }>} MediaListResponse
   */
  async getMediaList(skip = 0, limit = 50) {
    const response = await apiClient.get(`/api/videos?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  /**
   * Delete a media record and its stored file from the backend
   * Endpoint: DELETE /api/videos/{media_id}
   * 
   * @param {number} mediaId - Primary key ID in Media table
   * @returns {Promise<Object>} Deletion confirmation response
   */
  async deleteMedia(mediaId) {
    const response = await apiClient.delete(`/api/videos/${mediaId}`);
    return response.data;
  },
};

export default mediaService;
