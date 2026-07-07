import { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { DataTable } from '../components/DataTable';
import { Download, CheckCircle, FileText, Loader2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export default function Allocations() {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningEngine, setRunningEngine] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    if (!confirm('Are you sure you want to run the allocation engine? This will recompute all allocations based on current student preferences and course capacities.')) return;
    
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
      cell: info => <span className="font-bold text-slate-200">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'student.fullName',
      id: 'studentName',
      header: 'Student Name',
      cell: info => <span className="text-slate-300 font-medium">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'course.courseName',
      id: 'courseName',
      header: 'Allocated Course',
      cell: info => <span className="font-semibold text-indigo-400">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'allocatedCategory',
      header: 'Seat Category',
      cell: info => (
        <span className="px-2.5 py-1 rounded text-xs font-semibold bg-[#22222a] text-slate-300 border border-[#33333f]">
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
          <div className="flex items-center gap-1.5">
            <span className={`flex items-center justify-center w-6 h-6 rounded text-[11px] font-bold ${
              pref === 1 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              pref === 2 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              'bg-[#22222a] text-slate-400 border border-[#33333f]'
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
      cell: info => <span className="text-slate-400 text-xs font-medium">{format(new Date(info.getValue() as string), 'MMM dd, yyyy HH:mm')}</span>,
    },
  ], []);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Allocation Results</h1>
          <p className="text-slate-400 mt-1 text-sm">View final allocations and trigger the execution engine.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-[#111118] border border-[#22222a] hover:border-[#33333f] text-slate-300 hover:text-slate-100 rounded-md text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
            <FileText className="w-4 h-4" /> Export CSV
          </button>
          <button 
            onClick={handleRunEngine}
            disabled={runningEngine}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {runningEngine ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            {runningEngine ? 'Running...' : 'Run Engine'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-md text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-md text-sm font-medium">
          {success}
        </div>
      )}

      <div className="solid-card p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
             <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : (
          <DataTable columns={columns} data={allocations} searchKey="studentName" placeholder="Search allocations by student name..." />
        )}
      </div>
    </div>
  );
}
