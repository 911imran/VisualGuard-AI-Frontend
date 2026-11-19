import apiClient from './apiClient.js';

/**
 * Detection Service
 * Interfaces with AI detection and object tracking services.
 * 
 * Backend Schema Alignment:
 *   - DETECTED_ENTITY (entity_id, media_id, tracking_id, entity_type: 'face' | 'license_plate')
 *   - DETECTION (detection_id, entity_id, frame_number, confidence, bbox_x, bbox_y, bbox_width, bbox_height)
 * 
 * Pending backend requirements:
 *   - Route GET /api/media/{media_id}/detections is not yet implemented in backend/app/routes/
 */
export const detectionService = {
  /**
   * Fetch detected entities and bounding boxes for a given media from the backend.
   * Endpoint: GET /api/media/{media_id}/detections (Pending Backend Route)
   * 
   * @param {number} mediaId - ID of the media
   * @returns {Promise<{ entities: Array, detections: Array }>}
   */
  async getMediaDetections(mediaId) {
    if (!mediaId) {
      throw new Error('A valid mediaId is required.');
    }

    try {
      const response = await apiClient.get(`/api/media/${mediaId}/detections`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 405) {
        const missingEndpointError = new Error(
          `Backend detection endpoint GET /api/media/${mediaId}/detections is not yet implemented by the backend.`
        );
        missingEndpointError.isBackendEndpointMissing = true;
        missingEndpointError.requiredEndpoint = `GET /api/media/{media_id}/detections`;
        missingEndpointError.mediaId = mediaId;
        throw missingEndpointError;
      }
      throw error;
    }
  },

  /**
   * Explicitly labelled demonstration data for UI evaluation.
   * NEVER presented as genuine AI output.
   * Only used when the user toggles "Demo Mode" to evaluate the target selection interface.
   * 
   * @param {"video" | "image"} mediaType
   * @returns {Array<Object>} Entities with isDemo: true
   */
  getDemoEvaluationEntities(mediaType = 'video') {
    return [
      {
        entity_id: 101,
        entity_type: 'face',
        label: 'Human Face #1',
        confidence: 0.94,
        tracking_id: mediaType === 'video' ? 'TRK-F01' : null,
        bbox: { x: 220, y: 120, width: 140, height: 160 },
        isDemo: true,
      },
      {
        entity_id: 102,
        entity_type: 'face',
        label: 'Human Face #2',
        confidence: 0.89,
        tracking_id: mediaType === 'video' ? 'TRK-F02' : null,
        bbox: { x: 480, y: 140, width: 130, height: 150 },
        isDemo: true,
      },
      {
        entity_id: 201,
        entity_type: 'license_plate',
        label: 'Number Plate #1',
        confidence: 0.96,
        tracking_id: mediaType === 'video' ? 'TRK-P01' : null,
        bbox: { x: 340, y: 390, width: 180, height: 75 },
        isDemo: true,
      },
    ];
  },
};

export default detectionService;
