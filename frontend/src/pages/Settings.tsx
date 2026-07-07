import { useState } from 'react';
import { Save, User, Building2, Bell, Shield, Palette, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    // Mock save delay
    setTimeout(() => {
      setSaving(false);
      toast.success('Settings saved successfully');
    }, 800);
  };

  return (
    <div className="space-y-6 fade-in max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-slate-400 mt-1 text-sm">Manage your account, workspace, and system preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 space-y-1">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-[#22222a] text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a1a24]'}`}
          >
            <User className="w-4 h-4" /> Profile
          </button>
          <button 
            onClick={() => setActiveTab('workspace')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'workspace' ? 'bg-[#22222a] text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a1a24]'}`}
          >
            <Building2 className="w-4 h-4" /> Workspace
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'ai' ? 'bg-[#22222a] text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a1a24]'}`}
          >
            <Sparkles className="w-4 h-4" /> AI Assistant
          </button>
          <button 
            onClick={() => setActiveTab('appearance')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'appearance' ? 'bg-[#22222a] text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a1a24]'}`}
          >
            <Palette className="w-4 h-4" /> Appearance
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-[#22222a] text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a1a24]'}`}
          >
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-[#22222a] text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a1a24]'}`}
          >
            <Shield className="w-4 h-4" /> Security
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#111118] border border-[#22222a] rounded-xl p-6 md:p-8">
          
          {activeTab === 'profile' && (
            <div className="space-y-6 fade-in">
              <div>
                <h2 className="text-lg font-semibold text-white">Profile Settings</h2>
                <p className="text-sm text-slate-400 mt-1">Update your personal information and email address.</p>
              </div>
              <div className="border-t border-[#22222a] pt-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">First Name</label>
                    <input type="text" defaultValue="Admin" className="w-full bg-[#1a1a24] border border-[#2a2a35] rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Last Name</label>
                    <input type="text" defaultValue="User" className="w-full bg-[#1a1a24] border border-[#2a2a35] rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-slate-300">Email Address</label>
                    <input type="email" defaultValue="admin@university.edu" className="w-full bg-[#1a1a24] border border-[#2a2a35] rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workspace' && (
            <div className="space-y-6 fade-in">
              <div>
                <h2 className="text-lg font-semibold text-white">Workspace Configuration</h2>
                <p className="text-sm text-slate-400 mt-1">Manage university details and academic year settings.</p>
              </div>
              <div className="border-t border-[#22222a] pt-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">University Name</label>
                  <input type="text" defaultValue="University System" className="w-full bg-[#1a1a24] border border-[#2a2a35] rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Academic Year</label>
                  <select className="w-full bg-[#1a1a24] border border-[#2a2a35] rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors">
                    <option>2026-2027</option>
                    <option>2025-2026</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6 fade-in">
              <div>
                <h2 className="text-lg font-semibold text-white">AI Assistant Configuration</h2>
                <p className="text-sm text-slate-400 mt-1">Configure the generative AI models used for allocation insights.</p>
              </div>
              <div className="border-t border-[#22222a] pt-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">AI Provider</label>
                  <select className="w-full bg-[#1a1a24] border border-[#2a2a35] rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors">
                    <option>Google Gemini (Current)</option>
                    <option>OpenAI GPT-4 (Coming Soon)</option>
                    <option>Anthropic Claude (Coming Soon)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300 flex items-center justify-between">
                    API Key
                    <span className="text-xs text-indigo-400 font-normal">Manage in Vercel Environment Variables</span>
                  </label>
                  <input type="password" value="************************" readOnly className="w-full bg-[#1a1a24] opacity-70 cursor-not-allowed border border-[#2a2a35] rounded-md px-3 py-2 text-sm text-slate-400 outline-none" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6 fade-in">
              <div>
                <h2 className="text-lg font-semibold text-white">Appearance</h2>
                <p className="text-sm text-slate-400 mt-1">Customize the interface theme and density.</p>
              </div>
              <div className="border-t border-[#22222a] pt-6 space-y-5">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-300">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="border-2 border-indigo-500 rounded-lg p-3 bg-[#111118] cursor-pointer flex flex-col items-center gap-2">
                      <div className="w-full h-12 bg-[#0a0a0f] rounded border border-[#22222a]"></div>
                      <span className="text-xs font-medium text-white">Dark Mode</span>
                    </div>
                    <div className="border border-[#2a2a35] rounded-lg p-3 bg-[#111118] cursor-not-allowed opacity-50 flex flex-col items-center gap-2">
                      <div className="w-full h-12 bg-white rounded border border-gray-200"></div>
                      <span className="text-xs font-medium text-white">Light (Beta)</span>
                    </div>
                    <div className="border border-[#2a2a35] rounded-lg p-3 bg-[#111118] cursor-not-allowed opacity-50 flex flex-col items-center gap-2">
                      <div className="w-full h-12 bg-gradient-to-r from-[#0a0a0f] to-white rounded border border-[#22222a]"></div>
                      <span className="text-xs font-medium text-white">System</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'notifications' || activeTab === 'security') && (
            <div className="space-y-6 fade-in flex items-center justify-center py-12 flex-col">
              <Shield className="w-12 h-12 text-slate-600 mb-2" />
              <h2 className="text-lg font-semibold text-white">Coming Soon</h2>
              <p className="text-sm text-slate-400 mt-1 text-center max-w-sm">
                These settings are currently managed by your organization's single sign-on provider.
              </p>
            </div>
          )}

          {/* Action Footer */}
          {activeTab !== 'notifications' && activeTab !== 'security' && (
            <div className="mt-8 pt-6 border-t border-[#22222a] flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
