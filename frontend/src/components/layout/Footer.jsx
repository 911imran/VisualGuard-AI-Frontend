import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>VisualGuard AI — Final Year Project | Computer Science</p>
        <p className="text-slate-400">Privacy-preserving visual anonymization for Human Faces & Vehicle Plates</p>
      </div>
    </footer>
  );
}
