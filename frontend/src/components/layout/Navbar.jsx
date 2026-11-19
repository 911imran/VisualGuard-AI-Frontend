import React, { useState, useEffect } from 'react';
import { Shield, Server, CheckCircle2, AlertCircle } from 'lucide-react';
import { systemService } from '../../services/systemService';

export default function Navbar() {
  const [healthStatus, setHealthStatus] = useState('checking'); // 'checking' | 'healthy' | 'offline'

  useEffect(() => {
    let isMounted = true;
    async function testBackend() {
      try {
        const health = await systemService.checkHealth();
        if (isMounted) {
          setHealthStatus(health?.status === 'healthy' ? 'healthy' : 'degraded');
        }
      } catch (err) {
        if (isMounted) {
          setHealthStatus('offline');
        }
      }
    }
    testBackend();
    const interval = setInterval(testBackend, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">VisualGuard AI</span>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded border border-indigo-200">
                FYP
              </span>
            </div>
            <p className="text-xs text-slate-500">AI-Based Visual Privacy Protection System</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full border bg-slate-50">
            <Server className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-600 font-medium">Backend:</span>
            {healthStatus === 'healthy' && (
              <span className="flex items-center text-emerald-600 font-semibold space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Online (PostgreSQL Connected)</span>
              </span>
            )}
            {healthStatus === 'degraded' && (
              <span className="flex items-center text-amber-600 font-semibold space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Degraded (DB Disconnected)</span>
              </span>
            )}
            {healthStatus === 'offline' && (
              <span className="flex items-center text-rose-500 font-semibold space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Offline (:8000)</span>
              </span>
            )}
            {healthStatus === 'checking' && (
              <span className="text-slate-400">Connecting...</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
