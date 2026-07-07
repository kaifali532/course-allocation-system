import { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { DataTable } from '../components/DataTable';
import { StudentModal } from '../components/StudentModal';
import { Plus, User, Edit2, Trash2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import toast from 'react-hot-toast';
import { ConfirmDialog } from '../components/ConfirmDialog';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  
  // Confirm Dialog State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    studentId: string | null;
  }>({ isOpen: false, studentId: null });

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async () => {
    if (!confirmState.studentId) return;
    try {
      await api.delete(`/students/${confirmState.studentId}`);
      toast.success('Student deleted successfully');
      fetchStudents();
    } catch (error: any) {
      console.error('Failed to delete student', error);
      toast.error(error?.response?.data?.message || 'Failed to delete student');
    }
  };

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      {
        accessorKey: 'studentId',
        header: 'ID',
        cell: (info) => <span className="font-medium text-slate-200">{info.getValue()}</span>,
      },
      {
        accessorKey: 'fullName',
        header: 'Full Name',
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
              <User className="w-4 h-4 text-white/70" />
            </div>
            <span className="font-semibold text-white/90">{info.getValue()}</span>
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: (info) => {
          const val = info.getValue();
          let color = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
          if (val === 'OBC') color = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
          if (val === 'SC') color = 'bg-violet-500/10 text-violet-400 border-violet-500/20';
          if (val === 'ST') color = 'bg-pink-500/10 text-pink-400 border-pink-500/20';
          return (
            <span className={`px-2.5 py-1 rounded text-xs font-semibold border ${color}`}>
              {val}
            </span>
          );
        },
      },
      {
        accessorKey: 'marks',
        header: 'Marks',
        cell: (info) => (
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" 
                style={{ width: `${Math.min(100, Number(info.getValue()))}%` }}
              />
            </div>
            <span className="text-white/80 font-medium text-xs">{info.getValue()}%</span>
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const student = info.row.original;
          return (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setEditingStudent(student); setIsModalOpen(true); }}
                className="p-2 rounded-xl bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors border border-white/5"
                title="Edit Student"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setConfirmState({ isOpen: true, studentId: student.id })}
                className="p-2 rounded-xl bg-white/5 text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-white/5"
                title="Delete Student"
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
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">Student Directory</h1>
          <p className="text-white/60 mt-1 text-sm">Manage student profiles, categories, and entrance marks.</p>
        </div>
        <button 
          onClick={() => { setEditingStudent(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-gray-200 rounded-full text-sm font-bold transition-all shadow-[0_10px_20px_rgba(255,255,255,0.15)] hover:-translate-y-0.5 duration-300"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={students} 
            searchKey="fullName" 
            placeholder="Search students by name..."
          />
        )}
      </div>

      <StudentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchStudents}
        student={editingStudent}
      />

      <ConfirmDialog 
        isOpen={confirmState.isOpen}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone and will remove any allocations associated with them."
        confirmText="Delete Student"
        onConfirm={handleDelete}
        onCancel={() => setConfirmState({ isOpen: false, studentId: null })}
        isDestructive={true}
      />
    </div>
  );
}
