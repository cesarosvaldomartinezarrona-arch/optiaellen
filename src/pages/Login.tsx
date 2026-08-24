import { useState } from 'react';
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
        <div className="bg-white rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-8 sm:p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4">
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="OptiÆllen" className="w-40 h-auto drop-shadow-lg" />
            </div>
            <span className="text-xs font-bold text-slate-400 tracking-[0.2em] uppercase">opticællen</span>
          </div>

          {/* Title */}
          <h1 className="text-[26px] font-extrabold text-slate-900 text-center mb-2">Iniciar Sesión</h1>
          <p className="text-sm text-slate-400 text-center mb-8">Ingresa tus credenciales para acceder</p>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-600 text-sm text-center">
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
                      className="w-full pl-12 pr-4 py-3.5 bg-[#f5f5f5] rounded-lg border border-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] focus:bg-white transition-all"
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
                      className="w-full pl-12 pr-12 py-3.5 bg-[#f5f5f5] rounded-lg border border-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] focus:bg-white transition-all"
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
              className="w-full bg-[#7c3aed] hover:bg-[#6b21a8] disabled:opacity-50 text-white font-bold py-4 rounded-lg transition-all shadow-lg shadow-purple-500/25 text-[15px] flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Iniciar Sesión <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/50 mt-6">
          © 2026 opticællen. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
