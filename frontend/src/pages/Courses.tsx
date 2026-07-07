import { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { DataTable } from '../components/DataTable';
import { CourseModal } from '../components/CourseModal';
import { Plus, Book, Edit2, Trash2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import toast from 'react-hot-toast';
import { ConfirmDialog } from '../components/ConfirmDialog';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [confirmState, setConfirmState] = useState<{ isOpen: boolean; courseId: string | null }>({ isOpen: false, courseId: null });

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

  const handleDelete = async () => {
    if (!confirmState.courseId) return;
    try {
      await api.delete(`/courses/${confirmState.courseId}`);
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (error: any) {
      console.error('Failed to delete course', error);
      toast.error(error?.response?.data?.message || 'Failed to delete course');
    }
  };

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      {
        accessorKey: 'courseId',
        header: 'Code',
        cell: (info) => <span className="font-bold text-white/80">{info.getValue()}</span>,
      },
      {
        accessorKey: 'courseName',
        header: 'Course Name',
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
              <Book className="w-4 h-4 text-white/70" />
            </div>
            <span className="font-semibold text-white/90">{info.getValue()}</span>
          </div>
        ),
      },
      {
        accessorKey: 'department',
        header: 'Department',
        cell: (info) => <span className="text-white/60">{info.getValue()}</span>,
      },
      {
        accessorKey: 'totalSeats',
        header: 'Total Seats',
        cell: (info) => <span className="text-white/80 font-medium">{info.getValue()} Seats</span>,
      },
      {
        accessorKey: 'minMarksPercentage',
        header: 'Cutoff (%)',
        cell: (info) => <span className="text-emerald-400/90 font-bold">{info.getValue()}%</span>,
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
                className="p-2 rounded-xl bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors border border-white/5"
                title="Edit Course"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setConfirmState({ isOpen: true, courseId: course.id })}
                className="p-2 rounded-xl bg-white/5 text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-white/5"
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
    <div className="space-y-6 fade-in h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">Course Capacity Matrix</h1>
          <p className="text-white/60 mt-1 text-sm">Manage available courses, departments, and seat limits.</p>
        </div>
        <button 
          onClick={() => { setEditingCourse(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-gray-200 rounded-full text-sm font-bold transition-all shadow-[0_10px_20px_rgba(255,255,255,0.15)] hover:-translate-y-0.5 duration-300"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 rounded-full border-t-2 border-white animate-spin"></div>
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
      
      <ConfirmDialog 
        isOpen={confirmState.isOpen}
        title="Delete Course"
        message="Are you sure you want to delete this course? This might fail if students currently have allocations to it."
        confirmText="Delete Course"
        onConfirm={handleDelete}
        onCancel={() => setConfirmState({ isOpen: false, courseId: null })}
        isDestructive={true}
      />
    </div>
  );
}
