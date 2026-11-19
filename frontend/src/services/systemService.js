import apiClient from './apiClient.js';

/**
 * System and Health Service
 * Directly interacts with FastAPI system routes (`/` and `/health`).
 */
export const systemService = {
  /**
   * Fetch application metadata and version
   */
  async getAppInfo() {
    const response = await apiClient.get('/');
    return response.data;
  },

  /**
   * Check FastAPI server status and PostgreSQL database connectivity
   */
  async checkHealth() {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

export default systemService;
