/**
 * Formatting utilities for VisualGuard AI
 */

/**
 * Format bytes into human-readable strings (KB, MB, GB)
 * @param {number} bytes 
 * @returns {string}
 */
export function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Format seconds into mm:ss or hh:mm:ss
 * @param {number} seconds 
 * @returns {string}
 */
export function formatDuration(seconds) {
  if (seconds === undefined || seconds === null) return '00:00';
  const secNum = Math.floor(seconds);
  const hrs = Math.floor(secNum / 3600);
  const mins = Math.floor((secNum % 3600) / 60);
  const secs = secNum % 60;

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Determine if file is supported image or video
 * @param {File} file 
 * @returns {{ isValid: boolean, type: 'video' | 'image' | 'unknown', error?: string }}
 */
export function validateMediaFile(file) {
  if (!file) return { isValid: false, type: 'unknown', error: 'No file provided.' };

  const validVideoTypes = ['video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/x-matroska', 'video/webm'];
  const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

  const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  const validVideoExts = ['.mp4', '.avi', '.mov', '.mkv', '.webm'];
  const validImageExts = ['.jpg', '.jpeg', '.png', '.webp'];

  if (validVideoTypes.includes(file.type) || validVideoExts.includes(extension)) {
    return { isValid: true, type: 'video' };
  }
  if (validImageTypes.includes(file.type) || validImageExts.includes(extension)) {
    return { isValid: true, type: 'image' };
  }

  return {
    isValid: false,
    type: 'unknown',
    error: `Unsupported file format (${extension || file.type || 'unknown'}). Supported: MP4, AVI, MOV, MKV, WEBM, JPG, PNG, WEBP.`,
  };
}
