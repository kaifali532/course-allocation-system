import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  student?: any; // null if adding
}

export function StudentModal({ isOpen, onClose, onSuccess, student }: StudentModalProps) {
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    email: '',
    phone: '',
    gender: 'Male',
    marks: '',
    category: 'General',
    preferredCourse1Id: '',
    preferredCourse2Id: '',
    preferredCourse3Id: '',
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Fetch courses for preference dropdowns
      api.get('/courses').then(res => setCourses(res.data.data)).catch(console.error);
      
      if (student) {
        setFormData({
          studentId: student.studentId,
          fullName: student.fullName,
          email: student.email,
          phone: student.phone,
          gender: student.gender,
          marks: student.marks.toString(),
          category: student.category,
          preferredCourse1Id: student.preferredCourse1Id || '',
          preferredCourse2Id: student.preferredCourse2Id || '',
          preferredCourse3Id: student.preferredCourse3Id || '',
        });
      } else {
        setFormData({
          studentId: '',
          fullName: '',
          email: '',
          phone: '',
          gender: 'Male',
          marks: '',
          category: 'General',
          preferredCourse1Id: '',
          preferredCourse2Id: '',
          preferredCourse3Id: '',
        });
      }
      setError('');
    }
  }, [isOpen, student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        marks: parseFloat(formData.marks)
      };

      if (student) {
        await api.put(`/students/${student.id}`, payload);
        toast.success('Student updated successfully');
      } else {
        await api.post('/students', payload);
        toast.success('Student added successfully');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'An error occurred';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-[32px] bg-black/60 backdrop-blur-3xl border border-white/10 p-8 text-left align-middle shadow-[0_40px_80px_rgba(0,0,0,0.8)] transition-all relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                <Dialog.Title as="div" className="flex items-center justify-between mb-8 relative z-10">
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {student ? 'Edit Student' : 'Add New Student'}
                  </h3>
                  <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors border border-transparent hover:border-white/10">
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Title>

                {error && (
                  <div className="mb-6 bg-red-500/20 border border-red-500/30 text-red-100 p-4 rounded-2xl text-sm font-medium backdrop-blur-md relative z-10">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-white/50 mb-2 uppercase tracking-widest">Student ID</label>
                      <input 
                        type="text" 
                        required
                        value={formData.studentId}
                        onChange={e => setFormData({...formData, studentId: e.target.value})}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/30 backdrop-blur-md shadow-inner"
                        placeholder="e.g. STU12345"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-white/50 mb-2 uppercase tracking-widest">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.fullName}
                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/30 backdrop-blur-md shadow-inner"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-white/50 mb-2 uppercase tracking-widest">Email</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/30 backdrop-blur-md shadow-inner"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-white/50 mb-2 uppercase tracking-widest">Phone</label>
                      <input 
                        type="text" 
                        required
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/30 backdrop-blur-md shadow-inner"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-white/50 mb-2 uppercase tracking-widest">Gender</label>
                      <select 
                        value={formData.gender}
                        onChange={e => setFormData({...formData, gender: e.target.value})}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-white/40 transition-all backdrop-blur-md shadow-inner appearance-none"
                      >
                        <option value="Male" className="bg-zinc-900">Male</option>
                        <option value="Female" className="bg-zinc-900">Female</option>
                        <option value="Other" className="bg-zinc-900">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-white/50 mb-2 uppercase tracking-widest">Category</label>
                      <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-white/40 transition-all backdrop-blur-md shadow-inner appearance-none"
                      >
                        <option value="General" className="bg-zinc-900">General</option>
                        <option value="OBC" className="bg-zinc-900">OBC</option>
                        <option value="SC" className="bg-zinc-900">SC</option>
                        <option value="ST" className="bg-zinc-900">ST</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-white/50 mb-2 uppercase tracking-widest">Entrance Exam Marks</label>
                      <input 
                        type="number" 
                        required
                        step="0.1"
                        value={formData.marks}
                        onChange={e => setFormData({...formData, marks: e.target.value})}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/30 backdrop-blur-md shadow-inner"
                        placeholder="e.g. 95.5"
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6 mt-8">
                    <h4 className="text-sm font-bold text-white mb-5">Course Preferences</h4>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-[11px] font-bold text-emerald-400/80 mb-2 uppercase tracking-widest">Preference 1 (Required)</label>
                        <select 
                          required
                          value={formData.preferredCourse1Id}
                          onChange={e => setFormData({...formData, preferredCourse1Id: e.target.value})}
                          className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/60 transition-all backdrop-blur-md shadow-inner appearance-none"
                        >
                          <option value="" className="bg-zinc-900 text-white/50">Select a course...</option>
                          {courses.map((c: any) => (
                            <option key={c.id} value={c.id} className="bg-zinc-900">{c.courseName} ({c.courseId})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-white/50 mb-2 uppercase tracking-widest">Preference 2 (Optional)</label>
                        <select 
                          value={formData.preferredCourse2Id}
                          onChange={e => setFormData({...formData, preferredCourse2Id: e.target.value})}
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-white/40 transition-all backdrop-blur-md shadow-inner appearance-none"
                        >
                          <option value="" className="bg-zinc-900 text-white/50">Select a course...</option>
                          {courses.map((c: any) => (
                            <option key={c.id} value={c.id} className="bg-zinc-900">{c.courseName} ({c.courseId})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-white/50 mb-2 uppercase tracking-widest">Preference 3 (Optional)</label>
                        <select 
                          value={formData.preferredCourse3Id}
                          onChange={e => setFormData({...formData, preferredCourse3Id: e.target.value})}
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-white/40 transition-all backdrop-blur-md shadow-inner appearance-none"
                        >
                          <option value="" className="bg-zinc-900 text-white/50">Select a course...</option>
                          {courses.map((c: any) => (
                            <option key={c.id} value={c.id} className="bg-zinc-900">{c.courseName} ({c.courseId})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 flex items-center justify-end gap-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 text-sm font-semibold text-white/60 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-2.5 bg-white text-black text-sm font-bold rounded-xl shadow-lg hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-xl transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {loading ? 'Saving...' : 'Save Student'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
