import { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { DataTable } from '../components/DataTable';
import { Plus, User } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get(`/students`);
        setStudents(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'studentId',
      header: 'Student ID',
      cell: info => <span className="font-medium text-slate-900 dark:text-slate-100">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'fullName',
      header: 'Full Name',
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-xs border border-indigo-200 dark:border-indigo-800">
            {(info.getValue() as string).charAt(0)}
          </div>
          <span className="font-medium">{info.getValue() as string}</span>
        </div>
      ),
    },
    {
      accessorKey: 'marks',
      header: 'Marks',
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: info => (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {info.getValue() as string}
        </span>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: info => {
        const status = info.getValue() as string;
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
            status === 'ALLOCATED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
            status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' :
            'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
          }`}>
            {status}
          </span>
        );
      }
    },
  ], []);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Students</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage student applications and details.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-sm shadow-indigo-500/20">
          <Plus className="w-4 h-4" /> Add Student
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={students} searchKey="fullName" placeholder="Search students by name or ID..." />
      )}
    </div>
  );
}
