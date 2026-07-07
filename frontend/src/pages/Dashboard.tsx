import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  BarChart3,
  Clock,
  Activity
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, logsRes] = await Promise.all([
        api.get('/allocation/stats'),
        api.get('/allocation/logs')
      ]);
      setStats(statsRes.data.stats);
      setLogs(logsRes.data.logs.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Derived dummy data for charts based on actual stats (since backend doesn't provide full historical series)
  const allocationRateData = [
    { name: 'Mon', rate: 40 },
    { name: 'Tue', rate: 65 },
    { name: 'Wed', rate: 85 },
    { name: 'Thu', rate: 92 },
    { name: 'Fri', rate: Math.round((stats.allocated / (stats.totalStudents || 1)) * 100) },
  ];

  const categoryData = [
    { name: 'General', value: stats.allocated * 0.5 },
    { name: 'OBC', value: stats.allocated * 0.27 },
    { name: 'SC', value: stats.allocated * 0.15 },
    { name: 'ST', value: stats.allocated * 0.08 },
  ];
  
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Here's what's happening in the system today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
            Export Report
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-indigo-500/20">
            Run Allocation
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Total Students" 
          value={stats.totalStudents} 
          icon={Users} 
          trend="+12%" 
          trendUp={true} 
          color="bg-blue-500" 
        />
        <KpiCard 
          title="Total Courses" 
          value={stats.totalCourses} 
          icon={BookOpen} 
          trend="Active" 
          trendUp={true} 
          color="bg-emerald-500" 
        />
        <KpiCard 
          title="Allocated Students" 
          value={stats.allocated} 
          icon={CheckCircle} 
          trend={`${Math.round((stats.allocated / (stats.totalStudents || 1)) * 100)}% Rate`} 
          trendUp={true} 
          color="bg-indigo-500" 
        />
        <KpiCard 
          title="Pending Allocation" 
          value={stats.pending} 
          icon={Clock} 
          trend="-5%" 
          trendUp={false} 
          color="bg-amber-500" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Allocation Success Rate</h2>
            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <TrendingUp className="w-4 h-4 text-slate-500" />
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={allocationRateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Demographics</h2>
            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <PieChart className="w-4 h-4 text-slate-500" />
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Seat allocation by reservation category.</p>
          
          <div className="flex-1 h-[200px] w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value} Students`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Inner text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.allocated}</span>
              <span className="text-xs font-medium text-slate-500">Allocated</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {categoryData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-slate-600 dark:text-slate-300 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent System Activity</h2>
          </div>
          <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">View All</button>
        </div>
        
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
          {logs.map((log: any, index: number) => (
            <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-950 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">{log.action.replace(/_/g, ' ')}</span>
                  <span className="text-xs font-medium text-slate-400">{formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{log.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, trend, trendUp, color }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20 text-${color.replace('bg-', '')}`}>
          <Icon className="w-6 h-6 text-current" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className={trendUp ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-amber-600 dark:text-amber-400 font-medium'}>
          {trend}
        </span>
        <span className="text-slate-400 ml-2">from last period</span>
      </div>
    </div>
  );
}
