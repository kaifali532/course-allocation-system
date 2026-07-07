import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Layers, 
  LogOut, 
  Settings,
  MessageSquare,
  Network,
  ChevronsUpDown,
  User as UserIcon,
  Search
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/students', icon: Users },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Allocations', path: '/allocations', icon: Layers },
    { name: 'AI Assistant', path: '/assistant', icon: MessageSquare },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Solid Linear-style Charcoal surface */}
      <aside className={cn(
        "fixed lg:relative top-0 left-0 z-40 h-full w-64 bg-[#fbfbfa] dark:bg-[#1c1c1f] border-r border-slate-200 dark:border-[#2b2b30] transition-transform duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Workspace Switcher */}
        <div className="h-14 flex items-center px-3 border-b border-slate-200 dark:border-[#2b2b30]">
          <div className="flex items-center justify-between w-full px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-[#2b2b30] rounded-md cursor-pointer transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center shadow-sm">
                <Network className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-[13px] text-slate-900 dark:text-slate-200">
                University System
              </span>
            </div>
            <ChevronsUpDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Quick Search */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 dark:bg-[#2b2b30] rounded-md text-slate-500 dark:text-slate-400 border border-transparent dark:border-[#38383f]">
            <Search className="w-3.5 h-3.5" />
            <span className="text-[12px] font-medium">Search...</span>
            <div className="ml-auto flex items-center gap-0.5">
              <kbd className="font-sans text-[10px] bg-slate-200 dark:bg-[#38383f] px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-300">⌘</kbd>
              <kbd className="font-sans text-[10px] bg-slate-200 dark:bg-[#38383f] px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-300">K</kbd>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar">
          <div className="space-y-0.5">
            <p className="px-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-500 mb-2 uppercase tracking-wider">Workspace</p>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={cn(
                    "group flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-all duration-150",
                    isActive 
                      ? "bg-indigo-50 text-indigo-700 dark:bg-[#2b2b30] dark:text-white" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2b2b30] hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                >
                  <Icon className={cn(
                    "w-4 h-4 transition-colors", 
                    isActive 
                      ? "text-indigo-600 dark:text-slate-200" 
                      : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400"
                  )} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Profile Card */}
        <div className="p-3 border-t border-slate-200 dark:border-[#2b2b30] mt-auto">
          <Link 
            to="/settings"
            onClick={() => window.innerWidth < 1024 && onClose()}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2b2b30] hover:text-slate-900 dark:hover:text-slate-200 transition-colors mb-1"
          >
            <Settings className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            Settings
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-2.5 py-1.5 w-full rounded-md text-[13px] font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            Sign Out
          </button>
          
          <div className="flex items-center gap-3 px-2 py-2 mt-2 pt-3 border-t border-slate-200 dark:border-[#2b2b30]">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
              <UserIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-medium text-slate-900 dark:text-slate-200 truncate leading-tight">Administrator</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-500 truncate leading-tight">admin@university.edu</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
