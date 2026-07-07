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
    <div className="w-screen h-screen overflow-hidden bg-[url('/bg-premium-game.png')] bg-cover bg-center flex items-center justify-center p-6 md:p-8 gap-6 text-foreground font-sans bg-[#0a0a0f]">
      
      {/* Main Glass Window mimicking MainLayout */}
      <div className="w-full h-full max-w-[1600px] bg-[#1a1b16]/80 backdrop-blur-3xl rounded-[32px] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5),_inset_0_1px_0_rgba(255,255,255,0.1)] flex overflow-hidden relative z-40">
        
        {/* Subtle gradient overlay to mimic lighting */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-0" />

      {/* Left Side: Premium Illustration / Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-white/20">
            <Network className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white drop-shadow-md">University System</span>
        </div>

        <div className="space-y-8 max-w-lg fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/80 text-sm font-bold shadow-inner">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="tracking-wide uppercase text-[11px]">AI-Powered Engine</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight leading-[1.15] text-white drop-shadow-lg">
            Enterprise course allocation, redefined.
          </h1>
          <p className="text-lg text-white/60 leading-relaxed font-medium">
            Experience the world's most advanced course management system. Designed for precision, speed, and absolute clarity.
          </p>
        </div>

        <div className="flex items-center gap-6 text-[13px] text-white/40 font-bold uppercase tracking-widest">
          <span>© 2026 Systems Inc.</span>
          <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative z-10">
        <div className="w-full max-w-md space-y-10 fade-in bg-black/40 backdrop-blur-xl p-10 rounded-[24px] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          
          <div className="lg:hidden flex items-center gap-3 mb-10 relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner border border-white/20">
              <Network className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white drop-shadow-md">University System</span>
          </div>

          <div className="space-y-3 relative z-10">
            <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">{isRegistering ? 'Create Account' : 'Sign In'}</h2>
            <p className="text-[15px] text-white/50">{isRegistering ? 'Enter your details to get started.' : 'Enter your credentials to access the workspace.'}</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-100 p-4 rounded-2xl text-sm font-medium flex items-start gap-3 backdrop-blur-md relative z-10 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0 shadow-[0_0_10px_rgba(248,113,113,0.8)]" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-100 p-4 rounded-2xl text-sm font-medium flex items-start gap-3 backdrop-blur-md relative z-10 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {isRegistering && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-white transition-colors">
                  <UserIcon className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:bg-black/60 transition-all shadow-inner backdrop-blur-md"
                  required
                />
              </div>
            )}
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:bg-black/60 transition-all shadow-inner backdrop-blur-md"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-white transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:bg-black/60 transition-all shadow-inner backdrop-blur-md"
                required
              />
            </div>

            {!isRegistering && (
              <div className="flex items-center justify-between text-sm pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded-md border border-white/20 bg-black/40 flex items-center justify-center group-hover:border-white/40 transition-colors shadow-inner backdrop-blur-sm">
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  </div>
                  <span className="text-white/60 font-semibold group-hover:text-white transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-white/60 hover:text-white font-bold transition-colors">Forgot password?</a>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white hover:bg-white/90 text-black font-bold py-4 rounded-2xl transition-all disabled:opacity-50 disabled:hover:translate-y-0 mt-8 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {loading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <Fingerprint className="w-5 h-5" />}
              {isRegistering ? 'Create Secure Account' : 'Sign In'}
            </button>
          </form>

          <div className="text-center pt-8 border-t border-white/10 relative z-10">
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setSuccess('');
              }} 
              className="text-sm font-bold text-white/50 hover:text-white transition-colors"
            >
              {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
