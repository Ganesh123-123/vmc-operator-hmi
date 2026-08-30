import React, { useState } from 'react';
import {
  Shield,
  User,
  LogIn,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff,
  Lock,
  Radio
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string, password: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, loading, error }) => {
  const [username, setUsername] = useState<string>('operator');
  const [password, setPassword] = useState<string>('operator123');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    await onLogin(username.trim(), password.trim());
  };

  const handleQuickDemo = async () => {
    setUsername('operator');
    setPassword('operator123');
    await onLogin('operator', 'operator123');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#05070D] flex flex-col justify-between items-center p-4 sm:p-6 md:p-8 selection:bg-cyan-500 selection:text-black overflow-hidden font-sans">
      
      {/* 1. Industrial Background Glow & Sci-Fi Grid FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#0e2a47_0%,#05070d_70%)] pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(#00E5FF 1px, transparent 1px), linear-gradient(90deg, #00E5FF 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      {/* Ambient glowing orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* 2. Top Bar Status Strip */}
      <header className="relative z-10 w-full max-w-5xl flex items-center justify-between py-2 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-bold tracking-wider">SYSTEM ACTIVE</span>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">VMC-01 CNC CONTROLLER</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 rounded bg-slate-900/80 border border-slate-800 text-cyan-300">
            BAY 04 • SHIFT A
          </span>
          <span className="text-slate-500 hidden md:inline">SECURITY LEVEL 1</span>
        </div>
      </header>

      {/* 3. Main Centerpiece Card */}
      <div className="relative z-10 w-full max-w-xl my-auto py-4">
        
        {/* Primeform Labs Glowing Brand Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            PRIMEFORM LABS
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-200 tracking-tight">
            VMC OPERATOR HMI
          </h1>

          <p className="text-xs sm:text-sm font-mono text-cyan-400/90 mt-2 font-medium tracking-wider">
            STARTUP GUIDANCE & INTELLIGENT MACHINING COMMAND CENTER
          </p>
        </div>

        {/* Industrial Glassmorphism Panel */}
        <div className="relative bg-slate-900/85 border border-slate-700/80 rounded-3xl p-6 sm:p-9 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
          
          {/* Top Neon Laser Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          {/* Machine & Hardware Quick Specs Badge */}
          <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 font-mono text-xs mb-6 text-center">
            <div className="border-r border-slate-800/80 pr-2">
              <div className="text-[10px] text-slate-500">MACHINE</div>
              <div className="font-bold text-white mt-0.5">VMC-01</div>
            </div>
            <div className="border-r border-slate-800/80 px-2">
              <div className="text-[10px] text-slate-500">AXES</div>
              <div className="font-bold text-cyan-300 mt-0.5">3-AXIS VERTICAL</div>
            </div>
            <div className="pl-2">
              <div className="text-[10px] text-slate-500">PROGRAM</div>
              <div className="font-bold text-emerald-400 mt-0.5">PRF_POCKET_001</div>
            </div>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/90 border border-red-500/60 text-red-200 font-mono text-xs flex items-center gap-2.5 shadow-glow-red/20 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 font-mono">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  Operator Identifier
                </span>
                <span className="text-[10px] text-slate-500 font-normal">REQUIRED</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="operator"
                  className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  Security Passcode
                </span>
                <span className="text-[10px] text-slate-500 font-normal">AUTHENTICATED</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-3.5 pr-12 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Primary Login Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4.5 px-6 rounded-xl font-mono text-base font-extrabold uppercase tracking-wider bg-gradient-to-r from-cyan-500 via-cyan-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 shadow-[0_0_25px_rgba(0,229,255,0.4)] flex items-center justify-center gap-3 transition-all btn-tactile cursor-pointer disabled:opacity-50"
              >
                <LogIn className="w-5 h-5 stroke-[2.5]" />
                <span>{loading ? 'AUTHENTICATING STATION...' : 'INITIALIZE HMI SESSION'}</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Autofill Card */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleQuickDemo}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-700/80 text-cyan-300 font-mono text-xs font-semibold flex items-center justify-between transition-all btn-tactile cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>1-CLICK DEMO LOGIN</span>
              </div>
              <span className="text-[11px] text-slate-400 font-normal bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                operator / operator123
              </span>
            </button>
          </div>

        </div>

      </div>

      {/* 4. Bottom Footer Meta */}
      <footer className="relative z-10 w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-500 py-3 border-t border-slate-900">
        <div>PRIMEFORM LABS • SOFTWARE ENGINEER TECHNICAL ASSIGNMENT</div>
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>VMC-01 SECURE TERMINAL</span>
        </div>
      </footer>

    </div>
  );
};
