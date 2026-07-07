import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Users, BookOpen, UserCheck, UserX } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    allocatedStudents: 0,
    rejectedStudents: 0,
    totalCourses: 0,
    availableSeats: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, courses] = await Promise.all([
          api.get('/students?limit=10000'),
          api.get('/courses')
        ]);
        
        const allStudents = students.data.data;
        const allCourses = courses.data.data;

        setStats({
          totalStudents: allStudents.length,
          allocatedStudents: allStudents.filter((s: any) => s.status === 'ALLOCATED').length,
          rejectedStudents: allStudents.filter((s: any) => s.status === 'REJECTED').length,
          totalCourses: allCourses.length,
          availableSeats: allCourses.reduce((acc: number, c: any) => acc + c.availableSeats, 0)
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  const pieData = [
    { name: 'Allocated', value: stats.allocatedStudents, color: '#4f46e5' },
    { name: 'Pending', value: stats.totalStudents - stats.allocatedStudents - stats.rejectedStudents, color: '#f59e0b' },
    { name: 'Rejected', value: stats.rejectedStudents, color: '#ef4444' },
  ];

  const barData = [
    { name: 'Courses', total: stats.totalCourses },
    { name: 'Students', total: stats.totalStudents },
  ];

  return (
    <div className="space-y-6 fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={stats.totalStudents} icon={<Users />} color="text-blue-500" bg="bg-blue-50 dark:bg-blue-500/10" />
        <StatCard title="Total Courses" value={stats.totalCourses} icon={<BookOpen />} color="text-indigo-500" bg="bg-indigo-50 dark:bg-indigo-500/10" />
        <StatCard title="Allocated" value={stats.allocatedStudents} icon={<UserCheck />} color="text-emerald-500" bg="bg-emerald-50 dark:bg-emerald-500/10" />
        <StatCard title="Not Allocated" value={stats.rejectedStudents} icon={<UserX />} color="text-red-500" bg="bg-red-50 dark:bg-red-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 tracking-tight">Allocation Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: d.color }} />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 tracking-tight">System Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, bg }: any) {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md cursor-default">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color}`}>
        {icon}
      </div>
    </div>
  );
}
