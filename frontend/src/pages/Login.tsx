import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Network, Fingerprint, Sparkles, Mail, Lock, User as UserIcon } from 'lucide-react';

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@university.edu');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isRegistering) {
        await api.post('/auth/register', { name, email, password });
        setSuccess('Account created! You can now sign in.');
        setIsRegistering(false);
      } else {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-[#0a0a0f] text-white relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="orb-1"></div>
      <div className="orb-2"></div>

      {/* Left Side: Premium Illustration / Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative z-10 border-r border-white/5 bg-gradient-to-br from-indigo-900/20 to-purple-900/10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-1 ring-white/20">
            <Network className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Allocate<span className="text-indigo-400">Pro</span></span>
        </div>

        <div className="space-y-6 max-w-lg fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Allocation Engine</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400">
            Reimagining the future of education management.
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Experience the world's most advanced course allocation system. Designed for precision, speed, and absolute clarity.
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
          <span>© 2026 University Systems</span>
          <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
          <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
          <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
          <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
        </div>

        {/* Abstract Biotech floating shapes (SVG representation) */}
        <div className="absolute top-1/2 right-12 -translate-y-1/2 w-64 h-64 pointer-events-none opacity-40">
           <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#8B5CF6" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.4,-46.3C91,-33.5,97.2,-18.1,95.3,-3.3C93.4,11.5,83.4,25.7,73.5,39.3C63.6,52.9,53.8,65.9,41,74.5C28.2,83.1,12.4,87.3,-2.3,90.5C-17,93.7,-30.6,95.9,-43.3,90.1C-56,84.3,-67.8,70.5,-76.5,55.1C-85.2,39.7,-90.8,22.7,-91.3,5.6C-91.8,-11.5,-87.2,-28.7,-78,-43.2C-68.8,-57.7,-55,-69.5,-40.5,-76.4C-26,-83.3,-10.8,-85.3,4.2,-91.3C19.2,-97.3,28.4,-107.4,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative z-10">
        <div className="w-full max-w-md space-y-8 fade-in">
          
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-1 ring-white/20">
              <Network className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Allocate<span className="text-indigo-400">Pro</span></span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">{isRegistering ? 'Create an account' : 'Welcome back'}</h2>
            <p className="text-slate-400">{isRegistering ? 'Enter your details to get started.' : 'Enter your credentials to access the workspace.'}</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium flex items-start gap-3 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm font-medium flex items-start gap-3 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegistering && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <UserIcon className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all backdrop-blur-md"
                  required
                />
              </div>
            )}
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all backdrop-blur-md"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all backdrop-blur-md"
                required
              />
            </div>

            {!isRegistering && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded border border-white/20 bg-white/5 flex items-center justify-center group-hover:border-indigo-400 transition-colors">
                    <div className="w-2 h-2 rounded-sm bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Forgot password?</a>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full relative group overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              <span className="flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Fingerprint className="w-5 h-5" />}
                {isRegistering ? 'Create Secure Account' : 'Authenticate via Secure Portal'}
              </span>
            </button>
          </form>

          <div className="text-center">
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setSuccess('');
              }} 
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
