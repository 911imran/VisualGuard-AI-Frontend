import React from 'react';
import useMediaLibrary from '../../hooks/useMediaLibrary';
import { useWorkflow } from '../../context/WorkflowContext';
import { formatBytes, formatDuration } from '../../utils/formatters';
import { 
  Film, 
  Trash2, 
  Play, 
  RotateCw, 
  HardDrive, 
  Clock, 
  Database,
  Loader2 
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function RecentMediaLibrary() {
  const { mediaList, totalCount, loading, error, isEmpty, refresh, deleteMediaItem } = useMediaLibrary(10);
  const { setMedia, activeMedia } = useWorkflow();

  const handleSelectMedia = (item) => {
    setMedia(item, null);
  };

  const handleDelete = async (e, mediaId) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete media #${mediaId}?`)) {
      await deleteMediaItem(mediaId);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Backend Media Library</h3>
          <Badge variant="default" size="sm">{totalCount} stored</Badge>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="text-xs text-slate-500 hover:text-indigo-600 p-1 rounded transition-colors inline-flex items-center gap-1"
          title="Refresh library"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {loading && mediaList.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
          <span>Querying FastAPI /api/videos...</span>
        </div>
      ) : isEmpty ? (
        <div className="py-8 text-center text-xs text-slate-400 space-y-1">
          <p>No media files found in the backend PostgreSQL database.</p>
          <p className="text-[11px] text-slate-400">Upload a video above to populate this library.</p>
        </div>
      ) : error ? (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mediaList.map((item) => {
            const isSelected = activeMedia?.media_id === item.media_id;
            return (
              <div
                key={item.media_id}
                onClick={() => handleSelectMedia(item)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2.5 truncate">
                    <div className="p-2 rounded-lg bg-slate-100 text-indigo-600 shrink-0">
                      <Film className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-900 truncate" title={item.file_name}>
                        {item.file_name || 'Untitled Video'}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">ID: #{item.media_id}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, item.media_id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors shrink-0"
                    title="Delete from backend"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {formatDuration(item.duration_seconds)}
                  </span>
                  <span>{item.fps ? `${item.fps.toFixed(0)} FPS` : ''}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
