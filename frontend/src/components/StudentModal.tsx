import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api } from '../services/api';

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
      } else {
        await api.post('/students', payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-[#111118] border border-[#22222a] p-6 text-left align-middle shadow-2xl transition-all">
                <Dialog.Title as="div" className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-100">
                    {student ? 'Edit Student' : 'Add New Student'}
                  </h3>
                  <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#1a1a24] text-slate-400 hover:text-slate-200 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Title>

                {error && (
                  <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Student ID</label>
                      <input 
                        type="text" 
                        required
                        value={formData.studentId}
                        onChange={e => setFormData({...formData, studentId: e.target.value})}
                        className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a35] rounded-md text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        placeholder="e.g. STU12345"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.fullName}
                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                        className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a35] rounded-md text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a35] rounded-md text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Phone</label>
                      <input 
                        type="text" 
                        required
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a35] rounded-md text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Gender</label>
                      <select 
                        value={formData.gender}
                        onChange={e => setFormData({...formData, gender: e.target.value})}
                        className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a35] rounded-md text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
                      <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a35] rounded-md text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      >
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Entrance Exam Marks</label>
                      <input 
                        type="number" 
                        required
                        step="0.1"
                        value={formData.marks}
                        onChange={e => setFormData({...formData, marks: e.target.value})}
                        className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a35] rounded-md text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        placeholder="e.g. 95.5"
                      />
                    </div>
                  </div>

                  <div className="border-t border-[#22222a] pt-4 mt-6">
                    <h4 className="text-sm font-semibold text-slate-200 mb-4">Course Preferences</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-indigo-400 mb-1.5 uppercase tracking-wider">Preference 1 (Required)</label>
                        <select 
                          required
                          value={formData.preferredCourse1Id}
                          onChange={e => setFormData({...formData, preferredCourse1Id: e.target.value})}
                          className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a35] rounded-md text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        >
                          <option value="">Select a course...</option>
                          {courses.map((c: any) => (
                            <option key={c.id} value={c.id}>{c.courseName} ({c.courseId})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Preference 2 (Optional)</label>
                        <select 
                          value={formData.preferredCourse2Id}
                          onChange={e => setFormData({...formData, preferredCourse2Id: e.target.value})}
                          className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a35] rounded-md text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        >
                          <option value="">Select a course...</option>
                          {courses.map((c: any) => (
                            <option key={c.id} value={c.id}>{c.courseName} ({c.courseId})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Preference 3 (Optional)</label>
                        <select 
                          value={formData.preferredCourse3Id}
                          onChange={e => setFormData({...formData, preferredCourse3Id: e.target.value})}
                          className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a35] rounded-md text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        >
                          <option value="">Select a course...</option>
                          {courses.map((c: any) => (
                            <option key={c.id} value={c.id}>{c.courseName} ({c.courseId})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-md shadow-sm transition-colors disabled:opacity-50"
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
