import { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { DataTable } from '../components/DataTable';
import { Download, CheckCircle, FileText, Loader2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ConfirmDialog } from '../components/ConfirmDialog';

export default function Allocations() {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningEngine, setRunningEngine] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/allocation/results');
      setAllocations(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  const handleRunEngine = async () => {
    
    setRunningEngine(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/allocation/run');
      setSuccess('Allocation engine executed successfully.');
      fetchAllocations();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to run allocation engine.');
    } finally {
      setRunningEngine(false);
    }
  };

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'student.studentId',
      id: 'studentId',
      header: 'Student ID',
      cell: info => <span className="font-bold text-white/50">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'student.fullName',
      id: 'studentName',
      header: 'Student Name',
      cell: info => <span className="text-white/70 font-semibold">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'course.courseName',
      id: 'courseName',
      header: 'Allocated Course',
      cell: info => <span className="font-bold text-white/90 drop-shadow-sm">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'allocatedCategory',
      header: 'Seat Category',
      cell: info => (
        <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 text-white/80 border border-white/10 shadow-inner">
          {info.getValue() as string}
        </span>
      )
    },
    {
      accessorKey: 'preferenceNumber',
      header: 'Preference',
      cell: info => {
        const pref = info.getValue() as number;
        return (
          <div className="flex items-center gap-2">
            <span className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold border shadow-inner ${
              pref === 1 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
              pref === 2 ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
              'bg-white/5 text-white/50 border-white/10'
            }`}>
              {pref}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: info => <span className="text-white/40 text-xs font-medium">{format(new Date(info.getValue() as string), 'MMM dd, yyyy HH:mm')}</span>,
    },
  ], []);

  return (
    <div className="space-y-6 fade-in h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">Allocation Results</h1>
          <p className="text-white/60 mt-1 text-sm">View final allocations and trigger the execution engine.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 bg-black/40 backdrop-blur-md border border-white/5 hover:border-white/10 hover:bg-white/5 text-white/70 hover:text-white rounded-full text-sm font-semibold transition-all shadow-[0_10px_20px_rgba(0,0,0,0.3)] flex items-center gap-2 hover:-translate-y-0.5 duration-300">
            <FileText className="w-4 h-4" /> Export CSV
          </button>
          <button 
            onClick={() => setIsConfirmOpen(true)}
            disabled={runningEngine}
            className="px-6 py-2.5 bg-white text-black hover:bg-gray-200 rounded-full text-sm font-bold transition-all shadow-[0_10px_20px_rgba(255,255,255,0.15)] flex items-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none hover:-translate-y-0.5 duration-300"
          >
            {runningEngine ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            {runningEngine ? 'Running...' : 'Run Engine'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-100 p-4 rounded-2xl text-sm font-medium backdrop-blur-md shrink-0 shadow-lg relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent rounded-2xl pointer-events-none" />
          <div className="relative z-10">{error}</div>
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-100 p-4 rounded-2xl text-sm font-medium backdrop-blur-md shrink-0 shadow-lg relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-2xl pointer-events-none" />
          <div className="relative z-10">{success}</div>
        </div>
      )}

      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-64">
             <div className="w-8 h-8 rounded-full border-t-2 border-white animate-spin"></div>
          </div>
        ) : (
          <DataTable columns={columns} data={allocations} searchKey="studentName" placeholder="Search allocations by student name..." />
        )}
      </div>

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        title="Run Allocation Engine"
        message="Are you sure you want to run the allocation engine? This will wipe the current allocations and recompute everything based on current student preferences, categories, and course capacities."
        confirmText="Run Engine"
        onConfirm={handleRunEngine}
        onCancel={() => setIsConfirmOpen(false)}
        isDestructive={false}
      />
    </div>
  );
}
