import { Bell, Search, Menu, User, LogOut, Settings as SettingsIcon, Shield, Laptop } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: string[]) {
  return twMerge(clsx(inputs));
}

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Overview');
  
  const tabs = [
    { name: 'Overview', path: '/dashboard' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Reports', path: '/reports' },
    { name: 'System', path: '/settings' }
  ];

  useEffect(() => {
    const currentTab = tabs.find(t => location.pathname.startsWith(t.path));
    if (currentTab) setActiveTab(currentTab.name);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <header className="h-[72px] px-6 lg:px-10 flex items-center justify-between shrink-0 relative z-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-1.5 rounded-md text-white/50 hover:bg-white/10 hover:text-white lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Pill Tabs (matching reference topbar) */}
        <div className="hidden sm:flex items-center p-1 bg-black/40 rounded-full border border-white/5 backdrop-blur-md">
          {tabs.map(tab => (
            <button
              key={tab.name}
              onClick={() => {
                setActiveTab(tab.name);
                navigate(tab.path);
              }}
              className={cn(
                "px-5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-300",
                activeTab === tab.name 
                  ? "bg-white/10 text-white shadow-sm" 
                  : "text-white/50 hover:text-white/90 hover:bg-white/5"
              )}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div 
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-black/40 rounded-full border border-white/5 text-white/50 hover:border-white/20 hover:text-white transition-colors w-64 cursor-text shadow-inner"
        >
          <Search className="w-4 h-4" />
          <span className="text-[13px] w-full text-white/50">Search students, courses...</span>
          <span className="ml-auto text-[10px] bg-white/10 px-2 py-0.5 rounded-md text-white/40 font-mono">⌘K</span>
        </div>

        {/* Notifications Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="w-8 h-8 rounded-full bg-black/40 border border-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors relative outline-none">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="end" className="w-72 bg-[#1a1b16]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 z-50 mt-2">
              <div className="px-3 py-2 border-b border-white/10 mb-2">
                <h3 className="font-semibold text-white">Notifications</h3>
              </div>
              <DropdownMenu.Item className="flex flex-col gap-1 p-2 rounded-xl outline-none hover:bg-white/5 cursor-pointer transition-colors">
                <span className="text-sm font-medium text-white/90">Student Registered</span>
                <span className="text-xs text-white/50">Alice Smith completed registration.</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="flex flex-col gap-1 p-2 rounded-xl outline-none hover:bg-white/5 cursor-pointer transition-colors">
                <span className="text-sm font-medium text-white/90">Allocation Complete</span>
                <span className="text-xs text-white/50">Round 1 processing finished.</span>
              </DropdownMenu.Item>
              <div className="pt-2 mt-2 border-t border-white/10">
                <button className="w-full py-1.5 text-center text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors">Mark all as read</button>
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        
        {/* Profile Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-transparent hover:border-white/20 transition-all cursor-pointer shadow-sm overflow-hidden outline-none">
               <User className="w-4 h-4 text-white" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="end" className="w-56 bg-[#1a1b16]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 z-50 mt-2">
              <div className="px-3 py-2 border-b border-white/10 mb-2 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">Admin User</span>
                  <span className="text-xs text-white/50">System Admin</span>
                </div>
              </div>
              
              <DropdownMenu.Item onClick={() => navigate('/settings')} className="flex items-center gap-2 p-2 rounded-xl outline-none hover:bg-white/5 cursor-pointer transition-colors text-sm text-white/80 hover:text-white">
                <SettingsIcon className="w-4 h-4 text-white/50" />
                Settings
              </DropdownMenu.Item>
              <DropdownMenu.Item className="flex items-center gap-2 p-2 rounded-xl outline-none hover:bg-white/5 cursor-pointer transition-colors text-sm text-white/80 hover:text-white">
                <Shield className="w-4 h-4 text-white/50" />
                Security
              </DropdownMenu.Item>
              <DropdownMenu.Item className="flex items-center gap-2 p-2 rounded-xl outline-none hover:bg-white/5 cursor-pointer transition-colors text-sm text-white/80 hover:text-white mb-2">
                <Laptop className="w-4 h-4 text-white/50" />
                API Keys
              </DropdownMenu.Item>
              
              <DropdownMenu.Separator className="h-px bg-white/10 my-1" />
              
              <DropdownMenu.Item onClick={handleLogout} className="flex items-center gap-2 p-2 rounded-xl outline-none hover:bg-red-500/10 cursor-pointer transition-colors text-sm text-red-400 mt-1">
                <LogOut className="w-4 h-4" />
                Log out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
