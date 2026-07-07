import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Search, Plus } from 'lucide-react';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get(`/courses?search=${search}`);
        setCourses(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    const timer = setTimeout(() => fetchCourses(), 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Courses</h2>
          <p className="text-slate-500">Manage offered courses and seat quotas.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm">
          <Plus className="w-5 h-5" /> Add Course
        </button>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-500 dark:text-slate-400">
                <th className="p-4 font-semibold">Course ID</th>
                <th className="p-4 font-semibold">Course Name</th>
                <th className="p-4 font-semibold">Total Seats</th>
                <th className="p-4 font-semibold">Allocated</th>
                <th className="p-4 font-semibold">Available</th>
                <th className="p-4 font-semibold">Dept</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {courses.length > 0 ? courses.map((course: any) => (
                <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">{course.courseId}</td>
                  <td className="p-4 text-sm font-medium">{course.courseName}</td>
                  <td className="p-4 text-sm">{course.totalSeats}</td>
                  <td className="p-4 text-sm font-medium text-amber-600 dark:text-amber-400">{course.allocatedSeats}</td>
                  <td className="p-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">{course.availableSeats}</td>
                  <td className="p-4 text-sm">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {course.department}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">No courses found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
