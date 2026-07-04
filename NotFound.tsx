import React from 'react';
import { Home, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from './Logo';

export const NotFound: React.FC<{ setActiveTab: (t: string) => void }> = ({ setActiveTab }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-3xl p-10 border border-slate-100 shadow-2xl flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8">
          <AlertTriangle className="w-12 h-12" />
        </div>
        <h1 className="text-6xl font-extrabold text-slate-900 mb-4 tracking-tight">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          The page you are looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors w-full justify-center"
        >
          <Home className="w-5 h-5" /> Back to Dashboard
        </button>
      </motion.div>
    </div>
  );
};
