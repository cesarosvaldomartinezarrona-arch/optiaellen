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
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4">
      {/* Fondo profundo con textura orgánica */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#0f0720]" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(167,139,250,0.25) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(139,92,246,0.2) 0%, transparent 50%)' }} />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

      {/* Contenedor glassmorphism */}
      <div className="relative z-10 w-full max-w-[420px]">
        <div className="backdrop-blur-xl bg-white/[0.07] rounded-2xl border border-white/[0.12] shadow-[0_8px_60px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] p-10 sm:p-12">
          {/* Logo con resplandor */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 blur-2xl bg-[#7c3aed]/30 rounded-full scale-150" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] flex items-center justify-center shadow-[0_0_40px_rgba(124,58,237,0.4)]">
                <svg width="44" height="44" viewBox="0 0 200 170" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 65 C45 20 75 5 100 5 C125 5 155 20 185 65" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="6" strokeLinecap="round" />
                  <path d="M100 25 C30 25 5 85 5 85 C5 85 30 145 100 145 C170 145 195 85 195 85 C195 85 170 25 100 25Z" fill="rgba(255,255,255,0.15)" />
                  <path d="M100 40 C45 40 25 85 25 85 C25 85 45 130 100 130 C155 130 175 85 175 85 C175 85 155 40 100 40Z" fill="white" />
                  <circle cx="100" cy="85" r="38" fill="white" />
                  <circle cx="100" cy="85" r="20" fill="#1a0a2e" />
                  <circle cx="108" cy="77" r="6" fill="white" opacity="0.9" />
                </svg>
              </div>
            </div>
            <span className="text-[11px] font-bold text-white/40 tracking-[0.3em] uppercase mb-4">opticællen</span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Iniciar Sesión</h1>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-6 text-red-300 text-sm text-center backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Correo */}
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Correo Electrónico</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#a78bfa] transition-colors" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/[0.05] rounded-xl border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/40 focus:border-[#7c3aed]/30 focus:bg-white/[0.08] transition-all"
                  placeholder="tu@correo.com"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#a78bfa] transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-13 py-3.5 bg-white/[0.05] rounded-xl border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/40 focus:border-[#7c3aed]/30 focus:bg-white/[0.08] transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Recordarme + Olvidaste */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 border border-white/20 rounded peer-checked:border-[#7c3aed] peer-checked:bg-[#7c3aed] transition-all flex items-center justify-center">
                    {remember && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-xs text-white/40">Recordarme</span>
              </label>
              <button type="button" className="text-xs text-[#a78bfa] hover:text-[#c4b5fd] font-medium transition-colors">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón iniciar sesión */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#6d28d9] hover:to-[#5b21b6] disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_4px_30px_rgba(124,58,237,0.5)] text-sm flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Iniciar Sesión <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Crear cuenta — enlace sutil */}
          <div className="mt-10 text-center">
            <Link to="/register" className="text-xs text-white/30 hover:text-[#a78bfa] transition-colors font-medium">
              Crear una cuenta nueva
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-white/20 mt-8 tracking-wide">
          © 2026 opticællen. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
