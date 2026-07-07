import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api } from '../services/api';

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
      } else {
        await api.post('/courses', payload);
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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-xl bg-[#111118] border border-[#22222a] p-6 text-left align-middle shadow-2xl transition-all">
                <Dialog.Title as="div" className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-100">
                    {course ? 'Edit Course' : 'Add New Course'}
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
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Course Code</label>
                    <input 
                      type="text" 
                      required
                      value={formData.courseId}
                      onChange={e => setFormData({...formData, courseId: e.target.value})}
                      className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a35] rounded-md text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      placeholder="e.g. CS101"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Course Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.courseName}
                      onChange={e => setFormData({...formData, courseName: e.target.value})}
                      className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a35] rounded-md text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      placeholder="Introduction to Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Department</label>
                    <input 
                      type="text" 
                      required
                      value={formData.department}
                      onChange={e => setFormData({...formData, department: e.target.value})}
                      className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a35] rounded-md text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      placeholder="Computer Science"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Total Seats</label>
                      <input 
                        type="number" 
                        required
                        min="1"
                        value={formData.totalSeats}
                        onChange={e => setFormData({...formData, totalSeats: e.target.value})}
                        className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a35] rounded-md text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        placeholder="e.g. 100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Min Marks (%)</label>
                      <input 
                        type="number" 
                        required
                        step="0.1"
                        min="0"
                        max="100"
                        value={formData.minMarksPercentage}
                        onChange={e => setFormData({...formData, minMarksPercentage: e.target.value})}
                        className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a35] rounded-md text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        placeholder="e.g. 60.0"
                      />
                    </div>
                  </div>

                  <div className="pt-6 flex items-center justify-end gap-3 border-t border-[#22222a] mt-6">
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
