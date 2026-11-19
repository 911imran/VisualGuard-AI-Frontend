/**
 * Export Service
 * Manages downloading and exporting protected media outputs for both images and videos.
 * Preserves original media extensions and formats.
 */
export const exportService = {
  /**
   * Trigger browser file download from a Blob or URL
   * 
   * @param {Blob | string} data - File Blob or Object URL
   * @param {string} originalFileName - Name of the original media
   * @param {string} [customSuffix='protected'] - Suffix to append
   */
  downloadMedia(data, originalFileName = 'media.mp4', customSuffix = 'protected') {
    if (!data) {
      throw new Error('No media data provided for download.');
    }

    const dotIndex = originalFileName.lastIndexOf('.');
    const baseName = dotIndex !== -1 ? originalFileName.substring(0, dotIndex) : originalFileName;
    const extension = dotIndex !== -1 ? originalFileName.substring(dotIndex) : '';
    const outputFileName = `${baseName}_${customSuffix}${extension}`;

    let downloadUrl = '';
    let shouldRevoke = false;

    if (data instanceof Blob) {
      downloadUrl = URL.createObjectURL(data);
      shouldRevoke = true;
    } else if (typeof data === 'string') {
      downloadUrl = data;
    } else {
      throw new Error('Unsupported data format for export.');
    }

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', outputFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (shouldRevoke) {
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
    }
  },
};

export default exportService;
