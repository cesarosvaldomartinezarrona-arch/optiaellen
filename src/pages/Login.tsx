import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const success = login(username, password);
      if (!success) {
        setError('Usuario o contraseña incorrectos');
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6b3fa0] via-[#7c4db8] to-[#a78bfa] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[440px]">
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-8 sm:p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-2">
            <div className="w-20 h-20 rounded-2xl bg-[#1a1a2e] flex items-center justify-center mb-4 shadow-xl">
              <svg width="40" height="40" viewBox="0 0 200 170" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 65 C45 20 75 5 100 5 C125 5 155 20 185 65" fill="none" stroke="#1a1a2e" strokeWidth="7" strokeLinecap="round" />
                <path d="M100 25 C30 25 5 85 5 85 C5 85 30 145 100 145 C170 145 195 85 195 85 C195 85 170 25 100 25Z" fill="#7c3aed" />
                <path d="M100 40 C45 40 25 85 25 85 C25 85 45 130 100 130 C155 130 175 85 175 85 C175 85 155 40 100 40Z" fill="white" />
                <circle cx="100" cy="85" r="38" fill="#7c3aed" />
                <circle cx="100" cy="85" r="16" fill="#0f0720" />
                <circle cx="107" cy="78" r="5" fill="white" opacity="0.9" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-400 tracking-[0.2em] uppercase">opticællen</span>
          </div>

          {/* Title */}
          <h1 className="text-[26px] font-extrabold text-slate-900 text-center mb-2">Iniciar Sesión</h1>
          <p className="text-sm text-slate-400 text-center mb-10">Ingresa tus credenciales para acceder</p>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Section: Credenciales */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-6 h-6 rounded-lg bg-[#7c3aed]/10 flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5 text-[#7c3aed]" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Credenciales</span>
              </div>

              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300" />
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-[#f5f5f5] rounded-2xl border border-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] focus:bg-white transition-all"
                      placeholder="tu@correo.com"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3.5 bg-[#f5f5f5] rounded-2xl border border-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] focus:bg-white transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 mb-6" />

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between mb-8">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 border-2 border-slate-300 rounded-lg peer-checked:border-[#7c3aed] peer-checked:bg-[#7c3aed] transition-all flex items-center justify-center">
                    {remember && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-600">Recordarme</span>
              </label>
              <button type="button" className="text-sm text-[#7c3aed] hover:text-[#6b21a8] font-semibold transition-colors">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7c3aed] hover:bg-[#6b21a8] disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-purple-500/25 text-[15px] flex items-center justify-center gap-2.5"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Iniciar Sesión <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-8">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[11px] text-slate-300 font-medium">o</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Register link */}
          <Link to="/register" className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
            Crear una cuenta nueva
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/50 mt-6">
          © 2026 opticællen. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
