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
  User as UserIcon
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
          className="fixed inset-0 bg-black/80 z-40 lg:hidden fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Solid dark surface with clear borders */}
      <aside className={cn(
        "fixed lg:relative top-0 left-0 z-40 h-full w-64 bg-[#111118] border-r border-[#22222a] transition-transform duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Workspace Switcher */}
        <div className="h-16 flex items-center px-4 border-b border-[#22222a]">
          <div className="flex items-center justify-between w-full px-2 py-1.5 hover:bg-[#1a1a24] rounded-lg cursor-pointer transition-colors border border-transparent hover:border-[#2a2a35]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-inner">
                <Network className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-slate-200 leading-none">University System</span>
                <span className="text-[11px] text-slate-500 font-medium mt-1">Admin Workspace</span>
              </div>
            </div>
            <ChevronsUpDown className="w-4 h-4 text-slate-500" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-slate-500 mb-2">Menu</p>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150",
                    isActive 
                      ? "bg-indigo-500/10 text-indigo-400" 
                      : "text-slate-400 hover:bg-[#1a1a24] hover:text-slate-200"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-indigo-400" : "text-slate-500")} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Profile Card */}
        <div className="p-4 border-t border-[#22222a]">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-[#2a2a35] flex items-center justify-center shrink-0">
              <UserIcon className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-slate-200 truncate">Administrator</span>
              <span className="text-xs text-slate-500 truncate">admin@university.edu</span>
            </div>
          </div>
          <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-slate-400 hover:bg-[#1a1a24] hover:text-slate-200 transition-colors">
            <Settings className="w-4 h-4 text-slate-500" />
            Settings
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors mt-1"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
