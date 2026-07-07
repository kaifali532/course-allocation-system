import { useState, useEffect, useRef } from 'react';
import { User, Bell, Shield, Paintbrush, Building2, Bot, Sliders, Info, CreditCard, Save } from 'lucide-react';
import { api, getApiUrl } from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: string[]) {
  return twMerge(clsx(inputs));
}

const tabs = [
  { id: 'profile', name: 'Profile Settings', icon: User },
  { id: 'ai', name: 'AI Configuration', icon: Bot },
  { id: 'university', name: 'University', icon: Building2 },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    universityName: 'State University',
    aiProvider: 'gemini',
    allocationRules: 'MERIT_FIRST',
    theme: 'dark'
  });
  const [avatar, setAvatar] = useState('/logo.svg');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [settingsRes, userRes] = await Promise.all([
          api.get('/settings'),
          api.get('/auth/me') // Assuming we want user data
        ]);
        if (settingsRes.data.data) {
          setSettings(settingsRes.data.data);
        }
        if (userRes.data.data?.avatarUrl) {
          setAvatar(getApiUrl(userRes.data.data.avatarUrl));
        }
      } catch (error) {
        // Fallback gracefully
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings', settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await api.post('/upload/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setAvatar(getApiUrl(res.data.data.avatarUrl));
        toast.success('Avatar updated successfully');
      }
    } catch (error) {
      toast.error('Failed to upload avatar');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 rounded-full border-t-2 border-white animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto h-[calc(100vh-16rem)] min-h-[600px] flex solid-card overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-72 bg-black/20 border-r border-white/5 flex flex-col h-full overflow-y-auto custom-scrollbar backdrop-blur-md">
        <div className="p-6">
          <h2 className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-6 px-2">Settings</h2>
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all border",
                    isActive
                      ? "bg-white/10 text-white shadow-inner border-white/10"
                      : "text-white/50 hover:bg-white/5 hover:text-white border-transparent"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? 'text-white' : 'text-white/40')} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-transparent p-10">
        <div className="max-w-3xl">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-3xl font-bold text-white drop-shadow-sm">
              {tabs.find(t => t.id === activeTab)?.name}
            </h1>
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="px-6 py-2.5 solid-btn rounded-xl flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex items-center gap-8 pb-8 border-b border-white/10">
                <div 
                  className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner relative group cursor-pointer overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm">
                    <span className="text-xs font-bold text-white">Upload</span>
                  </div>
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-white/30" />
                  )}
                </div>
                <div>
                  <input type="file" className="hidden" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" />
                  <button onClick={() => fileInputRef.current?.click()} className="px-5 py-2.5 glass-btn rounded-xl text-sm font-bold">
                    Upload Avatar
                  </button>
                  <p className="text-[11px] font-bold text-white/40 mt-3 uppercase tracking-widest">JPG, GIF or PNG. 5MB max.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest">First Name</label>
                  <input type="text" defaultValue="Admin" className="w-full px-4 py-3 bg-black/40 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/30 backdrop-blur-md shadow-inner" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Last Name</label>
                  <input type="text" defaultValue="User" className="w-full px-4 py-3 bg-black/40 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/30 backdrop-blur-md shadow-inner" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Email Address</label>
                <input type="email" defaultValue="admin@university.edu" className="w-full px-4 py-3 bg-black/40 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/30 backdrop-blur-md shadow-inner" />
              </div>
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-start gap-4 shadow-inner backdrop-blur-md relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none" />
                <Bot className="w-6 h-6 text-indigo-400 mt-1 shrink-0 relative z-10" />
                <div className="relative z-10">
                  <h3 className="text-sm font-bold text-indigo-300 mb-1">AI Provider</h3>
                  <p className="text-[13px] text-indigo-200/60 leading-relaxed mb-4">Select the backend model for the AI Assistant.</p>
                  
                  <select 
                    value={settings.aiProvider}
                    onChange={(e) => setSettings({ ...settings, aiProvider: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50"
                  >
                    <option value="gemini">Google Gemini (Default)</option>
                    <option value="openai">OpenAI GPT-4</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'university' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest">University Name</label>
                <input 
                  type="text" 
                  value={settings.universityName} 
                  onChange={(e) => setSettings({ ...settings, universityName: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-white/30 backdrop-blur-md shadow-inner" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Allocation Strategy</label>
                <select 
                    value={settings.allocationRules}
                    onChange={(e) => setSettings({ ...settings, allocationRules: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-white/40"
                  >
                    <option value="MERIT_FIRST">Merit First (Marks based)</option>
                    <option value="FCFS">First Come First Serve</option>
                    <option value="HYBRID">Hybrid (Category + Merit)</option>
                </select>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
