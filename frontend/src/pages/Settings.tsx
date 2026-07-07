import { useState } from 'react';
import { User, Bell, Shield, Paintbrush, Building2, Bot, Sliders, Info, CreditCard } from 'lucide-react';

const tabs = [
  { id: 'profile', name: 'Profile Settings', icon: User },
  { id: 'account', name: 'Account Settings', icon: CreditCard },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'theme', name: 'Theme', icon: Paintbrush },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'university', name: 'University Preferences', icon: Building2 },
  { id: 'ai', name: 'AI Configuration', icon: Bot },
  { id: 'allocation', name: 'Allocation Rules', icon: Sliders },
  { id: 'system', name: 'System Information', icon: Info },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex bg-white dark:bg-[#111118] border border-slate-200 dark:border-[#2b2b30] rounded-xl overflow-hidden shadow-sm fade-in">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-slate-50 dark:bg-[#16161d] border-r border-slate-200 dark:border-[#2b2b30] flex flex-col h-full overflow-y-auto custom-scrollbar">
        <div className="p-4">
          <h2 className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Settings</h2>
          <div className="space-y-0.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#22222a] hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#111118] p-8">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            {tabs.find(t => t.id === activeTab)?.name}
          </h1>
          
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-6 pb-6 border-b border-slate-200 dark:border-[#2b2b30]">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-[#22222a] border border-slate-200 dark:border-[#38383f] flex items-center justify-center">
                  <User className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <button className="px-4 py-2 bg-white dark:bg-[#22222a] border border-slate-200 dark:border-[#38383f] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2a2a35] rounded-md text-[13px] font-medium transition-colors shadow-sm">
                    Upload Avatar
                  </button>
                  <p className="text-[12px] text-slate-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">First Name</label>
                  <input type="text" defaultValue="Admin" className="w-full px-3 py-2 bg-white dark:bg-[#111118] border border-slate-300 dark:border-[#38383f] rounded-md text-[13px] text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                  <input type="text" defaultValue="User" className="w-full px-3 py-2 bg-white dark:bg-[#111118] border border-slate-300 dark:border-[#38383f] rounded-md text-[13px] text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <input type="email" defaultValue="admin@university.edu" className="w-full px-3 py-2 bg-white dark:bg-[#111118] border border-slate-300 dark:border-[#38383f] rounded-md text-[13px] text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500" />
              </div>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[13px] font-medium transition-colors shadow-sm mt-4">
                Save Changes
              </button>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-lg flex items-start gap-3">
                <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-[13px] font-semibold text-indigo-900 dark:text-indigo-300">Gemini Pro Integration Active</h3>
                  <p className="text-[12px] text-indigo-700/80 dark:text-indigo-400/80 mt-1">The system is currently using `gemini-1.5-flash-latest` for natural language querying and data analysis.</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Google AI API Key</label>
                <input type="password" defaultValue="*************************" className="w-full px-3 py-2 bg-white dark:bg-[#111118] border border-slate-300 dark:border-[#38383f] rounded-md text-[13px] text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500" />
                <p className="text-[11px] text-slate-500">Stored securely in environment variables.</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Default Model</label>
                <select className="w-full px-3 py-2 bg-white dark:bg-[#111118] border border-slate-300 dark:border-[#38383f] rounded-md text-[13px] text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500">
                  <option>Gemini 1.5 Flash (Recommended)</option>
                  <option>Gemini 1.5 Pro</option>
                  <option>Gemini 1.0 Pro</option>
                </select>
              </div>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[13px] font-medium transition-colors shadow-sm">
                Update AI Configuration
              </button>
            </div>
          )}

          {activeTab !== 'profile' && activeTab !== 'ai' && (
            <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-2 duration-300 border border-dashed border-slate-200 dark:border-[#38383f] rounded-xl">
              <div className="w-12 h-12 bg-slate-100 dark:bg-[#22222a] rounded-full flex items-center justify-center mb-3">
                <Sliders className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Module under construction</h3>
              <p className="text-[13px] text-slate-500 max-w-sm mt-1">
                The {tabs.find(t => t.id === activeTab)?.name} panel is currently being developed for the next release.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
