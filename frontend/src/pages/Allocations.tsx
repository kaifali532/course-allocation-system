import { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { DataTable } from '../components/DataTable';
import { Download, CheckCircle, FileText } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export default function Allocations() {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        const res = await api.get('/allocation/results');
        setAllocations(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllocations();
  }, []);

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'student.studentId',
      id: 'studentId',
      header: 'Student ID',
      cell: info => <span className="font-medium text-slate-900 dark:text-slate-100">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'student.fullName',
      id: 'studentName',
      header: 'Student Name',
    },
    {
      accessorKey: 'course.courseName',
      id: 'courseName',
      header: 'Allocated Course',
      cell: info => <span className="font-medium text-indigo-600 dark:text-indigo-400">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'allocatedCategory',
      header: 'Seat Category',
      cell: info => (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
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
            <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
              pref === 1 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
              pref === 2 ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
              'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
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
      cell: info => <span className="text-slate-500">{format(new Date(info.getValue() as string), 'MMM dd, yyyy')}</span>,
    },
  ], []);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Allocations</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">View and export course allocation results.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2">
            <FileText className="w-4 h-4" /> Export CSV
          </button>
          <button className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-indigo-500/20 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Run Engine
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={allocations} searchKey="studentName" placeholder="Search allocations..." />
      )}
    </div>
  );
}
