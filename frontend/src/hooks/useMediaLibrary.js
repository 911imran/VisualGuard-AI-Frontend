import { useState, useEffect, useCallback } from 'react';
import mediaService from '../services/mediaService';

/**
 * Hook to manage uploaded media library from FastAPI backend
 */
export function useMediaLibrary(initialLimit = 20) {
  const [mediaList, setMediaList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mediaService.getMediaList(0, initialLimit);
      setMediaList(data?.items || []);
      setTotalCount(data?.total || 0);
    } catch (err) {
      setError(err?.userFriendlyMessage || err.message || 'Failed to load media list.');
    } finally {
      setLoading(false);
    }
  }, [initialLimit]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const deleteMediaItem = async (mediaId) => {
    try {
      await mediaService.deleteMedia(mediaId);
      setMediaList((prev) => prev.filter((item) => item.media_id !== mediaId));
      setTotalCount((prev) => Math.max(0, prev - 1));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err?.userFriendlyMessage || err.message || 'Failed to delete media item.',
      };
    }
  };

  return {
    mediaList,
    totalCount,
    loading,
    error,
    isEmpty: !loading && mediaList.length === 0,
    refresh: fetchMedia,
    deleteMediaItem,
  };
}

export default useMediaLibrary;
