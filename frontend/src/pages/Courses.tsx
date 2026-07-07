import { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { DataTable } from '../components/DataTable';
import { Plus, Book } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'courseId',
      header: 'Course ID',
      cell: info => <span className="font-medium text-indigo-600 dark:text-indigo-400">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'courseName',
      header: 'Course Name',
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <Book className="w-4 h-4" />
          </div>
          <span className="font-medium text-slate-900 dark:text-white">{info.getValue() as string}</span>
        </div>
      ),
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: info => (
        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {info.getValue() as string}
        </span>
      )
    },
    {
      accessorKey: 'totalSeats',
      header: 'Total Seats',
    },
    {
      accessorKey: 'allocatedSeats',
      header: 'Allocated',
      cell: info => {
        const allocated = info.getValue() as number;
        const total = info.row.original.totalSeats;
        const percent = Math.round((allocated / total) * 100);
        return (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden w-24">
              <div 
                className={`h-full rounded-full ${percent >= 100 ? 'bg-emerald-500' : percent > 75 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-xs font-medium text-slate-500 w-8">{percent}%</span>
          </div>
        );
      }
    },
  ], []);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Courses</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage course catalog and seat capacities.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-sm shadow-indigo-500/20">
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={courses} searchKey="courseName" placeholder="Search courses by name or ID..." />
      )}
    </div>
  );
}
