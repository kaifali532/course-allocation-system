import { useState } from 'react';
import { api } from '../services/api';
import { Network, Play, RotateCcw, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { ConfirmDialog } from '../components/ConfirmDialog';

export default function Allocation() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [confirmState, setConfirmState] = useState<{ isOpen: boolean; action: 'run' | 'reset' | null }>({ isOpen: false, action: null });

  const runAllocation = async () => {
    setLoading(true);
    try {
      const res = await api.post('/allocations/run');
      toast.success('Allocation engine ran successfully.');
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error running allocation');
    } finally {
      setLoading(false);
    }
  };

  const resetAllocation = async () => {
    setLoading(true);
    try {
      await api.post('/allocations/reset');
      toast.success('Allocations reset successfully.');
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error resetting allocation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 fade-in max-w-4xl mx-auto">
      <div className="text-center mb-10 mt-8">
        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Network className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Allocation Engine</h2>
        <p className="text-slate-500 mt-2 max-w-xl mx-auto">
          The allocation engine processes student applications based on merit, reservation policies, and application dates to automatically assign courses.
        </p>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow bg-white dark:bg-slate-900">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <Play className="w-5 h-5 text-emerald-500" /> Run Engine
              </h3>
              <p className="text-sm text-slate-500 mb-6">Executes the allocation algorithm on all pending students. This process enforces all business rules.</p>
            </div>
            <button 
              onClick={() => setConfirmState({ isOpen: true, action: 'run' })}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-all shadow-sm active:scale-[0.98]"
            >
              {loading ? 'Processing...' : 'Run Allocation'}
            </button>
          </div>

          <div className="border border-red-100 dark:border-red-900/30 rounded-xl p-6 flex flex-col justify-between bg-red-50/50 dark:bg-red-950/10 hover:shadow-md transition-shadow">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-2 text-red-600 dark:text-red-400">
                <RotateCcw className="w-5 h-5" /> Reset Engine
              </h3>
              <p className="text-sm text-red-500/80 dark:text-red-400/80 mb-6">Wipes all current allocations and sets all students back to pending status. Use with caution.</p>
            </div>
            <button 
              onClick={() => setConfirmState({ isOpen: true, action: 'reset' })}
              disabled={loading}
              className="w-full bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 font-medium py-2.5 rounded-lg transition-all active:scale-[0.98]"
            >
              {loading ? 'Processing...' : 'Reset Allocations'}
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-8 p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex items-start gap-3 fade-in">
            <AlertTriangle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div className="w-full">
              <h4 className="font-medium">Execution Result</h4>
              <div className="mt-3 bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-100 dark:border-slate-800 overflow-x-auto shadow-inner">
                <pre className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog 
        isOpen={confirmState.isOpen}
        title={confirmState.action === 'run' ? 'Run Engine' : 'Reset Engine'}
        message={
          confirmState.action === 'run' 
            ? 'Are you sure you want to run the allocation engine? This will recompute all allocations.'
            : 'Are you sure you want to wipe all current allocations? This action cannot be undone.'
        }
        confirmText={confirmState.action === 'run' ? 'Run' : 'Reset'}
        onConfirm={confirmState.action === 'run' ? runAllocation : resetAllocation}
        onCancel={() => setConfirmState({ isOpen: false, action: null })}
        isDestructive={confirmState.action === 'reset'}
      />
    </div>
  );
}
