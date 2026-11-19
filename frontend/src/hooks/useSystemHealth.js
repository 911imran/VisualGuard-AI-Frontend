import { useState, useEffect, useCallback } from 'react';
import systemService from '../services/systemService';

/**
 * Hook to monitor FastAPI backend and PostgreSQL database connectivity
 */
export function useSystemHealth(pollIntervalMs = 15000) {
  const [status, setStatus] = useState('checking'); // 'checking' | 'healthy' | 'degraded' | 'offline'
  const [appInfo, setAppInfo] = useState(null);
  const [dbDetails, setDbDetails] = useState('');
  const [lastChecked, setLastChecked] = useState(null);

  const checkHealth = useCallback(async () => {
    try {
      const [infoRes, healthRes] = await Promise.allSettled([
        systemService.getAppInfo(),
        systemService.checkHealth(),
      ]);

      if (infoRes.status === 'fulfilled') {
        setAppInfo(infoRes.value);
      }

      if (healthRes.status === 'fulfilled') {
        const health = healthRes.value;
        const isDbOk = health?.database?.connected;
        setStatus(isDbOk ? 'healthy' : 'degraded');
        setDbDetails(health?.database?.details || '');
      } else {
        // Health check endpoint failed or backend offline
        setStatus('offline');
      }
    } catch {
      setStatus('offline');
    } finally {
      setLastChecked(new Date());
    }
  }, []);

  useEffect(() => {
    checkHealth();
    if (pollIntervalMs > 0) {
      const interval = setInterval(checkHealth, pollIntervalMs);
      return () => clearInterval(interval);
    }
  }, [checkHealth, pollIntervalMs]);

  return {
    status,
    appInfo,
    dbDetails,
    lastChecked,
    isHealthy: status === 'healthy',
    isOffline: status === 'offline',
    isDegraded: status === 'degraded',
    refetch: checkHealth,
  };
}

export default useSystemHealth;
