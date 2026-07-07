import { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, Users, BookOpen, Layers, X } from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4 backdrop-blur-md bg-[#0a0a0f]/60 fade-in" onClick={() => setOpen(false)}>
      <Command 
        className="w-full max-w-2xl bg-[#0a0a0f]/90 backdrop-blur-2xl rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 ring-1 ring-white/5 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-white/10 px-5 py-4">
          <Search className="w-5 h-5 text-indigo-400 mr-4 shrink-0" />
          <Command.Input 
            placeholder="Search for modules, records, or actions..." 
            className="flex-1 bg-transparent outline-none text-white placeholder:text-slate-500 text-lg font-medium"
            autoFocus
          />
          <button 
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <Command.List className="max-h-[50vh] overflow-y-auto p-3 custom-scrollbar">
          <Command.Empty className="py-8 text-center text-sm text-slate-500">No matching records found.</Command.Empty>
          
          <Command.Group heading="Primary Modules" className="text-xs font-bold text-slate-600 uppercase tracking-widest px-3 py-3">
            <Command.Item 
              onSelect={() => runCommand(() => navigate('/dashboard'))}
              className="flex items-center px-4 py-3.5 rounded-xl cursor-pointer hover:bg-white/5 aria-selected:bg-indigo-500/10 aria-selected:text-indigo-300 text-sm font-medium text-slate-300 transition-colors mt-2"
            >
              <LayoutDashboard className="w-4 h-4 mr-4 text-slate-400" /> Executive Dashboard
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => navigate('/students'))}
              className="flex items-center px-4 py-3.5 rounded-xl cursor-pointer hover:bg-white/5 aria-selected:bg-indigo-500/10 aria-selected:text-indigo-300 text-sm font-medium text-slate-300 transition-colors mt-1"
            >
              <Users className="w-4 h-4 mr-4 text-slate-400" /> Student Records
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => navigate('/courses'))}
              className="flex items-center px-4 py-3.5 rounded-xl cursor-pointer hover:bg-white/5 aria-selected:bg-indigo-500/10 aria-selected:text-indigo-300 text-sm font-medium text-slate-300 transition-colors mt-1"
            >
              <BookOpen className="w-4 h-4 mr-4 text-slate-400" /> Course Capacity Matrix
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => navigate('/allocations'))}
              className="flex items-center px-4 py-3.5 rounded-xl cursor-pointer hover:bg-white/5 aria-selected:bg-indigo-500/10 aria-selected:text-indigo-300 text-sm font-medium text-slate-300 transition-colors mt-1"
            >
              <Layers className="w-4 h-4 mr-4 text-slate-400" /> Allocation Results
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
