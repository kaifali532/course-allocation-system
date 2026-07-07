import { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { DataTable } from '../components/DataTable';
import { StudentModal } from '../components/StudentModal';
import { Plus, User, Edit2, Trash2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import toast from 'react-hot-toast';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);

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

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/students/${id}`);
        toast.success('Student deleted successfully');
        fetchStudents();
      } catch (error: any) {
        console.error('Failed to delete student', error);
        toast.error(error?.response?.data?.message || 'Failed to delete student');
      }
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
            <div className="w-8 h-8 rounded bg-indigo-500/10 flex items-center justify-center">
              <User className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="font-semibold text-slate-200">{info.getValue()}</span>
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
            <div className="w-16 h-2 bg-[#22222a] rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full" 
                style={{ width: `${Math.min(100, Number(info.getValue()))}%` }}
              />
            </div>
            <span className="text-slate-300 font-medium">{info.getValue()}%</span>
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
                className="p-1.5 rounded bg-[#1a1a24] text-slate-400 hover:text-indigo-400 hover:bg-[#22222a] transition-colors border border-[#2a2a35]"
                title="Edit Student"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(student.id)}
                className="p-1.5 rounded bg-[#1a1a24] text-slate-400 hover:text-red-400 hover:bg-[#22222a] transition-colors border border-[#2a2a35]"
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
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Student Directory</h1>
          <p className="text-slate-400 mt-1 text-sm">Manage student profiles, categories, and entrance marks.</p>
        </div>
        <button 
          onClick={() => { setEditingStudent(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Student
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
    </div>
  );
}
