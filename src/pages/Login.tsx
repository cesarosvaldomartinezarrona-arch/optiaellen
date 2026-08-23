import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-[#6b3fa0] via-[#7c4db8] to-[#a78bfa] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-8 sm:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <svg width="140" height="110" viewBox="0 0 200 170" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 65 C45 20 75 5 100 5 C125 5 155 20 185 65" fill="none" stroke="#1a1a2e" strokeWidth="7" strokeLinecap="round" />
              <path d="M100 25 C30 25 5 85 5 85 C5 85 30 145 100 145 C170 145 195 85 195 85 C195 85 170 25 100 25Z" fill="#7c3aed" />
              <path d="M100 40 C45 40 25 85 25 85 C25 85 45 130 100 130 C155 130 175 85 175 85 C175 85 155 40 100 40Z" fill="white" />
              <circle cx="100" cy="85" r="38" fill="#7c3aed" />
              <circle cx="100" cy="85" r="34" fill="none" stroke="#6d28d9" strokeWidth="1.5" />
              <circle cx="100" cy="85" r="28" fill="none" stroke="#8b5cf6" strokeWidth="1" />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
                const rad = (angle * Math.PI) / 180;
                const x1 = 100 + Math.cos(rad) * 22;
                const y1 = 85 + Math.sin(rad) * 22;
                const x2 = 100 + Math.cos(rad) * 33;
                const y2 = 85 + Math.sin(rad) * 33;
                return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#5b21b6" strokeWidth="1" opacity="0.4" />;
              })}
              <circle cx="100" cy="85" r="16" fill="#0f0720" />
              <circle cx="107" cy="78" r="5" fill="white" opacity="0.9" />
              <circle cx="94" cy="92" r="2.5" fill="white" opacity="0.5" />
              <path d="M25 100 C50 135 75 148 100 148 C125 148 150 135 175 100" fill="none" stroke="#1a1a2e" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
            </svg>
          </div>

          {/* Brand */}
          <div className="text-center mb-1">
            <h1 className="text-[28px] font-extrabold text-gray-800 tracking-tight leading-none">
              optic<span className="text-[#7c3aed]">æ</span>llen
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="h-px w-8 bg-[#7c3aed]" />
            <p className="text-[11px] text-gray-400 tracking-widest">Ver bien es vivir mejor</p>
            <div className="h-px w-8 bg-[#7c3aed]" />
          </div>

          {/* Heading */}
          <h2 className="text-[22px] font-bold text-gray-800 text-center mb-6">
            Iniciar Sesión
          </h2>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-600 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 transition-all bg-white text-[15px]"
                  placeholder="tu@correo.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-600 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl pl-12 pr-12 py-3.5 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 transition-all bg-white text-[15px]"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:border-[#7c3aed] peer-checked:bg-[#7c3aed] transition-all flex items-center justify-center">
                    {remember && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-600">Recordarme</span>
              </label>
              <button type="button" className="text-sm text-[#7c3aed] hover:text-[#6b21a8] font-medium transition-colors">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#9333ea] hover:from-[#6b21a8] hover:via-[#7c3aed] hover:to-[#7c3aed] disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-purple-500/30 mt-3 text-[15px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="w-2 h-2 rounded-full bg-gray-300" />
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500">
            ¿No tienes cuenta?{' '}
            <button className="text-[#7c3aed] hover:text-[#6b21a8] font-semibold transition-colors">
              Regístrate aquí
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/50 mt-6">
          © 2026 opticællen. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
