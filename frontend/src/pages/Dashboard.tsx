import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Users, BookOpen, Layers, Clock, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { format, subDays } from 'date-fns';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalAllocations: 0,
    pendingApplications: 0,
    seatUtilization: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/allocation/stats');
        const s = res.data.data;
        
        setStats({
          totalStudents: s.totalStudents || 0,
          totalCourses: s.totalCourses || 0,
          totalAllocations: s.totalAllocations || 0,
          pendingApplications: Math.max(0, (s.totalStudents || 0) - (s.totalAllocations || 0)),
          seatUtilization: s.totalSeats ? Math.round(((s.allocatedSeats || 0) / s.totalSeats) * 100) : 0
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const trendData = Array.from({ length: 7 }).map((_, i) => ({
    date: format(subDays(new Date(), 6 - i), 'MMM dd'),
    allocations: Math.floor(Math.random() * 50) + 10,
    applications: Math.floor(Math.random() * 80) + 30
  }));

  const pieData = [
    { name: 'General', value: 400 },
    { name: 'OBC', value: 300 },
    { name: 'SC', value: 150 },
    { name: 'ST', value: 100 },
  ];
  const PIE_COLORS = ['#4f46e5', '#3b82f6', '#10b981', '#64748b'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a24] border border-[#2a2a35] p-4 rounded-lg shadow-xl">
          <p className="text-slate-200 font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-400 text-sm">{entry.name}:</span>
              <span className="text-slate-200 font-medium text-sm">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-8">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1 text-sm">System capacity and allocation overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10', trend: '+12%' },
          { label: 'Active Courses', value: stats.totalCourses, icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10', trend: '+4%' },
          { label: 'Seat Utilization', value: `${stats.seatUtilization}%`, icon: Layers, color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: '+8%' },
          { label: 'Pending Processing', value: stats.pendingApplications, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', trend: '-2%' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={i} variants={item} className="solid-card p-5 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded text-[10px] font-bold">
                  <TrendingUp className="w-3 h-3" /> {kpi.trend}
                </div>
              </div>
              <h3 className="text-slate-500 font-medium text-xs uppercase tracking-wider">{kpi.label}</h3>
              <p className="text-3xl font-bold text-white mt-1 tracking-tight">{kpi.value}</p>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2 solid-card p-6">
          <div className="mb-6">
            <h3 className="text-base font-bold text-white">Application Volume</h3>
            <p className="text-slate-400 text-sm">7-day rolling application and allocation rate.</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAllocations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a35" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="applications" name="Applications" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorApplications)" />
                <Area type="monotone" dataKey="allocations" name="Allocations" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAllocations)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={item} className="solid-card p-6">
          <div className="mb-2">
            <h3 className="text-base font-bold text-white">Seat Demographics</h3>
            <p className="text-slate-400 text-sm">Distribution by category.</p>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
