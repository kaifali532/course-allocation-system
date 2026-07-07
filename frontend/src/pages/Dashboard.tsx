import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Users, BookOpen, Layers, Clock, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalAllocations: 0,
    pendingAllocations: 0,
    seatUtilization: 0,
    recentActivity: [] as any[]
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics');
        const s = res.data.data;
        
        setStats({
          totalStudents: s.totalStudents || 0,
          totalCourses: s.totalCourses || 0,
          totalAllocations: s.totalAllocations || 0,
          pendingAllocations: s.pendingAllocations || 0,
          seatUtilization: s.totalSeats ? Math.round(((s.allocatedSeats || 0) / s.totalSeats) * 100) : 0,
          recentActivity: s.recentActivity || []
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-white/70 text-sm">{entry.name}:</span>
              <span className="text-white font-medium text-sm">{entry.value}</span>
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
        <div className="w-8 h-8 rounded-full border-t-2 border-white animate-spin"></div>
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
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const kpis = [
    { label: 'Students', desc: 'Total Enrolled', value: stats.totalStudents, icon: Users, bg: "bg-[url('/card-students.png')]", path: '/students' },
    { label: 'Courses', desc: 'Active Courses', value: stats.totalCourses, icon: BookOpen, bg: "bg-[url('/card-courses.png')]", path: '/courses' },
    { label: 'Seat Utilization', desc: 'Overall Capacity', value: `${stats.seatUtilization}%`, icon: Layers, bg: "bg-[url('/card-seats.png')]", path: '/analytics' },
    { label: 'Pending Allocations', desc: 'Awaiting Processing', value: stats.pendingAllocations, icon: Clock, bg: "bg-[url('/card-pending.png')]", path: '/allocations' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 pb-8 h-full">
      
      {/* Large Hero Banner mimicking the reference game banner */}
      <motion.div 
        variants={item}
        className="w-full h-[360px] rounded-[32px] overflow-hidden relative group shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/5"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#100c0a]/95 via-[#100c0a]/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('/hero-banner.png')] bg-cover bg-center transition-transform duration-[20s] group-hover:scale-105" />
        
        <div className="absolute inset-0 z-20 p-12 flex flex-col justify-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white/80 font-medium text-sm">Good morning, Admin</span>
              <span className="text-xl">👋</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-xl">
              University Allocation Cycle
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-10 drop-shadow-md max-w-lg">
              Manage students, courses, and allocations efficiently with AI-powered insights.
            </p>
            <div className="flex gap-4">
              <button onClick={() => navigate('/allocations')} className="px-8 py-3.5 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-[0_10px_20px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 duration-300">
                ▶ Run Allocation
              </button>
              <button onClick={() => navigate('/analytics')} className="px-8 py-3.5 bg-black/40 backdrop-blur-md text-white border border-white/10 font-bold rounded-full hover:bg-white/10 hover:border-white/20 transition-colors shadow-lg hover:-translate-y-0.5 duration-300">
                📊 View Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Absolute side widgets as in reference */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20 hidden lg:flex">
           <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-5 rounded-3xl w-64 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                  <Clock className="w-5 h-5 text-white/70" />
                </div>
                <div>
                  <p className="text-xs text-white/50 font-medium">Current Cycle</p>
                  <p className="text-sm text-white font-bold">Even Semester 2026</p>
                </div>
              </div>
           </div>
           <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-5 rounded-3xl w-64 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <span className="text-emerald-400 font-bold text-sm">65%</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/50 font-medium mb-2">Allocation Progress</p>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[65%] h-full bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                  </div>
                </div>
              </div>
           </div>
        </div>
      </motion.div>

      <div className="flex items-center justify-between mt-4">
        <h2 className="text-xl font-bold text-white tracking-wide">University Metrics</h2>
        <button className="px-4 py-1.5 rounded-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium">
          See more
        </button>
      </div>

      {/* Game-inspired Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div 
              key={i} 
              variants={item} 
              onClick={() => navigate(kpi.path)}
              className="game-card h-[280px] cursor-pointer group"
            >
              <div className={cn("game-card-bg", kpi.bg)} />
              <div className="game-card-overlay" />
              
              <div className="absolute top-5 left-5 flex items-center z-10">
                <span className="px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/90 text-[13px] font-semibold flex items-center gap-2 shadow-lg group-hover:bg-black/60 transition-colors">
                  <Icon className="w-4 h-4 text-white/70" />
                  {kpi.label}
                </span>
              </div>

              <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/30 backdrop-blur-md border border-white/5 flex items-center justify-center text-white/50 group-hover:bg-white/10 group-hover:text-white transition-all z-10">
                <ArrowUpRight className="w-4 h-4" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col z-10">
                <h3 className="text-5xl lg:text-6xl font-bold text-white mb-1 tracking-tighter drop-shadow-xl">{kpi.value}</h3>
                <p className="text-white/70 text-[15px] font-medium drop-shadow-sm">{kpi.desc}</p>
                
                <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center self-end mt-4 shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 pt-4">
        <motion.div variants={item} className="solid-card p-8">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white">Application Volume</h3>
            <p className="text-white/50 text-sm">7-day rolling application and allocation rate.</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAllocations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12}} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="applications" name="Applications" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#colorApplications)" />
                <Area type="monotone" dataKey="allocations" name="Allocations" stroke="#34d399" strokeWidth={2} fillOpacity={1} fill="url(#colorAllocations)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* New sections added for depth */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="solid-card p-8">
            <h3 className="text-xl font-bold text-white mb-6">Recent Student Activity</h3>
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map(j => (
                <div key={j} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer" onClick={() => navigate('/students')}>
                  <div className="flex flex-col">
                    <span className="text-white font-medium">New Registration</span>
                    <span className="text-white/50 text-sm">Student ID: 20260{j}</span>
                  </div>
                  <span className="text-emerald-400 text-sm font-semibold">Active</span>
                </div>
              ))}
            </div>
          </div>
          <div className="solid-card p-8">
            <h3 className="text-xl font-bold text-white mb-6">System Health</h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                <span className="text-white">Database</span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">Optimal</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                <span className="text-white">AI Engine</span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">Online</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                <span className="text-white">API Latency</span>
                <span className="text-white/70 font-mono text-sm">24ms</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
