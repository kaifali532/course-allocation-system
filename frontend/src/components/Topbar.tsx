import { Bell, Command, Search, Menu } from 'lucide-react';

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="h-20 border-b border-white/5 bg-transparent flex items-center justify-between px-6 sm:px-8 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center text-sm font-medium text-slate-500">
          <span className="text-white">Course Allocation System</span>
          <span className="mx-3 text-slate-700">/</span>
          <span className="text-indigo-300">Workspace</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all shadow-sm"
        >
          <Search className="w-4 h-4" />
          <span>Global Search...</span>
          <div className="flex items-center gap-1 ml-6 px-2 py-0.5 rounded bg-black/40 border border-white/10 text-slate-400">
            <Command className="w-3 h-3" />
            <span className="text-xs font-semibold">K</span>
          </div>
        </button>

        <button className="p-2.5 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,1)]"></span>
        </button>

        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-500/20 ml-2 cursor-pointer ring-1 ring-white/20 hover:ring-white/40 transition-all">
          AD
        </div>
      </div>
    </header>
  );
}
