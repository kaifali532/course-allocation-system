import { Bell, Command, Search, Menu } from 'lucide-react';

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="h-16 border-b border-[#22222a] bg-[#0a0a0f] flex items-center justify-between px-6 sm:px-8 shrink-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-1.5 rounded-md text-slate-400 hover:bg-[#1a1a24] hover:text-slate-200 lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center text-sm font-medium text-slate-400">
          <span className="text-slate-200">System</span>
          <span className="mx-2 text-slate-600">/</span>
          <span className="text-indigo-400">Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          className="hidden sm:flex items-center justify-between w-64 px-3 py-1.5 rounded-md border border-[#22222a] bg-[#111118] text-sm text-slate-500 hover:border-[#33333f] hover:text-slate-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span>Search...</span>
          </div>
          <div className="flex items-center gap-1">
            <Command className="w-3 h-3" />
            <span className="text-[10px] font-bold">K</span>
          </div>
        </button>

        <button className="p-2 rounded-md text-slate-400 hover:bg-[#1a1a24] hover:text-slate-200 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-indigo-500 border-2 border-[#0a0a0f]"></span>
        </button>
      </div>
    </header>
  );
}
