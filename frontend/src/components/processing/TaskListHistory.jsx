import React, { useState, useEffect } from 'react';
import processingService from '../../services/processingService';
import { Database, RotateCw, Clock, Loader2 } from 'lucide-react';
import Badge from '../common/Badge';

export default function TaskListHistory() {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await processingService.listTasks(0, 10);
      setTasks(data?.items || []);
      setTotal(data?.total || 0);
    } catch (err) {
      setError(err?.userFriendlyMessage || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Backend Processing Task Queue
          </h4>
          <Badge variant="default" size="sm">{total} Tasks</Badge>
        </div>

        <button
          type="button"
          onClick={fetchTasks}
          disabled={loading}
          className="text-xs text-slate-400 hover:text-indigo-600 p-1 rounded transition-colors inline-flex items-center gap-1"
          title="Refresh task list"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {loading && tasks.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
          <span>Querying GET /api/processing/tasks...</span>
        </div>
      ) : tasks.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-400">
          No previous processing tasks recorded in the database.
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.task_id}
              className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-slate-900">Task #{task.task_id}</span>
                  <span className="text-slate-400">• Media #{task.media_id}</span>
                  <span className="font-semibold uppercase text-[10px] text-slate-600 px-1.5 py-0.5 bg-slate-200/60 rounded">
                    {task.protection_type}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {task.created_at ? new Date(task.created_at).toLocaleTimeString() : 'Recent'}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="font-mono text-slate-600">{task.progress || 0}%</span>
                <Badge
                  variant={
                    task.status === 'completed'
                      ? 'success'
                      : task.status === 'failed'
                      ? 'error'
                      : 'warning'
                  }
                  size="sm"
                >
                  {task.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
