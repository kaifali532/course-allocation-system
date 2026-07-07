import { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { DataTable } from '../components/DataTable';
import { CourseModal } from '../components/CourseModal';
import { Plus, Book, Edit2, Trash2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

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

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this course? This might fail if students have allocations to it.')) {
      try {
        await api.delete(`/courses/${id}`);
        fetchCourses();
      } catch (error) {
        console.error('Failed to delete course', error);
        alert('Failed to delete course. It might be referenced in allocations.');
      }
    }
  };

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      {
        accessorKey: 'courseId',
        header: 'Code',
        cell: (info) => <span className="font-bold text-slate-200">{info.getValue()}</span>,
      },
      {
        accessorKey: 'courseName',
        header: 'Course Name',
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-violet-500/10 flex items-center justify-center">
              <Book className="w-4 h-4 text-violet-400" />
            </div>
            <span className="font-semibold text-slate-200">{info.getValue()}</span>
          </div>
        ),
      },
      {
        accessorKey: 'department',
        header: 'Department',
        cell: (info) => <span className="text-slate-400">{info.getValue()}</span>,
      },
      {
        accessorKey: 'totalSeats',
        header: 'Total Seats',
        cell: (info) => <span className="text-slate-300 font-medium">{info.getValue()} Seats</span>,
      },
      {
        accessorKey: 'minMarksPercentage',
        header: 'Cutoff (%)',
        cell: (info) => <span className="text-emerald-400 font-semibold">{info.getValue()}%</span>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const course = info.row.original;
          return (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setEditingCourse(course); setIsModalOpen(true); }}
                className="p-1.5 rounded bg-[#1a1a24] text-slate-400 hover:text-indigo-400 hover:bg-[#22222a] transition-colors border border-[#2a2a35]"
                title="Edit Course"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(course.id)}
                className="p-1.5 rounded bg-[#1a1a24] text-slate-400 hover:text-red-400 hover:bg-[#22222a] transition-colors border border-[#2a2a35]"
                title="Delete Course"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        }
      }
    ],
    []
  );

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Course Capacity Matrix</h1>
          <p className="text-slate-400 mt-1 text-sm">Manage available courses, departments, and seat limits.</p>
        </div>
        <button 
          onClick={() => { setEditingCourse(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      <div className="solid-card p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={courses} 
            searchKey="courseName" 
            placeholder="Search courses by name or code..."
          />
        )}
      </div>

      <CourseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCourses}
        course={editingCourse}
      />
    </div>
  );
}
