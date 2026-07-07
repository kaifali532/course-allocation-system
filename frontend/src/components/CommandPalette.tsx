import { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, Users, BookOpen, Layers, X } from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle the menu when ⌘K is pressed
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4 backdrop-blur-sm bg-slate-900/40 fade-in" onClick={() => setOpen(false)}>
      <Command 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 py-3">
          <Search className="w-5 h-5 text-slate-500 mr-3 shrink-0" />
          <Command.Input 
            placeholder="Search for courses, students, or pages..." 
            className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
            autoFocus
          />
          <button 
            onClick={() => setOpen(false)}
            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-slate-500">No results found.</Command.Empty>
          
          <Command.Group heading="Pages" className="text-xs font-semibold text-slate-500 px-2 py-2">
            <Command.Item 
              onSelect={() => runCommand(() => navigate('/dashboard'))}
              className="flex items-center px-3 py-2.5 rounded-lg cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-500/10 aria-selected:text-indigo-600 dark:aria-selected:text-indigo-400 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 mr-3" /> Dashboard
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => navigate('/students'))}
              className="flex items-center px-3 py-2.5 rounded-lg cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-500/10 aria-selected:text-indigo-600 dark:aria-selected:text-indigo-400 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Users className="w-4 h-4 mr-3" /> Students
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => navigate('/courses'))}
              className="flex items-center px-3 py-2.5 rounded-lg cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-500/10 aria-selected:text-indigo-600 dark:aria-selected:text-indigo-400 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              <BookOpen className="w-4 h-4 mr-3" /> Courses
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => navigate('/allocations'))}
              className="flex items-center px-3 py-2.5 rounded-lg cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-500/10 aria-selected:text-indigo-600 dark:aria-selected:text-indigo-400 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Layers className="w-4 h-4 mr-3" /> Allocations
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
