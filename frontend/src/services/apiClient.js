import axios from 'axios';

// Universal environment resolution (Vite browser runtime or Node.js)
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) 
  || (typeof process !== 'undefined' && process.env?.VITE_API_BASE_URL) 
  || 'http://127.0.0.1:8000';

/**
 * Centralized Axios client instance configured for VisualGuard AI FastAPI backend.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
  },
});

// Response interceptor for consistent error extraction
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let friendlyMessage = 'An unexpected error occurred. Please check your backend connection.';

    if (error.response) {
      // Backend returned an HTTP status outside 2xx
      const { status, data } = error.response;
      if (status === 404) {
        friendlyMessage = data?.detail || 'Requested resource was not found on the server.';
      } else if (status === 400 || status === 422) {
        friendlyMessage = data?.detail 
          ? (typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail))
          : 'Invalid request data provided.';
      } else if (status >= 500) {
        friendlyMessage = 'The backend encountered an internal error. Please inspect server logs.';
      } else {
        friendlyMessage = data?.detail || `Server responded with status ${status}.`;
      }
    } else if (error.request) {
      // Request made but no response received
      friendlyMessage = `Cannot reach backend at ${API_BASE_URL}. Ensure FastAPI is running on port 8000.`;
    }

    return Promise.reject({
      ...error,
      userFriendlyMessage: friendlyMessage,
    });
  }
);

export default apiClient;
