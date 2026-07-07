import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Settings, MessageSquare, LogOut, Network, FileText } from 'lucide-react';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItemClass = (path: string) => {
    const isActive = location.pathname.startsWith(path);
    return `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium ${
      isActive 
        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' 
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
    }`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans">
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xl tracking-tight">
            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
              <Network className="w-5 h-5" />
            </div>
            <span>AI Allocate</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5">
          <Link to="/dashboard" className={navItemClass('/dashboard')}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link to="/students" className={navItemClass('/students')}>
            <Users className="w-5 h-5" /> Students
          </Link>
          <Link to="/courses" className={navItemClass('/courses')}>
            <BookOpen className="w-5 h-5" /> Courses
          </Link>
          <Link to="/allocation" className={navItemClass('/allocation')}>
            <Network className="w-5 h-5" /> Allocation Engine
          </Link>
          <Link to="/assistant" className={navItemClass('/assistant')}>
            <MessageSquare className="w-5 h-5" /> AI Assistant
          </Link>
          <Link to="/reports" className={navItemClass('/reports')}>
            <FileText className="w-5 h-5" /> Reports
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all font-medium w-full text-left">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 -z-10" />
        
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 sticky top-0 z-10">
          <h1 className="text-xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">Course Allocation System</h1>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium">Admin User</span>
              <span className="text-xs text-slate-500">admin@university.edu</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-md ring-2 ring-white dark:ring-slate-800" />
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
