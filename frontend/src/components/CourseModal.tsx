import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  course?: any;
}

export function CourseModal({ isOpen, onClose, onSuccess, course }: CourseModalProps) {
  const [formData, setFormData] = useState({
    courseId: '',
    courseName: '',
    department: '',
    totalSeats: '',
    minMarksPercentage: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (course) {
        setFormData({
          courseId: course.courseId,
          courseName: course.courseName,
          department: course.department,
          totalSeats: course.totalSeats.toString(),
          minMarksPercentage: course.minMarksPercentage.toString()
        });
      } else {
        setFormData({
          courseId: '',
          courseName: '',
          department: '',
          totalSeats: '',
          minMarksPercentage: ''
        });
      }
      setError('');
    }
  }, [isOpen, course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        totalSeats: parseInt(formData.totalSeats, 10),
        minMarksPercentage: parseFloat(formData.minMarksPercentage)
      };

      if (course) {
        await api.put(`/courses/${course.id}`, payload);
        toast.success('Course updated successfully');
      } else {
        await api.post('/courses', payload);
        toast.success('Course added successfully');
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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-[32px] bg-black/60 backdrop-blur-3xl border border-white/10 p-8 text-left align-middle shadow-[0_40px_80px_rgba(0,0,0,0.8)] transition-all relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                <Dialog.Title as="div" className="flex items-center justify-between mb-8 relative z-10">
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {course ? 'Edit Course' : 'Add New Course'}
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
                  <div>
                    <label className="block text-[11px] font-bold text-white/50 mb-2 uppercase tracking-widest">Course Code</label>
                    <input 
                      type="text" 
                      required
                      value={formData.courseId}
                      onChange={e => setFormData({...formData, courseId: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/30 backdrop-blur-md shadow-inner"
                      placeholder="e.g. CS101"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/50 mb-2 uppercase tracking-widest">Course Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.courseName}
                      onChange={e => setFormData({...formData, courseName: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/30 backdrop-blur-md shadow-inner"
                      placeholder="Introduction to Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/50 mb-2 uppercase tracking-widest">Department</label>
                    <input 
                      type="text" 
                      required
                      value={formData.department}
                      onChange={e => setFormData({...formData, department: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/30 backdrop-blur-md shadow-inner"
                      placeholder="Computer Science"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-white/50 mb-2 uppercase tracking-widest">Total Seats</label>
                      <input 
                        type="number" 
                        required
                        min="1"
                        value={formData.totalSeats}
                        onChange={e => setFormData({...formData, totalSeats: e.target.value})}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/30 backdrop-blur-md shadow-inner"
                        placeholder="e.g. 100"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-white/50 mb-2 uppercase tracking-widest">Min Marks (%)</label>
                      <input 
                        type="number" 
                        required
                        step="0.1"
                        min="0"
                        max="100"
                        value={formData.minMarksPercentage}
                        onChange={e => setFormData({...formData, minMarksPercentage: e.target.value})}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/30 backdrop-blur-md shadow-inner"
                        placeholder="e.g. 60.0"
                      />
                    </div>
                  </div>

                  <div className="pt-8 flex items-center justify-end gap-4 border-t border-white/10 mt-8">
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
                      {loading ? 'Saving...' : 'Save Course'}
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
