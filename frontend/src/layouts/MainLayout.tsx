import { Outlet, Navigate, useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { CommandPalette } from '../components/CommandPalette';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Home, 
  Users, 
  BookOpen, 
  Layers,
  MessageSquare,
  Settings,
  LogOut
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function MainLayout() {
  const token = localStorage.getItem('token');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const pillNavItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/students', icon: Users, label: 'Students' },
    { path: '/courses', icon: BookOpen, label: 'Courses' },
    { path: '/allocations', icon: Layers, label: 'Allocations' },
    { path: '/assistant', icon: MessageSquare, label: 'AI Assistant' },
  ];

  return (
    <div className="w-screen h-screen overflow-hidden bg-[url('/bg-premium-game.png')] bg-cover bg-center flex items-center justify-center p-6 md:p-8 gap-6 text-foreground font-sans bg-[#0a0a0f]">
      
      {/* Floating Pill Sidebar - Hidden on mobile, visible on lg */}
      <div className="hidden lg:flex w-20 py-8 bg-[#1e201b]/70 backdrop-blur-3xl rounded-full border border-white/5 shadow-2xl flex-col items-center justify-between shrink-0 h-full transition-transform">
        <div className="flex flex-col gap-6 w-full items-center">
          
          <img src="/logo.svg" alt="University Logo" className="w-10 h-10 mb-4 drop-shadow-[0_0_10px_rgba(168,177,255,0.3)] hover:scale-105 transition-transform" />
          
          {pillNavItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="group relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300"
              >
                {isActive && (
                  <motion.div 
                    layoutId="pill-active"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={cn(
                  "w-5 h-5 relative z-10 transition-colors duration-300",
                  isActive ? "text-white" : "text-white/50 group-hover:text-white/80"
                )} />
                <div className="absolute left-16 px-3 py-1.5 bg-black/80 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col gap-6 w-full items-center">
          <Link
            to="/settings"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300"
          >
            {location.pathname === '/settings' && (
              <motion.div 
                layoutId="pill-active"
                className="absolute inset-0 bg-white/10 rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <Settings className={cn(
              "w-5 h-5 relative z-10 transition-colors duration-300",
              location.pathname === '/settings' ? "text-white" : "text-white/50 group-hover:text-white/80"
            )} />
            <div className="absolute left-16 px-3 py-1.5 bg-black/80 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Settings
            </div>
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            className="group relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:bg-red-500/10"
          >
            <LogOut className="w-5 h-5 relative z-10 text-white/50 group-hover:text-red-400 transition-colors duration-300" />
            <div className="absolute left-16 px-3 py-1.5 bg-black/80 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Logout
            </div>
          </button>
        </div>
      </div>

      {/* Main Glass Window */}
      <div className="flex-1 max-w-[1600px] h-full bg-[#1a1b16]/80 backdrop-blur-3xl rounded-[32px] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5),_inset_0_1px_0_rgba(255,255,255,0.1)] flex overflow-hidden relative z-40">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
          {/* Subtle gradient overlay to mimic lighting */}
          <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          
          <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar z-10">
            <div className="max-w-7xl mx-auto h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="h-full"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>

      <CommandPalette />
    </div>
  );
}
