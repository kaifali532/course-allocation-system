import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  History,
  Star,
  Building,
  GraduationCap,
  Clock,
  MoreHorizontal,
  Search,
  ChevronsUpDown
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { api } from '../services/api';

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
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    api.get('/courses/departments')
      .then(res => setDepartments(res.data.data || []))
      .catch(console.error);
  }, []);

  const openSearch = () => {
    // Custom event to trigger CommandPalette
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
    onClose();
  };

  const recentItems = [
    { name: 'Computer Science', subtext: 'Department', icon: Building, color: 'text-emerald-400', bg: 'bg-emerald-400/10', path: '/courses?dept=Computer Science' },
    { name: 'Alice Smith', subtext: 'Student', icon: GraduationCap, color: 'text-indigo-400', bg: 'bg-indigo-400/10', path: '/students' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Inner Sidebar - Glassmorphic */}
      <aside className={cn(
        "fixed lg:relative top-0 left-0 z-40 h-full w-64 bg-black/20 border-r border-white/5 transition-transform duration-300 ease-in-out flex flex-col shrink-0 lg:translate-x-0 backdrop-blur-xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header / Home text */}
        <div className="pt-8 px-6 pb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-wide">Overview</h2>
          <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Global Search inside sidebar (matching reference) */}
        <div className="px-5 mb-6">
          <div 
            onClick={openSearch}
            className="flex items-center gap-2.5 px-3 py-2 bg-black/40 rounded-xl text-white/50 border border-white/5 hover:border-white/10 transition-colors cursor-text group"
          >
            <Search className="w-4 h-4 group-hover:text-white transition-colors" />
            <span className="text-[13px] font-medium group-hover:text-white transition-colors">Search...</span>
            <span className="ml-auto text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/40 font-mono hidden lg:block">⌘K</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 custom-scrollbar">
          
          {/* Recent Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-[13px] font-semibold text-white/90">Recent (3)</h3>
              <History className="w-3.5 h-3.5 text-white/50" />
            </div>
            <div className="space-y-1">
              {recentItems.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => { navigate(item.path); onClose(); }}
                  className="group flex items-center gap-3.5 px-2.5 py-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", item.bg)}>
                    <item.icon className={cn("w-5 h-5", item.color)} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-semibold text-white/90 truncate">{item.name}</span>
                    <span className="text-[12px] text-white/50 truncate flex items-center gap-1">
                      {item.subtext}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Filters / Departments */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3 px-1 cursor-pointer group">
              <h3 className="text-[13px] font-semibold text-white/90">Departments ({departments.length})</h3>
              <ChevronsUpDown className="w-3.5 h-3.5 text-white/50 group-hover:text-white/80 transition-colors" />
            </div>
            <div className="space-y-1">
              {departments.slice(0, 5).map(dept => (
                <div 
                  key={dept} 
                  onClick={() => { navigate(`/courses?dept=${encodeURIComponent(dept)}`); onClose(); }}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                  <span className="text-[13px] text-white/70 hover:text-white truncate">{dept}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3 px-1 cursor-pointer group">
              <h3 className="text-[13px] font-semibold text-white/90">Saved Filters (4)</h3>
              <ChevronsUpDown className="w-3.5 h-3.5 text-white/50 group-hover:text-white/80 transition-colors" />
            </div>
          </div>

        </div>
      </aside>
    </>
  );
}
